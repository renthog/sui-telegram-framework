import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { generateMnemonic } from '@sui-telegram-framework/sdk';

export function createKey() {
  const phrase = generateMnemonic();
  return { phrase, keypair: Ed25519Keypair.deriveKeypair(phrase) };
}
