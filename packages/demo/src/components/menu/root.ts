import { Menu } from '@grammyjs/menu';

import { MyContext } from '../../types';
import { getCoinGeckoPrice } from '../../services/prices';
import { MENU_HEADER } from './components/headerMessage';

const root = new Menu<MyContext>('root')
  .row()
  .submenu('💳 Wallet', 'wallet', MENU_HEADER.wallet)
  .submenu('📫 Send Sui', 'send', MENU_HEADER.send)
  .row()
  .text('📈 Check Sui price', async (ctx) => {
    const price = await getCoinGeckoPrice('sui');
    await ctx.reply(
      `Current Sui price: $${price}\n\nhttps://www.coingecko.com/en/coins/sui`,
      // error TS2353: Object literal may only specify known properties, and 'disable_web_page_preview' does not exist in type 'Other<"sendMessage", "text" | "chat_id">'.
      {
        // @ts-ignore
        disable_web_page_preview: true,
      }
    );
  });

export default root;
