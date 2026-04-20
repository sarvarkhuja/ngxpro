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

/** Token provided by `label[nxpLabel]` so the textfield can detect label presence. */
export const NXP_LABEL = new InjectionToken<unknown>('NXP_LABEL');

/** Token provided by `NxpTextfieldComponent` so descendants can inject the textfield. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NXP_TEXTFIELD = new InjectionToken<any>('NXP_TEXTFIELD');
