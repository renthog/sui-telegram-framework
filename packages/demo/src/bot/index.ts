import { Bot, session } from 'grammy';
import { conversations } from '@grammyjs/conversations';

import { SuiNetwork } from '@sui-telegram-framework/sdk';
import { InMemoryKeyStorageBackend } from '@sui-telegram-framework/storage-impl-memory';
import {
  SessionData,
  keyStorageMiddleware,
  suiMiddleware,
} from '@sui-telegram-framework/flows-grammy';

import importSeedPhraseConversation from '../components/conversation/importSeedPhraseConversation';
import loggingMiddleware from '../middlewares/logging';
import menu from '../components/menu';
import sendSuiConversation from '../components/conversation/sendSuiConversation';
import startComposer from '../handlers/start';
import { MyApi, MyContext } from '../types';
import gatedCommunity from '../handlers/object-gated';

export async function createBot(opts: {
  botToken: string;
  suiNetwork: SuiNetwork;
  gateOnStructType?: string;
}) {
  const bot = new Bot<MyContext, MyApi>(opts.botToken);

  bot.use(loggingMiddleware);
  bot.use(suiMiddleware(opts.suiNetwork));
  bot.use(keyStorageMiddleware(new InMemoryKeyStorageBackend()));
  if (opts.gateOnStructType) {
    console.log(
      'Gating community access on struct type',
      opts.gateOnStructType
    );
    bot.use(gatedCommunity(opts.gateOnStructType));
  }

  bot.use(
    session({
      initial(): SessionData {
        return { selectedAddress: undefined };
      },
    })
  );

  bot.use(conversations());
  bot.use(sendSuiConversation);
  bot.use(importSeedPhraseConversation);

  bot.use(menu);
  bot.use(startComposer);

  bot.catch((err) => {
    console.log('An error occurred', err);
  });

  await bot.api.setChatMenuButton({
    menu_button: {
      type: 'commands',
    },
  });

  await bot.api.setMyCommands([
    {
      command: 'start',
      description: 'View the main menu',
    },
    {
      command: 'help',
      description: 'View the main menu',
    },
  ]);

  return bot;
}
