import { Composer } from 'grammy';
import { SuiClient } from '@mysten/sui.js/dist/cjs/client';

import { MyContext } from '../types';

async function hasObjectOfType(
  sui: SuiClient,
  structType: string,
  owner: string
) {
  const query = await sui.getOwnedObjects({
    owner,
    filter: {
      StructType: structType,
    },
    options: {
      showContent: true,
    },
  });

  return !!query.data.length;
}

export default function gatedCommunity(structType: string) {
  const composer = new Composer<MyContext>();

  composer.on('chat_join_request', async (ctx) => {
    const keys = await ctx.keystorage().listKeys(ctx.from.id);

    for (const key of keys) {
      if (await hasObjectOfType(ctx.sui(), structType, key)) {
        await ctx.approveChatJoinRequest(ctx.chatJoinRequest.from.id);
        console.log(
          `Approved join request ${ctx.chatJoinRequest.from.username} (${ctx.chatJoinRequest.from.id})`
        );
        return;
      }
    }

    await ctx.declineChatJoinRequest(ctx.chatJoinRequest.from.id);
    console.log(
      `Denied join request ${ctx.chatJoinRequest.from.username} (${ctx.chatJoinRequest.from.id})`
    );
  });

  return composer;
}
