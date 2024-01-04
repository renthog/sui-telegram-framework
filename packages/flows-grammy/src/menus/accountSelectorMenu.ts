import { MenuRange } from '@grammyjs/menu';

import getSuiBalance from '@sui-telegram-framework/sdk/src/sui/getSuiBalance';
import { SUI_DECIMALS } from '@sui-telegram-framework/sdk/src/constants';
import { abbreviate, bnToFixed } from '@sui-telegram-framework/sdk';

import { SuiTelegramAppFlavor } from '../types';

const accountSelectorMenu = <C extends SuiTelegramAppFlavor>(opts: {
  onSelect: (ctx: C, address: string) => Promise<unknown>;
  navTo?: string;
}) => {
  return async (ctx: C, range: MenuRange<C>) => {
    // Unsure how to get the MenuContext type. This .from is *for sure* defined
    // if this function is triggered from a user menu.
    const addresses = await ctx.keystorage().listKeys(ctx.from!.id);

    const balances = await Promise.all(
      addresses.map(
        async (owner) => [owner, await getSuiBalance(ctx.sui(), owner)] as const
      )
    );

    for (const [address, balance] of balances) {
      const selected = ctx.session.selectedAddress === address ? '✅' : '';
      const addr = abbreviate(address, 12, 5);
      const bal = bnToFixed(balance.balanceBn, SUI_DECIMALS, 3);
      const fullText = `${selected} ${addr}: 🔵 ${bal} SUI`;

      range.text(fullText, async (ctx) => {
        await opts.onSelect(ctx, address);
        if (opts.navTo) {
          ctx.menu.nav(opts.navTo);
        } else {
          ctx.menu.update();
        }
      });
      range.row();
    }
  };
};

export default accountSelectorMenu;
