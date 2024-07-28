'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type Cluster } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { Realm } from '../realms.d';
import type { GameContext, GameState } from './game.d';
import {
  useBounties,
  useGems,
  useLuckyPass,
  usePlayer,
  usePortal,
  useTraders,
} from '@/providers';

import { getBountyPDA, getBountyVaultPDA, toBN } from '@luckyland/anchor';
import { getPlayerGameAccountOptions } from '@/queries';
import { sortedGames } from '@/models/game';

const Context = createContext({} as GameContext);

export function GameProvider({
  children,
  realm,
  id,
}: PropsWithChildren<{ realm: Realm | null; id?: string }>) {
  const { portal, cluster } = usePortal();
  const { pass } = useLuckyPass();
  const { player, getAccount, createTokenAccount, refresh } = usePlayer();
  const { trader } = useTraders();
  const { gem } = useGems();
  const { getBounty } = useBounties();

  const seed = useMemo(() => toBN(pass.seed.timestamp / 100000), [pass]);
  const ammo = useMemo(
    () => trader && getAccount(trader.mint),
    [trader, getAccount]
  );
  const bag = useMemo(() => gem && getAccount(gem.mint), [gem]);

  const [active, setActive] = useState<string>();
  const game = useMemo(
    () => (active && realm?.games ? realm.games[active] : null),
    [realm?.games, active]
  );

  const bountyPda = useMemo(
    () =>
      game && trader && gem
        ? getBountyPDA(
            game.pda,
            gem.mint,
            trader.mint,
            cluster.network as Cluster
          )
        : null,
    [game, trader, gem]
  );
  const bounty = useMemo(
    () => (bountyPda && game ? game.bounties[bountyPda.toString()] : null),
    [game, bountyPda]
  );

  const vaultPda = useMemo(
    () => bountyPda && getBountyVaultPDA(bountyPda, cluster.network as Cluster),
    [bountyPda]
  );
  const vault = useMemo(() => vaultPda && getBounty(vaultPda), [vaultPda]);

  const playerAccountQuery = useQuery(
    getPlayerGameAccountOptions(
      player,
      game?.pda,
      portal,
      cluster.network as Cluster
    )
  );
  const { player: playerAccount } = useMemo(
    () => playerAccountQuery.data || { player: null },
    [playerAccountQuery.data]
  );

  const state: GameState = useMemo(() => {
    if (!id) return 'idle';
    if (!bounty) return 'loading';
    if (!playerAccount) return 'newbie';
    if (!ammo || Number(ammo.balance) < bounty.price.toNumber())
      return 'not-enough-ammo';

    return playerAccount.winner ? 'winner' : 'loser';
  }, [ammo?.balance, bounty?.price, playerAccount?.winner]);

  useEffect(() => {
    if (active) return;
    if (!realm) return;

    const games = sortedGames(realm.games);
    const game = games.shift();
    if (!game) throw new Error('No games found');

    setActive(game.pda.toString());
  }, [realm]);

  const playRound = useMutation({
    mutationFn: async (choices: Array<number>) => {
      if (!player) throw new Error('Invalid player');
      if (!realm) throw new Error('Invalid game');
      if (!game?.pda) throw new Error('Invalid mode');
      if (!bountyPda) throw new Error('Invalid bounty');
      if (!ammo) throw new Error('Invalid ammo');

      let bagKey = bag?.publicKey;
      if (!bagKey) {
        if (!gem) throw new Error('Invalid gem');
        const { address } = await createTokenAccount(gem.mint);
        // TODO: Wait for the new bag to be created. This is a temporary solution.
        bagKey = await new Promise((resolve) =>
          setTimeout(() => resolve(address), 3000)
        );
      }

      return portal.methods
        .playRound({
          seed,
          choices,
        })
        .accounts({
          owner: player,
          ammo: ammo.publicKey,
          bag: bagKey!,

          game: realm.pda,
          mode: game.pda,
          bounty: bountyPda,
        })
        .rpc();
    },
    onSuccess: () => Promise.all([refresh(), playerAccountQuery.refetch()]),
  });

  const value = {
    id,
    state,
    game,
    bounty,
    player: playerAccount,

    ammo,
    bag,
    vault,

    playRound: playRound.mutateAsync,
  } as GameContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useGame() {
  return useContext(Context);
}
