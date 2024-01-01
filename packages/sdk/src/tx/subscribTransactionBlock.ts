import {
  GetTransactionBlockParams,
  SuiClient,
  SuiTransactionBlockResponse,
} from '@mysten/sui.js/dist/cjs/client';

export type SubscribeTransactionStatusParams = GetTransactionBlockParams;

SuiClient.prototype.getTransactionBlock;

/**
 * This is not the same thing as `SuiClient.subscribeTransaction`, which is
 * for streaming events based on a filter. This subscribes to a specific
 * transaction.
 *
 * Polls the transaction status every 5 seconds and calls `onStatus` with
 */
export function subscribeTransactionBlock(
  client: SuiClient,
  params: {
    pollingIntervalMs?: number;
    params: GetTransactionBlockParams;
    onTransactionBlock: (
      block: SuiTransactionBlockResponse,
      cancel: () => void
    ) => void;
    onError?: (error: unknown, cancel: () => void) => void;
  }
) {
  const pollingId = setInterval(async () => {
    const cancel = () => {
      clearInterval(pollingId);
    };

    try {
      const block = await client.getTransactionBlock(params.params);
      params.onTransactionBlock(block, cancel);
    } catch (e) {
      if (params.onError) {
        params.onError(e, cancel);
      } else {
        // TODO: default should check if error came from the sui sdk and
        // determine whether it should retry, back off, etc
        console.error(`Cancelling polling due to error: ${e}`);
        cancel();
      }
    }
  }, params.pollingIntervalMs ?? 5_000);
}
