'use client';

import { useWallet } from '@solana/wallet-adapter-react';

import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { usePresaleProgram } from './presale-data-access';
import { PresaleCreate, PresaleList } from './presale-ui';

import { WalletButton } from '@/providers';

export default function PresaleFeature() {
  const { publicKey } = useWallet();
  const { programId } = usePresaleProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Presale"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <PresaleCreate owner={publicKey} />
      </AppHero>
      <PresaleList />
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
