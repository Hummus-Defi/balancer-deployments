import Task, { TaskMode } from '../../src/task';

export type MetisSfrxEthPoolDeployment = {
  Vault: string;
  WeightedPoolFactory: string;
  ProtocolFeePercentagesProvider: string;
  PoolVersion: string;
  admin: string;
  SFRXETH: string;
  WETH: string; // metis
  SFRXETH_PROVIDER: string;
  METIS_PROVIDER: string;
};

const admin = '0xfeedC50149AEeD26AA262927D02F720F96580647';
const Vault = new Task('20210418-vault', TaskMode.READ_ONLY);
const WeightedPoolFactory = new Task('20230320-weighted-pool-v4', TaskMode.READ_ONLY);
const ProtocolFeePercentagesProvider = new Task('20220725-protocol-fee-percentages-provider', TaskMode.READ_ONLY);
const SFRXETH = new Task('00000000-tokens', TaskMode.READ_ONLY);
const WETH = new Task('00000000-tokens', TaskMode.READ_ONLY);
const SFRXETH_PROVIDER = new Task('00000001-rate-providers', TaskMode.READ_ONLY);
const METIS_PROVIDER = new Task('00000001-rate-providers', TaskMode.READ_ONLY);

const BaseVersion = { version: 4, deployment: '20230320-weighted-pool-v4' };

export default {
  admin,
  Vault,
  WeightedPoolFactory,
  ProtocolFeePercentagesProvider,
  PoolVersion: JSON.stringify({ name: 'WeightedPool', ...BaseVersion }),
  WETH,
  SFRXETH,
  SFRXETH_PROVIDER,
  METIS_PROVIDER,
};
