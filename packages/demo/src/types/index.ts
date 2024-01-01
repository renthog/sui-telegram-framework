import { Conversation, ConversationFlavor } from '@grammyjs/conversations';
import { Api, SessionFlavor } from 'grammy';

import {
  KeyStorageFlavor,
  SuiFlavor,
} from '@sui-telegram-framework/flows-grammy/src/types';

export interface SessionData {
  selectedAddress?: string;
}

export type MyContext = SessionFlavor<SessionData> &
  ConversationFlavor &
  KeyStorageFlavor &
  SuiFlavor;

export type MyConversation = Conversation<MyContext>;

export type MyApi = Api;
