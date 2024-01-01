import { Composer } from 'grammy';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

import { SuiNetwork } from '@sui-telegram-framework/sdk';

import { SuiFlavor } from '../types';

export function suiMiddleware<C extends SuiFlavor = SuiFlavor>(
  network: SuiNetwork
) {
  const suiMiddleware = new Composer<C>();

  let CLIENT: SuiClient;

  function getSuiClient() {
    if (!CLIENT) {
      const sui = new SuiClient({ url: getFullnodeUrl(network) });

      CLIENT = sui;
    }

    return CLIENT;
  }

  suiMiddleware.use(async (ctx, next) => {
    ctx.sui = getSuiClient;
    ctx.suiNetwork = network;
    await next();
  });

  return suiMiddleware;
}
