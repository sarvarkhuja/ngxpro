import { type InputSignal, type WritableSignal } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

type InputSignalNode<T> = {
  applyValueToInputSignal?: (node: InputSignalNode<T>, value: T) => void;
};

/**
 * Sets the value of either a WritableSignal or an InputSignal.
 * For InputSignal, uses the internal applyValueToInputSignal mechanism.
 */
export function nxpSetSignal<T>(
  signal: InputSignal<T> | WritableSignal<T>,
  value: T,
): void {
  if ('set' in signal) {
    signal.set(value);
    return;
  }
  const node = (signal as unknown as { [SIGNAL]: InputSignalNode<T> })[SIGNAL];
  node.applyValueToInputSignal?.(node, value);
}
