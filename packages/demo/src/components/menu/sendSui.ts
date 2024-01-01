import { Menu } from '@grammyjs/menu';

import { MyContext } from '../../types';
import { MENU_HEADER } from './components/headerMessage';
import { accountSelector } from './components/accountSelector';

const sendSui = new Menu<MyContext>('send')
  .dynamic(
    accountSelector({
      async onSelect(ctx, address) {
        ctx.session.selectedAddress = address;
        await ctx.conversation.enter('send');
      },
    })
  )
  .back('Back to main menu', MENU_HEADER.main);

export default sendSui;
