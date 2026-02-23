import {
  Directive,
  InjectionToken,
  inject,
  input,
  signal,
  type Provider,
  type Signal,
} from '@angular/core';

export type NxpTextfieldSize = 'sm' | 'md' | 'lg';

export interface NxpTextfieldOptions {
  readonly size: Signal<NxpTextfieldSize>;
  readonly cleaner: Signal<boolean>;
}

export const NXP_TEXTFIELD_OPTIONS = new InjectionToken<NxpTextfieldOptions>(
  'NXP_TEXTFIELD_OPTIONS',
  {
    factory: () => ({
      size: signal<NxpTextfieldSize>('md'),
      cleaner: signal(false),
    }),
  },
);

export function nxpTextfieldOptionsProvider(
  options: Partial<{ size: NxpTextfieldSize; cleaner: boolean }>,
): Provider {
  return {
    provide: NXP_TEXTFIELD_OPTIONS,
    deps: [],
    useFactory: () => ({
      size: signal<NxpTextfieldSize>(options.size ?? 'md'),
      cleaner: signal(options.cleaner ?? false),
    }),
  };
}

@Directive({
  selector: '[nxpTextfieldSize],[nxpTextfieldCleaner]',
  providers: [{ provide: NXP_TEXTFIELD_OPTIONS, useExisting: NxpTextfieldOptionsDirective }],
})
export class NxpTextfieldOptionsDirective implements NxpTextfieldOptions {
  private readonly options = inject(NXP_TEXTFIELD_OPTIONS, { skipSelf: true });

  readonly size = input<NxpTextfieldSize>(this.options.size(), {
    alias: 'nxpTextfieldSize',
  });

  readonly cleaner = input<boolean>(this.options.cleaner(), {
    alias: 'nxpTextfieldCleaner',
  });
}
