import {
  InjectionToken,
  signal,
  type Provider,
  type Signal,
  Optional,
  SkipSelf,
} from '@angular/core';
import type { NxpBooleanHandler } from '../types';

export type NxpStringHandler<T> = (item: T) => string;
export type NxpIdentityMatcher<T> = (item1: T, item2: T) => boolean;

export interface NxpItemsHandlers<T> {
  readonly disabledItemHandler: Signal<NxpBooleanHandler<T>>;
  readonly identityMatcher: Signal<NxpIdentityMatcher<T>>;
  readonly stringify: Signal<NxpStringHandler<T>>;
}

const NXP_FALSE_HANDLER = (): false => false;
const NXP_DEFAULT_IDENTITY_MATCHER: NxpIdentityMatcher<unknown> = (a, b) => a === b;

export const NXP_DEFAULT_ITEMS_HANDLERS: NxpItemsHandlers<unknown> = {
  stringify: signal(String),
  identityMatcher: signal(NXP_DEFAULT_IDENTITY_MATCHER),
  disabledItemHandler: signal(NXP_FALSE_HANDLER),
};

export const NXP_ITEMS_HANDLERS = new InjectionToken<NxpItemsHandlers<any>>(
  'NXP_ITEMS_HANDLERS',
  { factory: () => NXP_DEFAULT_ITEMS_HANDLERS },
);

export function nxpItemsHandlersProvider<T>(
  options: Partial<NxpItemsHandlers<T>>,
): Provider {
  return {
    provide: NXP_ITEMS_HANDLERS,
    deps: [[new Optional(), new SkipSelf(), NXP_ITEMS_HANDLERS]],
    useFactory: (parent: NxpItemsHandlers<T> | null): NxpItemsHandlers<T> => ({
      stringify: signal(parent?.stringify() ?? (String as NxpStringHandler<T>)),
      identityMatcher: signal(
        parent?.identityMatcher() ?? (NXP_DEFAULT_IDENTITY_MATCHER as NxpIdentityMatcher<T>),
      ),
      disabledItemHandler: signal(
        parent?.disabledItemHandler() ?? (NXP_FALSE_HANDLER as NxpBooleanHandler<T>),
      ),
      ...options,
    }),
  };
}
