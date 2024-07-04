'use client';

import { useWallet } from '@solana/wallet-adapter-react';

import { WalletButton } from '@/providers';
import { useGamesProgram } from '@/hooks';

import { DownloadGamesTree, GamesCreate, GamesList } from './ui';

import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';

export default function GamesFeature() {
  const { publicKey } = useWallet();
  const { programId } = useGamesProgram();

  return publicKey ? (
    <div className="max-w-7xl mx-auto px-2">
      <AppHero
        title="Games"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="tooltip tooltip-primary mb-6" data-tip="Program">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <GamesCreate />

        <div className="absolute top-20 right-10 ">
          <DownloadGamesTree />
        </div>
      </AppHero>
      <GamesList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
