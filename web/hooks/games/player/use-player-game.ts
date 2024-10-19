import { PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { getPlayerPDA, toBN } from '@luckyland/anchor';
import { useCluster } from '@/providers';
import {
  useBountyAccount,
  useGamesProgram,
  useOwnedToken,
  usePlayer,
  useTransactionToast,
} from '@/hooks';
import { useMemo } from 'react';

const seed = () => toBN(Math.floor(Math.random() * 1000000));
const choices = (choice: number, slots: number) =>
  Array.from({ length: slots }, () => choice);

export function usePlayerGame({
  bounty,
  onSucceed,
}: {
  bounty: PublicKey;
  onSucceed?: () => void;
}) {
  const { owner } = usePlayer();
  const { cluster } = useCluster();
  const { gem, trader, price, mode } = useBountyAccount({ pda: bounty });
  const { program } = useGamesProgram();
  const transactionToast = useTransactionToast();

  const bag = useOwnedToken(owner, gem?.mint);
  const ammo = useOwnedToken(owner, trader?.mint);
  const playerPDA = useMemo(() => {
    if (!mode) return;
    return getPlayerPDA(owner, mode.publicKey);
  }, [owner, mode]);

  const player = useQuery({
    queryKey: ['player', 'account', { cluster, bounty }],
    queryFn: async () => {
      if (!playerPDA) throw new Error('Player not found');
      return program.account.player.fetch(playerPDA);
    },
  });

  const playRound = useMutation({
    mutationKey: ['player', 'playRound', { cluster, bounty }],
    mutationFn: async () => {
      if (!mode) throw new Error('Mode not found');
      if (!bag.token) throw new Error('Bag not found');
      if (!ammo.token || ammo.token.amount < price)
        throw new Error('Not enough ammo for this game');

      return program.methods
        .playRound({
          seed: seed(),
          choices: choices(
            Math.floor(Math.random() * mode.account.choices) + 1,
            mode.account.slots
          ),
        })
        .accounts({
          owner,
          game: mode.account.game,
          mode: mode.publicKey,
          bounty,
          bag: bag.token.address,
          ammo: ammo.token.address,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx, 'Game played');
      if (onSucceed) onSucceed();
      return Promise.all([bag.refresh(), ammo.refresh(), player.refetch()]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { player, account: playerPDA, bag, ammo, playRound };
}
