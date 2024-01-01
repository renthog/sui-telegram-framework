import { TransactionBlock } from '@mysten/sui.js/transactions';
import { createConversation } from '@grammyjs/conversations';

import { mergeCoinsAndSplit } from '@sui-telegram-framework/sdk/src/tx/coin';

import { MyContext, MyConversation } from '../../types';
import { md } from '../../util';
import { getExplorerUrl, toSuiAmountNative } from '@sui-telegram-framework/sdk';
import { SUI_COIN_TYPE } from '@sui-telegram-framework/sdk/src/constants';
import getTotalBalance from '@sui-telegram-framework/sdk/src/sui/getTotalBalance';

const cancelTransaction = async (ctx: MyContext) => {
  await ctx.reply('Transaction cancelled.');
  await ctx.conversation.exit();
};

function isValidAddress(address: string) {
  return address.match(/^0x[a-fA-F0-9]{64}$/);
}

/**
 * Prerequisite: the user has selected an address (use the account selector menu)
 */
async function handler(conversation: MyConversation, ctx: MyContext) {
  if (!ctx.session.selectedAddress || !ctx.from) {
    await ctx.reply('No address selected');
    await ctx.conversation.exit();
    return;
  }

  const keypair = await ctx
    .keystorage()
    .getKey(ctx.from.id, ctx.session.selectedAddress);
  if (!keypair) {
    await ctx.reply('Account not found');
    await ctx.conversation.exit();
    return;
  }

  await ctx.reply('How much SUI do you want to send?');
  const amountDecimal = await conversation.form.number(async (ctx) => {
    await ctx.reply('A number is required.');
    await cancelTransaction(ctx);
  });

  const { balanceDecimal } = await getTotalBalance(
    ctx.sui(),
    ctx.session.selectedAddress,
    SUI_COIN_TYPE
  );
  if (amountDecimal <= 0 || amountDecimal > balanceDecimal) {
    await ctx.reply('Invalid amount.');
    await ctx.conversation.exit();
    return;
  }

  await ctx.reply('What is the recipient address?');
  const recipientAddress = await conversation.form.text(cancelTransaction);
  if (!isValidAddress(recipientAddress)) {
    await ctx.reply('Invalid address.');
    await cancelTransaction(ctx);
  }

  await ctx.reply(
    'Please confirm the transaction details' +
      '\n\n' +
      `Sender: ${md.code(ctx.session.selectedAddress || 'NONE')}` +
      '\n\n' +
      `Recipient: ${md.code(recipientAddress)}` +
      '\n\n' +
      `Amount: ${md.code(amountDecimal.toFixed(5))} SUI` +
      '\n\n' +
      'Respond with "yes" to confirm the transaction\\.',
    { parse_mode: 'MarkdownV2' }
  );
  const confirm = await conversation.form.text();
  if (confirm === 'yes') {
    await ctx.reply('Transaction confirmed. Sending SUI...');
    // TODO: sign and send transaction
    const { coinIds } = await getTotalBalance(
      ctx.sui(),
      ctx.session.selectedAddress,
      SUI_COIN_TYPE
    );
    const tx = new TransactionBlock();
    const coin = mergeCoinsAndSplit(tx, {
      amountNative: toSuiAmountNative(amountDecimal),
      coinObjectIds: coinIds,
      coinType: SUI_COIN_TYPE,
    });
    tx.transferObjects([coin], recipientAddress);

    const resp = await ctx.sui().signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: keypair,
    });

    if (resp.errors?.length) {
      await ctx.reply(
        'An error occurred while sending SUI\\.\n\n' +
          `${md.escape(getExplorerUrl(resp.digest, 'txblock', 'mainnet'))}`,
        { parse_mode: 'MarkdownV2' }
      );
    } else {
      await ctx.reply(
        'SUI sent successfully\\.\n\n' +
          `${md.escape(getExplorerUrl(resp.digest, 'txblock', 'mainnet'))}`,
        { parse_mode: 'MarkdownV2' }
      );
    }
  } else {
    await cancelTransaction(ctx);
  }
}

const sendSuiConversation = createConversation(handler, 'send');

export default sendSuiConversation;
