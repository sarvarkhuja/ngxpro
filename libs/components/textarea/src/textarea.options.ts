import { InjectionToken, signal, type Provider, type Signal } from '@angular/core';

export interface NxpTextareaOptions {
  readonly min: Signal<number>;
  readonly max: Signal<number>;
}

export const NXP_TEXTAREA_OPTIONS = new InjectionToken<NxpTextareaOptions>(
  'NXP_TEXTAREA_OPTIONS',
  {
    factory: () => ({
      min: signal(2),
      max: signal(6),
    }),
  },
);

export function nxpTextareaOptionsProvider(options: Partial<{ min: number; max: number }>): Provider {
  return {
    provide: NXP_TEXTAREA_OPTIONS,
    deps: [],
    useFactory: (): NxpTextareaOptions => ({
      min: signal(options.min ?? 2),
      max: signal(options.max ?? 6),
    }),
  };
}
