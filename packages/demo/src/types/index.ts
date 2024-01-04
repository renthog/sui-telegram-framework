import { Conversation, ConversationFlavor } from '@grammyjs/conversations';
import { Api } from 'grammy';

import { SuiTelegramAppFlavor } from '@sui-telegram-framework/flows-grammy/src/types';

export type MyContext = ConversationFlavor & SuiTelegramAppFlavor;

export type MyConversation = Conversation<MyContext>;

export type MyApi = Api;
