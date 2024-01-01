import { Menu } from '@grammyjs/menu';

import getSuiBalance from '@sui-telegram-framework/sdk/src/sui/getSuiBalance';

import { MENU_HEADER } from './components/headerMessage';
import { MyContext } from '../../types';
import { accountSelector } from './components/accountSelector';
import { createKey } from '../../services/keys';
import { getCoinGeckoPrice } from '../../services/prices';
import { md } from '../../util';
import { getExplorerUrl } from '@sui-telegram-framework/sdk';

const wallet = new Menu<MyContext>('wallet')
  .dynamic(
    accountSelector({
      async onSelect(ctx, address) {
        ctx.session.selectedAddress = address;
        const currentSuiPrice = await getCoinGeckoPrice('sui');
        const { balanceDecimal } = await getSuiBalance(ctx.sui(), address);
        await ctx.editMessageText(
          `Account: ${md.code(address)}` +
            '\n\n' +
            `🌐 Network: ${md.code(ctx.suiNetwork ?? '')}\n` +
            `💰 Balance: ${md.code(balanceDecimal.toFixed(3))} SUI\n` +
            `💲 Value: ${md.code(
              (balanceDecimal * currentSuiPrice).toFixed(3)
            )} USD` +
            `\n\n${md.escape(getExplorerUrl(address, 'address'))}`,
          {
            parse_mode: 'MarkdownV2',
            // @ts-ignore typescript bug
            disable_web_page_preview: true,
          }
        );
      },
      navTo: 'wallet-details',
    })
  )
  .text('👼 Create new account', async (ctx) => {
    const { keypair } = createKey();
    await ctx.keystorage().addKey(ctx.from.id, keypair);

    const address = keypair.getPublicKey().toSuiAddress();
    ctx.session.selectedAddress = address;
    await ctx.editMessageText(
      'Your account has been created\\. You can now receive Sui coins at this address:\n\n' +
        md.code(address) +
        '\n\nSelect your account below to view more details',
      { parse_mode: 'MarkdownV2' }
    );
  })
  .submenu('📥 Import account', 'import', async (ctx, next) => {
    await ctx.editMessageText(
      'You can import an existing wallet, using one of the options below. If you have a seed phrase, you can import it directly. If you have a private key, you can import it as well.'
    );
    await next();
  })
  .row()
  .back('Back to main menu');

const walletImport = new Menu<MyContext>('import')
  .text('Import from seed phrase', (ctx) =>
    ctx.conversation.enter('import-seed')
  )
  .text('Import from private key')
  .row()
  .back('Back to wallet menu', MENU_HEADER.wallet);

const walletDetails = new Menu<MyContext>('wallet-details')
  .text('📫 Send Sui', async (ctx, next) => {
    await ctx.conversation.enter('send');
    await next();
  })
  .row()
  .submenu('📤 Export account', 'wallet-export', async (ctx) => {
    if (!ctx.session.selectedAddress) {
      // should never happen
      await ctx.reply('Please select an account first.');
      return;
    }

    const key = await ctx
      .keystorage()
      .getKey(ctx.from.id, ctx.session.selectedAddress);

    if (!key) {
      // should never happen
      await ctx.reply('Account not found');
      return;
    }

    await ctx.editMessageText(
      'Your private key is:\n\n' +
        md.code(key.export().privateKey) +
        '\n\nClick below to hide this message',
      { parse_mode: 'MarkdownV2' }
    );
  })
  .row()
  .back('Back to wallet menu', MENU_HEADER.wallet);

const walletExport = new Menu<MyContext>('wallet-export').back(
  'Close',
  MENU_HEADER.wallet
);

wallet.register(walletDetails);
wallet.register(walletImport);
wallet.register(walletExport);

export default wallet;
