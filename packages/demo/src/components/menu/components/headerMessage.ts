import { MiddlewareFn } from 'grammy';
import { MyContext } from '../../../types';

export const wallet: MiddlewareFn<MyContext> = async (ctx, next) => {
  await ctx.editMessageText(
    'Your Sui accounts are shown below. Select an account to view details.'
  );
  await next();
};

export const main: MiddlewareFn<MyContext> = async (ctx, next) => {
  await ctx.editMessageText(
    'Your Sui accounts are shown below. Select an account to view it in the Sui explorer.'
  );
  await next();
};

export const send: MiddlewareFn<MyContext> = async (ctx, next) => {
  await ctx.editMessageText('Select an account to send from.');
  await next();
};

export const MENU_HEADER = {
  wallet,
  main,
  send,
};
