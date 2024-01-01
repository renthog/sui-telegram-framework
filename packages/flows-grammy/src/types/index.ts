import { Context } from 'grammy';
import { SuiClient } from '@mysten/sui.js/dist/cjs/client';
import { Keypair } from '@mysten/sui.js/dist/cjs/cryptography';

import { SuiNetwork } from '@sui-telegram-framework/sdk';

export type KeyStorageFlavor<C extends Context = Context> = C & {
  keystorage: () => {
    addKey(tgId: number, key: Keypair): Promise<void>;
    getKey(tgId: number, address: string): Promise<Keypair | undefined>;
    listKeys(tgId: number): Promise<string[]>;
  };
};

export type SuiFlavor<C extends Context = Context> = C & {
  sui(): SuiClient;
  suiNetwork: SuiNetwork;
};
