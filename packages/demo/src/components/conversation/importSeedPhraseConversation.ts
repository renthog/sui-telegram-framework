import { createConversation } from '@grammyjs/conversations';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

import { MyContext, MyConversation } from '../../types';
import { md } from '../../util';

function isValidPhrase(phrase: string) {
  return phrase.split(' ').length === 12;
}

async function handler(conversation: MyConversation, ctx: MyContext) {
  if (!ctx.from) {
    await ctx.conversation.exit();
    return;
  }

  await ctx.reply('Send the seed phrase for the account you want to import.');
  const phrase = await conversation.form.text((ctx) => ctx.conversation.exit());

  if (!isValidPhrase(phrase)) {
    await ctx.reply('Invalid seed phrase.');
    await ctx.conversation.exit();
  }

  const keypair = Ed25519Keypair.deriveKeypair(phrase);
  await ctx.keystorage().addKey(ctx.from.id, keypair);
  const address = keypair.getPublicKey().toSuiAddress();

  await ctx.reply(`Account ${md.code(address)} imported`, {
    parse_mode: 'MarkdownV2',
  });
}

const importSeedPhraseConversation = createConversation(handler, 'import-seed');

export default importSeedPhraseConversation;
