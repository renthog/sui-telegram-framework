import { Composer } from 'grammy';

const loggingMiddleware = new Composer();

loggingMiddleware.use(async (ctx, next) => {
  const start = Date.now();

  await next();

  const elapsed = Date.now() - start;

  const title =
    ctx.chat?.type === 'group' ? ctx.chat.title : ctx.chat?.username;

  console.log(
    `[${ctx.from?.username || '???'}:${
      ctx.chat?.id || '???'
    }:${title}] ${elapsed}ms`
  );
});

export default loggingMiddleware;
