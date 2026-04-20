import { InjectionToken, type Provider } from '@angular/core';

/**
 * Options for the copy component & directive.
 */
export interface NxpCopyOptions {
  /** Remix icon name used for the copy action button. */
  readonly icon: string;
  /** Duration (ms) the component overlay shows "Copied" feedback. */
  readonly successTimeout: number;
  /** Duration (ms) the directive surfaces the "Copied" hint. */
  readonly hintTimeout: number;
}

export const NXP_DEFAULT_COPY_OPTIONS: NxpCopyOptions = {
  icon: 'ri-file-copy-line',
  successTimeout: 2000,
  hintTimeout: 3000,
};

export const NXP_COPY_OPTIONS = new InjectionToken<NxpCopyOptions>(
  'NXP_COPY_OPTIONS',
  { factory: () => NXP_DEFAULT_COPY_OPTIONS },
);

/**
 * Provides partial overrides for `NXP_COPY_OPTIONS`.
 *
 * @example
 * providers: [nxpCopyOptionsProvider({ icon: 'ri-clipboard-line' })]
 */
export function nxpCopyOptionsProvider(
  options: Partial<NxpCopyOptions>,
): Provider {
  return {
    provide: NXP_COPY_OPTIONS,
    useValue: { ...NXP_DEFAULT_COPY_OPTIONS, ...options },
  };
}
