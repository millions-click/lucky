import { Connection, PublicKey } from '@solana/web3.js';
import { queryOptions } from '@tanstack/react-query';

import { getToken } from '@utils/token';

export function getTokenOptions(mint: PublicKey, connection: Connection) {
  return queryOptions({
    queryKey: ['get-token', { mint, endpoint: connection.rpcEndpoint }],
    queryFn: () => getToken(mint, connection),
  });
}
