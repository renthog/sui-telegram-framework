import { ExportedKeypair, Keypair } from '@mysten/sui.js/dist/cjs/cryptography';

export class UserKeyStore {
  constructor(readonly keys: Record<string, Keypair> = {}) {}

  retrieve(address: string) {
    return this.keys[address];
  }

  add(key: Keypair) {
    this.keys[key.getPublicKey().toSuiAddress()] = key;
  }

  remove(address: string) {
    delete this.keys[address];
  }

  list() {
    return Object.keys(this.keys);
  }
}

// async function encryptKey(_key: Uint8Array, _passphrase?: string) {}

async function decryptKey(_ciphertext: Uint8Array, _passphrase?: string) {
  // TODO: do this
  // https://github.com/MystenLabs/sui/blob/main/apps/wallet/src/shared/cryptography/keystore.ts#L29
  return null as never;
}

export class UserKey {
  constructor(
    public readonly address: string,
    /**
     * Ciphertext can be the cleartext key if the user has not set a passphrase.
     */
    private readonly keyCiphertext: Uint8Array
  ) {
    // TODO: depending on the encrypt/decypt implementation, this might need to
    // store additional shit like random values
  }

  private async _decrypt(passphrase?: string): Promise<Keypair> {
    if (passphrase !== undefined) {
      return decryptKey(this.keyCiphertext, passphrase);
    }

    return null as never;
  }

  /**
   * Sign a message with the private key.
   */
  async sign(message: Uint8Array, passphrase?: string): Promise<Uint8Array> {
    const key = await this._decrypt(passphrase);
    return key.sign(message);
  }

  /**
   * Export the private key as a buffer, same behavior as the Sui web wallet.
   */
  async export(passphrase?: string | undefined): Promise<ExportedKeypair> {
    const key = await this._decrypt(passphrase);
    return key.export();
  }

  toJSON() {
    return {
      address: this.address,
      keyCiphertext: this.keyCiphertext,
    };
  }
}
