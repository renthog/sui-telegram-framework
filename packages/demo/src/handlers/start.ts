import { Composer } from 'grammy';
import menu from '../components/menu';

const startComposer = new Composer();

startComposer.command(['start', 'help', 'menu'], async (ctx) => {
  await ctx.reply(
    '👋 This is a demo of basic functions necessary to build a Telegram-based Sui app. Create a wallet, receive Sui, and sign a Sui transaction, all from within Telegram.',
    {
      reply_markup: menu,
    }
  );
});

export default startComposer;
