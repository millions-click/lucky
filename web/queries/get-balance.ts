import { Connection, PublicKey } from '@solana/web3.js';
import { queryOptions } from '@tanstack/react-query';

export function getBalanceOptions(
  address: PublicKey | null,
  connection: Connection
) {
  return queryOptions({
    queryKey: ['get-balance', { endpoint: connection.rpcEndpoint, address }],
    queryFn: () => (address ? connection.getBalance(address) : 0),
    enabled: Boolean(address),
  });
}
