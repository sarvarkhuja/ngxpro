import { InjectionToken, type Provider, type Signal, type Type } from '@angular/core';

/**
 * Interface that input-like controls inside nxp-textfield must implement.
 * Inspired by Taiga UI's TuiTextfieldAccessor pattern.
 */
export interface NxpTextfieldAccessor<T = unknown> {
  /** Current string representation of the value (for empty detection). */
  readonly value: Signal<string>;
  /** Set the control's value programmatically (used by cleaner). */
  setValue(value: T | null): void;
}

export const NXP_TEXTFIELD_ACCESSOR = new InjectionToken<NxpTextfieldAccessor>(
  'NXP_TEXTFIELD_ACCESSOR',
);

export function nxpAsTextfieldAccessor(accessor: Type<NxpTextfieldAccessor>): Provider {
  return { provide: NXP_TEXTFIELD_ACCESSOR, useExisting: accessor };
}
