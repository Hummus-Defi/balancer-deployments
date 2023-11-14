import Task, { TaskMode } from '../../src/task';

export type QuadCryptoDeployment = {
  Vault: string;
  WeightedPoolFactory: string;
  ProtocolFeePercentagesProvider: string;
  PoolVersion: string;
  admin: string;
  WETH: string; // metis
  USDC: string;
  WBTC: string;
  ETH: string;
  BTC_PROVIDER: string;
  ETH_PROVIDER: string;
  METIS_PROVIDER: string;
  USDC_PROVIDER: string;
};

const admin = '0xfeedC50149AEeD26AA262927D02F720F96580647';
const Vault = new Task('20210418-vault', TaskMode.READ_ONLY);
const WeightedPoolFactory = new Task('20230320-weighted-pool-v4', TaskMode.READ_ONLY);
const ProtocolFeePercentagesProvider = new Task('20220725-protocol-fee-percentages-provider', TaskMode.READ_ONLY);
const WETH = new Task('00000000-tokens', TaskMode.READ_ONLY);
const USDC = new Task('00000000-tokens', TaskMode.READ_ONLY);
const WBTC = new Task('00000000-tokens', TaskMode.READ_ONLY);
const ETH = new Task('00000000-tokens', TaskMode.READ_ONLY);
const BTC_PROVIDER = new Task('00000001-rate-providers', TaskMode.READ_ONLY);
const ETH_PROVIDER = new Task('00000001-rate-providers', TaskMode.READ_ONLY);
const METIS_PROVIDER = new Task('00000001-rate-providers', TaskMode.READ_ONLY);
const USDC_PROVIDER = new Task('00000001-rate-providers', TaskMode.READ_ONLY);

const BaseVersion = { version: 4, deployment: '20230320-weighted-pool-v4' };

export default {
  admin,
  Vault,
  WeightedPoolFactory,
  ProtocolFeePercentagesProvider,
  PoolVersion: JSON.stringify({ name: 'WeightedPool', ...BaseVersion }),
  WETH,
  USDC,
  WBTC,
  ETH,
  BTC_PROVIDER,
  ETH_PROVIDER,
  METIS_PROVIDER,
  USDC_PROVIDER,
};