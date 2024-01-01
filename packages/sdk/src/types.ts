import { getFullnodeUrl } from '@mysten/sui.js/dist/cjs/client';

export type ForceProperties<T, U> = { [P in keyof T]: U };

export type EventWithDate<E> = {
  createdAt: Date | undefined;
  event: E;
};

export type SuiNetwork = Parameters<typeof getFullnodeUrl>[0];
