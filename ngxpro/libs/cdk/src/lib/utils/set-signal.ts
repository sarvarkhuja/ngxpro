import { type InputSignal, type WritableSignal } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

/**
 * Sets the value of either a WritableSignal or an InputSignal.
 * For InputSignal, uses the internal applyValueToInputSignal mechanism.
 */
export function nxpSetSignal<T>(signal: InputSignal<T> | WritableSignal<T>, value: T): void {
  if ('set' in signal) {
    (signal as WritableSignal<T>).set(value);
  } else {
    const s = (signal as any)[SIGNAL];
    if ('applyValueToInputSignal' in s) {
      s.applyValueToInputSignal(s, value);
    }
  }
}
