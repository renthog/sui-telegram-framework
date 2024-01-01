import BN from 'bn.js';
import {
  TransactionBlock,
  TransactionObjectArgument,
} from '@mysten/sui.js/transactions';

import { SUI_COIN_TYPE } from '../constants';

function mergeCoins(
  tx: TransactionBlock,
  coins: (string | TransactionObjectArgument)[]
) {
  if (coins.length > 1) {
    // mergeCoins doesn't return a coin, it just merges them into the first one,
    // so the way to use it is to just call this to add it to the transaction.
    tx.mergeCoins(coins[0], coins.slice(1));
  }
  return coins[0];
}

function splitCoinsOrMax(
  tx: TransactionBlock,
  coin: string | TransactionObjectArgument,
  amount?: string | BN,
  max?: boolean
) {
  if (max) {
    return coin;
  } else {
    if (!amount) {
      throw new Error('Missing amount');
    }
    return tx.splitCoins(coin, [tx.pure(amount, 'u64')]);
  }
}

/**
 * The actual backing of mergeCoinsAndSplit. The full function includes a check
 * for the case where the caller is sending SUI but only has one SUI coin (ie
 * the gas coin)
 */
function internalMergeCoinsAndSplit(
  tx: TransactionBlock,
  coins: (string | TransactionObjectArgument)[],
  /**
   * Optional amount in native format. Either `amount` or `max` must be set.
   */
  amount?: string | BN,
  /**
   * Use the maximum amount of the coin. Either `amount` or `max` must be set.
   * The only value of max, if set, is `true`.
   */
  max?: true
) {
  const merged = mergeCoins(tx, coins);
  return splitCoinsOrMax(tx, merged, amount, max);
}

export type MergeCoinAndSplitParams = {
  // type arg
  coinType: string;

  /**
   * List of coins to send. Coins will be merged before the requested
   * amount is split off.
   */
  coinObjectIds: (string | TransactionObjectArgument)[];

  /**
   * Raw amount of coin to deposit (ie with decimals included)
   */
  amountNative: string | BN;

  /**
   * Whether to send the maximum amount of the coin. If provided, skips
   * splitting the coin.
   */
  sendMax?: true;
};

export function mergeCoinsAndSplit(
  tx: TransactionBlock,
  params: MergeCoinAndSplitParams
) {
  // HACK: if the sender is depositing SUI and only has one SUI coin, the sui
  // sdk will automatically use it as the gas payment. If this happens, then you
  // must split tx.gas to pay for the deposit coin, but there's no way to tell
  // from this function whether they have one sui coin or not. So, we just assume
  // that if they're depositing SUI and only have one deposit object set, that we
  // need to split tx.gas. The way this is actually achieved is to simply replace
  // the first coin ID with tx.gas whenever the input coin is SUI.
  const hackNeedsGasSplit = params.coinType === SUI_COIN_TYPE;

  const depositCoinIds = hackNeedsGasSplit
    ? [tx.gas, ...params.coinObjectIds.slice(1)]
    : params.coinObjectIds;

  return internalMergeCoinsAndSplit(
    tx,
    depositCoinIds,
    params.amountNative.toString(),
    params.sendMax
  );
}

export function makeSendCoinTransaction(
  tx: TransactionBlock,
  params: MergeCoinAndSplitParams & {
    recipient: string;
  }
) {
  const coin = mergeCoinsAndSplit(tx, params);
  tx.transferObjects([coin], params.recipient);
}
