import BN from 'bn.js';

import { CoinMetadata, SuiClient } from '@mysten/sui.js/dist/cjs/client';
import { bnToApproximateDecimal } from '../bn';

let _COIN_METADATA_CACHE: Record<string, CoinMetadata> = {};

export async function getCoinMetadata(sui: SuiClient, coinType: string) {
  if (!_COIN_METADATA_CACHE[coinType]) {
    const meta = await sui.getCoinMetadata({
      coinType,
    });
    if (!meta) {
      throw new Error('No coin metadata for ' + coinType);
    }
    _COIN_METADATA_CACHE[coinType] = meta;
  }

  return _COIN_METADATA_CACHE[coinType];
}

export default async function getTotalBalance(
  client: SuiClient,
  owner: string,
  coinType: string
) {
  const { data: ownedCoins } = await client.getAllCoins({
    owner,
    // unlikely to matter for this application because every tx smashes balances
    cursor: undefined,
    limit: 50,
  });

  const metadata = await getCoinMetadata(client, coinType);

  const balanceBn =
    ownedCoins
      ?.filter((c) => c.coinType === coinType)
      .reduce((acc, cur) => acc.add(new BN(cur.balance)), new BN(0)) ||
    new BN(0);

  const coinIds =
    ownedCoins
      ?.filter((c) => c.coinType === coinType)
      .map((c) => c.coinObjectId) ?? [];

  return {
    balanceBn,
    balanceDecimal: bnToApproximateDecimal(balanceBn, metadata.decimals),
    coinIds,
  };
}
