import {
  type Cluster as Web3Cluster,
  Connection,
  clusterApiUrl,
  Keypair,
} from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import * as process from 'node:process';

export interface Cluster {
  name: string;
  endpoint: string;
  network?: ClusterNetwork;
  active?: boolean;
  asCluster: () => Web3Cluster;
  headers?: Record<string, string>;
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  local = 'local',
}

const {
  QUICKNODE_RPC_URL,
  QUICKNODE_API_KEY,
  QUICKNODE_DEVNET_RPC_URL,
  QUICKNODE_DEVNET_API_KEY,
} = process.env;

export const CLUSTERS = Object.fromEntries(
  [
    {
      name: ClusterNetwork.Devnet,
      endpoint: clusterApiUrl(ClusterNetwork.Devnet),
      network: ClusterNetwork.Devnet,
    },
    {
      name: ClusterNetwork.local,
      endpoint: 'http://localhost:8899',
    },
    {
      name: ClusterNetwork.Testnet,
      endpoint: clusterApiUrl(ClusterNetwork.Testnet),
      network: ClusterNetwork.Testnet,
    },
    {
      name: ClusterNetwork.Mainnet,
      endpoint: clusterApiUrl(ClusterNetwork.Mainnet),
      network: ClusterNetwork.Mainnet,
    },
    {
      name: 'lucky',
      endpoint: `${QUICKNODE_RPC_URL}/${QUICKNODE_API_KEY}`,
      network: ClusterNetwork.Mainnet,
    },
    {
      name: 'lucky-dev',
      endpoint: `${QUICKNODE_DEVNET_RPC_URL}/${QUICKNODE_DEVNET_API_KEY}`,
      network: ClusterNetwork.Devnet,
    },
  ].map((cluster) => [
    cluster.name,
    {
      ...cluster,
      asCluster: () => cluster.network as Web3Cluster,
    },
  ])
) as Record<ClusterNetwork, Cluster>;

export function createConnection(cluster: Cluster) {
  return new Connection(cluster.endpoint);
}

export function createProvider(connection: Connection, keypair: Keypair) {
  const wallet = new Wallet(keypair);
  return new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
}
