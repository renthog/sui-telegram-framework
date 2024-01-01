import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export function getClients(suiNetwork: string) {
  const sui = new SuiClient({ url: getFullnodeUrl(suiNetwork as never) });

  return { sui };
}
