'use client';

import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { StoreCreate, StoreList } from './store-ui';

import { getTollkeeperPDA } from '@luckyland/anchor';
import { useStoreProgram } from '@/hooks';
import { WalletButton } from '@/providers';

export default function StoreFeature() {
  const { publicKey } = useWallet();
  const { programId } = useStoreProgram();
  const ownerPDA = useMemo(() => getTollkeeperPDA(), []);

  return publicKey ? (
    <div>
      <AppHero
        title="Store"
        subtitle={
          'InitVault a new account by clicking the "InitVault" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <div className="flex flex-row gap-8 items-center justify-center mb-6">
          <p className="tooltip tooltip-primary" data-tip="Program">
            <ExplorerLink
              path={`account/${programId}`}
              label={ellipsify(programId.toString())}
            />
          </p>
          <p className="tooltip tooltip-accent" data-tip="Vault Owner">
            <ExplorerLink
              path={`account/${ownerPDA}`}
              label={ellipsify(ownerPDA.toString())}
            />
          </p>
        </div>
        <StoreCreate owner={publicKey} />
      </AppHero>
      <StoreList />
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
