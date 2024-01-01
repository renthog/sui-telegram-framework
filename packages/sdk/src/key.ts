import { PublicKey } from '@mysten/sui.js/cryptography';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { Secp256k1Keypair } from '@mysten/sui.js/keypairs/secp256k1';
import { Secp256r1Keypair } from '@mysten/sui.js/keypairs/secp256r1';

export type KeypairType = 'Ed25519' | 'Secp256k1' | 'Secp256r1';
export type KeyPairResult = {
  privateKey: string;
  publicKey: PublicKey;
  keyPairType: KeypairType;
};

export function generateKeypair(
  type: KeypairType = 'Ed25519',
  mnemonic: string
): KeyPairResult {
  let keypair;
  switch (type) {
    case 'Ed25519':
      keypair = Ed25519Keypair.deriveKeypair(mnemonic);
      break;
    case 'Secp256k1':
      keypair = Secp256k1Keypair.deriveKeypair(mnemonic);
      break;
    case 'Secp256r1':
      keypair = Secp256r1Keypair.deriveKeypair(mnemonic);
      break;
    default:
      throw new Error(`Unsupported keypair type: ${type}`);
  }
  return {
    privateKey: keypair.export().privateKey,
    publicKey: keypair.getPublicKey(),
    keyPairType: type,
  };
}
