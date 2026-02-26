import {
  Directive,
  type FactoryProvider,
  inject,
  InjectionToken,
  Input,
  Optional,
  Self,
  SkipSelf,
} from '@angular/core';
import { nxpProvide } from '../../utils/provide';
import { nxpOverrideOptions } from '../../utils/override-options';
import type { NxpVerticalDirection } from '../../types';

export type NxpDropdownAlign = 'center' | 'end' | 'start';
export type NxpDropdownWidth = 'auto' | 'fixed' | 'min';

export interface NxpDropdownOptions {
  readonly align: NxpDropdownAlign;
  readonly appearance: string;
  readonly direction: NxpVerticalDirection | null;
  readonly limitWidth: NxpDropdownWidth;
  readonly maxHeight: number;
  readonly minHeight: number;
  readonly offset: number;
}

export const NXP_DROPDOWN_DEFAULT_OPTIONS: NxpDropdownOptions = {
  align: 'start',
  direction: null,
  limitWidth: 'auto',
  maxHeight: 400,
  minHeight: 80,
  offset: 4,
  appearance: '',
};

export const NXP_DROPDOWN_OPTIONS = new InjectionToken<NxpDropdownOptions>(
  ngDevMode ? 'NXP_DROPDOWN_OPTIONS' : '',
  { factory: () => NXP_DROPDOWN_DEFAULT_OPTIONS },
);

/**
 * Creates a provider that overrides specific dropdown options.
 */
export const nxpDropdownOptionsProvider = (
  override: Partial<NxpDropdownOptions>,
): FactoryProvider => ({
  provide: NXP_DROPDOWN_OPTIONS,
  deps: [
    [new Optional(), new Self(), NxpDropdownOptionsDirective],
    [new Optional(), new SkipSelf(), NXP_DROPDOWN_OPTIONS],
  ],
  useFactory: nxpOverrideOptions(override, NXP_DROPDOWN_DEFAULT_OPTIONS),
});

/**
 * Directive that allows customizing dropdown options via attribute inputs.
 */
@Directive({
  selector:
    '[nxpDropdownAlign],[nxpDropdownAppearance],[nxpDropdownDirection],[nxpDropdownLimitWidth],[nxpDropdownMinHeight],[nxpDropdownMaxHeight],[nxpDropdownOffset]',
  providers: [nxpProvide(NXP_DROPDOWN_OPTIONS, NxpDropdownOptionsDirective)],
})
export class NxpDropdownOptionsDirective implements NxpDropdownOptions {
  private readonly options = inject(NXP_DROPDOWN_OPTIONS, { skipSelf: true });

  @Input('nxpDropdownAlign') align = this.options.align;
  @Input('nxpDropdownAppearance') appearance = this.options.appearance;
  @Input('nxpDropdownDirection') direction = this.options.direction;
  @Input('nxpDropdownLimitWidth') limitWidth = this.options.limitWidth;
  @Input('nxpDropdownMinHeight') minHeight = this.options.minHeight;
  @Input('nxpDropdownMaxHeight') maxHeight = this.options.maxHeight;
  @Input('nxpDropdownOffset') offset = this.options.offset;
}
