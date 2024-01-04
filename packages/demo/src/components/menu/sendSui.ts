import { Menu } from '@grammyjs/menu';

import accountSelectorMenu from '@sui-telegram-framework/flows-grammy/src/menus/accountSelectorMenu';

import { MyContext } from '../../types';
import { MENU_HEADER } from './components/headerMessage';

const sendSui = new Menu<MyContext>('send')
  .dynamic(
    accountSelectorMenu({
      async onSelect(ctx, address) {
        ctx.session.selectedAddress = address;
        await ctx.conversation.enter('send');
      },
    })
  )
  .back('Back to main menu', MENU_HEADER.main);

export default sendSui;
