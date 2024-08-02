'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PublicKey } from '@solana/web3.js';
import {
  useQueries,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';

import type { TokensContext, TokenAccount } from './tokens.d';
import type { Token } from '@utils/token';
import { useCreateTokenAccount } from './mutations';

import { getTokenAccountsOptions, getTokenOptions } from '@/queries';

const Context = createContext({
  owner: new PublicKey(0),
  tokens: [],
  mints: {},
  getAccount: (_: PublicKey) => null,
  create: async (_: PublicKey) => {
    throw new Error('Outside context provider');
  },
  refresh: async () => void 0,
} as TokensContext);

export function TokensProvider({
  children,
  owner,
}: {
  children: React.ReactNode;
  owner: PublicKey | null;
}) {
  const client = useQueryClient();
  const { connection } = useConnection();
  const accountsQuery = useQuery(getTokenAccountsOptions(connection, owner));
  const createTokenAccount = useCreateTokenAccount(owner);

  const accounts = useMemo(
    () => accountsQuery.data || [],
    [accountsQuery.data]
  );
  const tokens = useQueries({
    queries: accounts.map((account) =>
      getTokenOptions(account.account.data.parsed.info.mint, connection)
    ),
    combine: useCallback(
      (queries: UseQueryResult<Token | null, Error>[]) =>
        queries
          .map(({ data: token }, i) => {
            if (!token || !accounts[i]) return null;
            const { account, pubkey } = accounts[i];
            const address = pubkey.toString();
            const decimals = account.data.parsed.info.tokenAmount.decimals;
            const amount = account.data.parsed.info.tokenAmount.uiAmount;

            return {
              ...token,
              address,
              decimals,
              amount,
              publicKey: pubkey,
            } as TokenAccount;
          })
          .filter(Boolean) as TokenAccount[],
      [accounts]
    ),
  });
  const [mints, setMints] = useState<Record<string, TokenAccount>>({});

  useEffect(() => {
    if (!tokens.length) return setMints({});

    const debounced = setTimeout(
      () =>
        setMints(
          Object.fromEntries(
            tokens.map((token) => [token.mint.toString(), token])
          )
        ),
      100
    );

    return () => clearTimeout(debounced);
  }, [tokens]);

  const value = {
    owner,
    tokens,
    mints,
    getAccount: useCallback(
      (mint: PublicKey) => mints[mint.toString()] || null,
      [mints]
    ),
    create: createTokenAccount.mutateAsync,
    refresh: useCallback(
      async () =>
        client.invalidateQueries({
          queryKey: getTokenAccountsOptions(connection, owner).queryKey,
        }),
      [client, owner, connection]
    ),
  } as TokensContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTokens() {
  return useContext(Context);
}
