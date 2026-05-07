import {
  effect,
  inject,
  type InjectOptions,
  isSignal,
  type ProviderToken,
  type Signal,
  signal,
  type WritableSignal,
} from '@angular/core';
import { nxpSetSignal } from './set-signal';

type BindingResult<I> = I extends Signal<unknown> ? I : WritableSignal<I>;

/**
 * Creates a reactive binding between a local signal and a directive's input/output.
 * Syncs value changes via effect, calling ngOnChanges if present.
 */
export function nxpDirectiveBinding<T, G extends keyof T, I>(
  token: ProviderToken<T>,
  key: G,
  initial: I,
  options: InjectOptions = { self: true },
): BindingResult<I> {
  const result = (
    isSignal(initial) ? initial : signal(initial)
  ) as BindingResult<I>;
  const directive = inject(token, options) as Record<string, unknown> | null;
  if (!directive) return result;
  const keyStr = String(key);
  const output = directive[`${keyStr}Change`] as
    | { emit?: (value: unknown) => void }
    | undefined;
  let previous: unknown;
  effect(() => {
    const value: unknown = (result as unknown as Signal<unknown>)();
    if (previous === value) return;
    const prop = directive[keyStr];
    if (isSignal(prop)) {
      nxpSetSignal(prop as WritableSignal<unknown>, value);
    } else {
      directive[keyStr] = value;
    }
    (directive['ngOnChanges'] as ((changes: object) => void) | undefined)?.({});
    output?.emit?.(value);
    previous = value;
  });
  return result;
}
