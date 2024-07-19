import { config } from 'dotenv';
config();

import { CLUSTERS, createConnection } from './utils';

import { LoadPortal } from './utils';
import { CreateGem, CreateTrader } from './tokens';
import {
  CreateTreasure,
  InitGames,
  InitStronghold,
  LaunchTrader,
  LaunchStore,
  FillStock,
  UpsertGameModes,
  PublishBounties,
  FundBounties,
} from './features';

const { CLUSTER } = process.env;
if (!CLUSTER) throw new Error('CLUSTER is required');

const cluster = CLUSTERS[CLUSTER as keyof typeof CLUSTERS];
if (!cluster) throw new Error(`Cluster ${CLUSTER} not found`);

console.log(`Cluster: ${cluster.name} | Endpoint: ${cluster.endpoint}`);
console.log(`------------------------------------------------`);

const connection = createConnection(cluster);

LoadPortal(connection, cluster)
  .then(async (portal) => {
    await CreateTreasure(portal, cluster);

    const [modes, { gem }, { trader }] = await Promise.all([
      (async () => {
        const games = await InitGames(portal);
        return UpsertGameModes(portal, games);
      })(),
      (async () => {
        const { gem } = await CreateGem(connection, cluster);
        return InitStronghold(gem, portal);
      })(),
      (async () => {
        const { trader, store: reserve } = await CreateTrader(
          connection,
          cluster
        );
        const { trader: token } = await LaunchTrader(portal, trader);
        const { store } = await LaunchStore(portal, token);
        const { collector } = await FillStock(portal, token, reserve);

        return { trader: token, store, collector };
      })(),
    ]);

    await PublishBounties(portal, modes, gem, trader);
    await FundBounties(portal, gem);
  })
  .catch((e) => {
    console.error('Failed to run script.');
    console.error(e);
  });
