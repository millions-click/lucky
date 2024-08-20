'use client';

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  ComponentProps,
  useMemo,
} from 'react';
import { PublicKey } from '@solana/web3.js';
import { useTranslations } from 'next-intl';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';

import type { WinnersContext } from './winners.d';
import { PortalProvider, usePortal } from '@/providers';

import { ellipsify } from '@/utils';
import { ExplorerWrapper } from '@/components/cluster/cluster-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useScreenSize } from '@/hooks';

const Context = createContext({} as WinnersContext);

function Notification({ player }: { player: string }) {
  const t = useTranslations('Components.Leaderboard.Notification');

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-0.5">
      <div className="flex-shrink-0">
        <img
          className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
          src={`https://api.dicebear.com/9.x/bottts/svg?seed=${player}`}
          alt="avatar"
        />
      </div>
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-medium text-ambar-100">
          {t('new-winner', { player: ellipsify(player) })}
        </p>
      </div>
    </div>
  );
}

type ProviderProps = PropsWithChildren<{
  ignore?: PublicKey | null;
  enabled?: boolean;
  limit?: number;
}>;

function Provider({
  ignore,
  enabled = true,
  limit = 2,
  children,
}: ProviderProps) {
  const { cluster, portal } = usePortal();
  const [active, setActive] = useState(enabled);
  const { toasts } = useToasterStore();

  useEffect(() => {
    if (toasts.length <= limit) return;

    const debounce = setTimeout(
      () => toasts.slice(limit).forEach(({ id }) => toast.dismiss(id)),
      100
    );

    return () => clearTimeout(debounce);
  }, [toasts.length, limit]);

  useEffect(() => {
    if (!active && !portal) return;

    const subscriptionId = portal.addEventListener(
      'winnerEvent',
      (event, _slot, signature) => {
        if (ignore && ignore.equals(event.player)) return;
        toast.custom(
          (t) => (
            <ExplorerWrapper
              path={`tx/${signature}`}
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } bg-neutral text-white shadow-lg rounded-full pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              onClick={() => toast.dismiss(t.id)}
            >
              <Notification player={event.player.toString()} />
            </ExplorerWrapper>
          ),
          { duration: 2000, id: signature }
        );
      }
    );

    return () => {
      portal.removeEventListener(subscriptionId);
    };
  }, [portal, cluster, active, ignore]);

  const value = {
    setActive,
  } as WinnersContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function WinnersProvider({
  children,
  position,
  containerStyle = {
    top: 24,
    left: 16,
    bottom: 24,
    right: 16,
  },
  ...props
}: ProviderProps &
  Pick<ComponentProps<typeof Toaster>, 'containerStyle' | 'position'>) {
  const { publicKey } = useWallet();

  const screenSize = useScreenSize();
  const _position = useMemo(() => {
    if (position) return position;

    switch (screenSize) {
      case 'lg':
      case 'md':
        return 'top-center';
      default:
        return 'top-right';
    }
  }, [screenSize, position]);

  return (
    <>
      <Toaster position={_position} containerStyle={containerStyle} />
      <Provider ignore={publicKey} {...props}>
        {children}
      </Provider>
    </>
  );
}

export function WinnersWithPortalProvider({
  children,
  ...props
}: ComponentProps<typeof WinnersProvider>) {
  return (
    <PortalProvider>
      <WinnersProvider {...props}>{children}</WinnersProvider>
    </PortalProvider>
  );
}

export function useWinners() {
  return useContext(Context);
}
