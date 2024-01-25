import { Command } from 'commander';

import { BotOptions } from './types/options';
import { createBot } from './bot';

const program = new Command('sui-telegram-bot-demo');

declare module 'commander' {
  export interface Command {
    opts<T>(): BotOptions & T;
  }
}

program
  .version('1.0.0')
  .description('Sui Telegram Bot Demo')
  .requiredOption(
    '-s, --sui-network <value>',
    'SUI network to use',
    process.env.SUI_NETWORK
  )
  .requiredOption('--bot-token <value>', 'Bot token', process.env.BOT_TOKEN)
  .option(
    '--gate-on-struct-type <value>',
    'Optionally gate community access',
    process.env.GATE_ON_STRUCT_TYPE
  );

program
  .command('run-bot')
  .description('Run bot')
  .action(async () => {
    const opts = program.opts();
    const bot = await createBot(opts);

    console.log('Starting bot...');
    bot.start();
  });

program.parse(process.argv);
