import Task, { TaskMode } from '../../src/task';

export type MetisStableDeployment = {
  Vault: string;
  ComposableStablePoolFactory: string;
  ProtocolFeePercentagesProvider: string;
  PoolVersion: string;
  admin: string;
  DAI: string;
  USDT: string;
  USDC: string;
};

const admin = '0xfeedC50149AEeD26AA262927D02F720F96580647';
const Vault = new Task('20210418-vault', TaskMode.READ_ONLY);
const ComposableStablePoolFactory = new Task('20230711-composable-stable-pool-v5', TaskMode.READ_ONLY);
const ProtocolFeePercentagesProvider = new Task('20220725-protocol-fee-percentages-provider', TaskMode.READ_ONLY);
const DAI = new Task('00000000-tokens', TaskMode.READ_ONLY);
const USDC = new Task('00000000-tokens', TaskMode.READ_ONLY);
const USDT = new Task('00000000-tokens', TaskMode.READ_ONLY);

const BaseVersion = { version: 5, deployment: '20230711-composable-stable-pool-v5' };

export default {
  admin,
  Vault,
  ComposableStablePoolFactory,
  ProtocolFeePercentagesProvider,
  PoolVersion: JSON.stringify({ name: 'ComposableStablePool', ...BaseVersion }),
  USDC,
  USDT,
  DAI,
};
