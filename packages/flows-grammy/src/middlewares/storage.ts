import { Composer } from 'grammy';
import {
  KeyStorageBackend,
  UserKeyStore,
} from '@sui-telegram-framework/storage';
import { KeyStorageFlavor } from '../types';

export function keyStorageMiddleware<C extends KeyStorageFlavor>(
  backend: KeyStorageBackend
) {
  const composer = new Composer<C>();

  async function getKeystore(tgId: number) {
    return (await backend.retrieve(tgId)) ?? new UserKeyStore();
  }

  async function saveKeystore(tgId: number, keystore: UserKeyStore) {
    await backend.save(tgId, keystore);
  }

  composer.use(async (ctx, next) => {
    ctx.keystorage = () => ({
      async addKey(tgId, key) {
        const keystore = await getKeystore(tgId);
        keystore.add(key);
        await saveKeystore(tgId, keystore);
      },

      async getKey(tgId, address) {
        const keystore = await getKeystore(tgId);
        return keystore.retrieve(address);
      },

      async listKeys(tgId) {
        const keystore = await getKeystore(tgId);
        return keystore.list();
      },
    });

    await next();
  });

  return composer;
}
