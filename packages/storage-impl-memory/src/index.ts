import {
  KeyStorageBackend,
  UserKeyStore,
} from '@sui-telegram-framework/storage';

const storage = new Map<string, UserKeyStore>();

export class InMemoryKeyStorageBackend implements KeyStorageBackend {
  async save(tgId: number, keystore: UserKeyStore): Promise<void> {
    storage.set(tgId.toString(), keystore);
  }

  async delete(tgId: number): Promise<void> {
    storage.delete(tgId.toString());
  }

  async retrieve(tgId: number): Promise<UserKeyStore | null> {
    return storage.get(tgId.toString()) ?? null;
  }
}
