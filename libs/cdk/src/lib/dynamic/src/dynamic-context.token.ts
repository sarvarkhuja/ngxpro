import {
  inject,
  InjectionToken,
  type InjectOptions,
  type Provider,
} from '@angular/core';

export const NXP_DYNAMIC_CONTEXT = new InjectionToken<Record<any, any>>(
  'NXP_DYNAMIC_CONTEXT',
);

export function nxpProvideContext<T = Record<any, any>>(useValue: T): Provider {
  return {
    provide: NXP_DYNAMIC_CONTEXT,
    useValue,
  };
}

export function nxpInjectContext<T>(
  options?: InjectOptions & { optional?: false },
): T;
export function nxpInjectContext<T>(
  options?: InjectOptions & { optional: true },
): T | null;
export function nxpInjectContext<T>(options: InjectOptions = {}): T | null {
  return inject(NXP_DYNAMIC_CONTEXT, options);
}
