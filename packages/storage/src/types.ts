import { UserKeyStore } from './user-key';

export interface KeyStorageBackend<AuthData = unknown> {
  save(
    tgId: number,
    keystore: UserKeyStore,
    authData?: AuthData
  ): Promise<void>;
  delete(tgId: number, authData?: AuthData): Promise<void>;
  retrieve(tgId: number, authData?: AuthData): Promise<UserKeyStore | null>;
}
