import { SuiClient } from '@mysten/sui.js/dist/cjs/client';

import getTotalBalance from './getTotalBalance';
import { SUI_COIN_TYPE } from '../constants';

export default async function getSuiBalance(client: SuiClient, owner: string) {
  return await getTotalBalance(client, owner, SUI_COIN_TYPE);
}
