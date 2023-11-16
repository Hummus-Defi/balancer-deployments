import { getContractDeploymentTransactionHash, saveContractDeploymentTransactionHash } from '../../src/network';
import { ZERO_ADDRESS, ZERO_BYTES32 } from '../../src/helpers/constants';
import Task from '../../src/task';
import { TaskRunOptions } from '../../src/types';
import { MetisStableDeployment } from './input';
import { bn, fp } from '../../src/helpers/numbers';
import * as expectEvent from '../../src/helpers/expectEvent';
import { ethers } from 'hardhat';

export default async (task: Task, { force, from }: TaskRunOptions = {}): Promise<void> => {
  const input = task.input() as MetisStableDeployment;

  const factory = await task.instanceAt('ComposableStablePoolFactory', input.ComposableStablePoolFactory);

  // We also create a Pool using the factory and verify it, to let us compute their action IDs and so that future
  // Pools are automatically verified. We however don't run any of this code in CHECK mode, since we don't care about
  // the contracts deployed here. The action IDs will be checked to be correct via a different mechanism.
  const newStablePoolParams = {
    vault: input.Vault,
    protocolFeeProvider: input.ProtocolFeePercentagesProvider,
    name: 'Tri Stable',
    symbol: 'TRI',
    tokens: [input.DAI, input.USDT, input.USDC].sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }),
    rateProviders: [ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
    tokenRateCacheDurations: [10800, 10800, 10800],
    exemptFromYieldProtocolFeeFlag: false,
    amplificationParameter: bn(200),
    swapFeePercentage: bn(1e14),
    pauseWindowDuration: undefined,
    bufferPeriodDuration: undefined,
    owner: input.admin,
    version: input.PoolVersion,
  };

  const poolCreationReceipt = await (
    await factory.create(
      newStablePoolParams.name,
      newStablePoolParams.symbol,
      newStablePoolParams.tokens,
      newStablePoolParams.amplificationParameter,
      newStablePoolParams.rateProviders,
      newStablePoolParams.tokenRateCacheDurations,
      newStablePoolParams.exemptFromYieldProtocolFeeFlag,
      newStablePoolParams.swapFeePercentage,
      newStablePoolParams.owner,
      ZERO_BYTES32
    )
  ).wait();
  const event = expectEvent.inReceipt(poolCreationReceipt, 'PoolCreated');
  const poolAddress = event.args.pool;

  await saveContractDeploymentTransactionHash(poolAddress, poolCreationReceipt.transactionHash, task.network);
  await task.save({ TriCryptoPool: poolAddress });

  const pool = await task.instanceAt('ComposableStablePool', task.output()['TriCryptoPool']);

  // In order to verify the Pool's code, we need to complete its constructor arguments by computing the factory
  // provided arguments (pause durations).

  // The durations require knowing when the Pool was created, so we look for the timestamp of its creation block.
  const txHash = await getContractDeploymentTransactionHash(pool.address, task.network);
  const tx = await ethers.provider.getTransactionReceipt(txHash);
  const poolCreationBlock = await ethers.provider.getBlock(tx.blockNumber);

  // With those and the period end times, we can compute the durations.
  const { pauseWindowEndTime, bufferPeriodEndTime } = await pool.getPausedState();
  newStablePoolParams.pauseWindowDuration = pauseWindowEndTime.sub(poolCreationBlock.timestamp);
  newStablePoolParams.bufferPeriodDuration = bufferPeriodEndTime
    .sub(poolCreationBlock.timestamp)
    .sub(newStablePoolParams.pauseWindowDuration);

  // We are now ready to verify the Pool
  await task.verify('ComposableStablePool', pool.address, [newStablePoolParams]);
};
