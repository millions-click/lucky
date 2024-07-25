'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { type Cluster } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { Realm } from '../realms.d';
import type { GameContext } from './game.d';
import {
  useGems,
  useLuckyPass,
  usePlayer,
  usePortal,
  useTraders,
} from '@/providers';

import { toBN } from '@luckyland/anchor';
import {
  getBountyOptions,
  getGameModeOptions,
  getPlayerGameAccountOptions,
} from '@/queries';

const Context = createContext({} as GameContext);

export function GameProvider({
  children,
  realm,
}: PropsWithChildren<{ realm: Realm | null }>) {
  const { portal, cluster } = usePortal();
  const { pass } = useLuckyPass();
  const { player, getAccount, createTokenAccount, refresh } = usePlayer();
  const { trader } = useTraders();
  const { gem } = useGems();

  const seed = useMemo(() => toBN(pass.seed.timestamp / 100000), [pass]);
  const ammo = useMemo(() => trader && getAccount(trader.mint), [trader]);
  const bag = useMemo(() => gem && getAccount(gem.mint), [gem]);

  const modeQuery = useQuery(
    getGameModeOptions(
      realm?.publicKey,
      '1',
      portal,
      cluster.network as Cluster
    )
  );
  const { mode, pda: modePda } = useMemo(
    () => modeQuery.data || { mode: null, pda: null },
    [modeQuery.data]
  );

  const bountyQuery = useQuery(
    getBountyOptions(
      modePda,
      gem?.mint,
      trader?.mint,
      portal,
      cluster.network as Cluster
    )
  );
  const { bounty, pda: bountyPda } = useMemo(
    () => bountyQuery.data || { bounty: null, pda: null },
    [bountyQuery.data]
  );

  const playerAccountQuery = useQuery(
    getPlayerGameAccountOptions(
      player,
      modePda,
      portal,
      cluster.network as Cluster
    )
  );
  const { player: playerAccount } = useMemo(
    () => playerAccountQuery.data || { player: null },
    [playerAccountQuery.data]
  );

  useEffect(() => {
    if (!player || !pass.address || player.toString() !== pass.address) {
      console.log('GameProvider', player?.toString(), pass.address);
    }
  }, []);

  const playRound = useMutation({
    mutationFn: async (choices: Array<number>) => {
      if (!player) throw new Error('Invalid player');
      if (!realm) throw new Error('Invalid game');
      if (!modePda) throw new Error('Invalid mode');
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

          game: realm.publicKey,
          mode: modePda,
          bounty: bountyPda,
        })
        .rpc();
    },
    onSuccess: () => Promise.all([refresh(), playerAccountQuery.refetch()]),
  });

  const value = {
    mode,
    bounty,
    player: playerAccount,

    ammo,
    bag,

    playRound: playRound.mutateAsync,
  } as GameContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useGame() {
  return useContext(Context);
}
