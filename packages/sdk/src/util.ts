import { SharedObjectRef } from '@mysten/sui.js/bcs';
import {
  TransactionArgument,
  TransactionBlock,
} from '@mysten/sui.js/transactions';
import { SuiObjectRef } from '@mysten/sui.js/client';
import { decimalToBn } from './bn';
import { SUI_DECIMALS } from './constants';

export type PlainObject = Record<number | string | symbol, unknown>;

export function objArg(
  txb: TransactionBlock,
  arg: string | SharedObjectRef | SuiObjectRef | TransactionArgument
): TransactionArgument {
  if (typeof arg === 'string') {
    return txb.object(arg);
  }

  if ('digest' in arg && 'version' in arg && 'objectId' in arg) {
    return txb.objectRef(arg);
  }

  if ('objectId' in arg && 'initialSharedVersion' in arg && 'mutable' in arg) {
    return txb.sharedObjectRef(arg);
  }

  if ('kind' in arg) {
    return arg;
  }

  throw new Error('Invalid argument type');
}

export const nonEmpty = <TValue>(v: TValue | null | undefined): v is TValue =>
  v !== null && v !== undefined;

export function getExplorerUrl(
  id: string,
  kind: 'object' | 'address' | 'txblock' = 'object',
  network: 'devnet' | 'mainnet' = 'devnet'
) {
  // https://suiexplorer.com/object/0xeea308a42c6fbcc9bf5d563c5d8e1f774302be712ad1eae0bd8f65639aad2add?network=devnet
  return `https://suiexplorer.com/${kind}/${id}?network=${network}`;
}

export const hasProperty = <
  // eslint-disable-next-line @typescript-eslint/ban-types
  ObjectToCheck extends Object,
  Property extends PropertyKey,
>(
  objectToCheck: ObjectToCheck,
  name: Property
): objectToCheck is ObjectToCheck &
  Record<
    Property,
    Property extends keyof ObjectToCheck ? ObjectToCheck[Property] : unknown
  > => Object.hasOwnProperty.call(objectToCheck, name);

export function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  try {
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(value) === proto;
  } catch (_) {
    return false;
  }
}

export function abbreviate(str: string, n: number, gutter = 3) {
  if (n <= 5 || str.length <= n) {
    return str;
  }

  return str.slice(0, n - gutter) + '...' + str.slice(-gutter);
}

export function toSuiAmountNative(amountDecimal: number) {
  return decimalToBn(amountDecimal, SUI_DECIMALS);
}
