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

/**
 * Creates a reactive binding between a local signal and a directive's input/output.
 * Syncs value changes via effect, calling ngOnChanges if present.
 */
export function nxpDirectiveBinding<T, G extends keyof T, I extends Signal<any> | any>(
  token: ProviderToken<T>,
  key: G,
  initial: I,
  options: InjectOptions = { self: true },
): I extends Signal<any> ? I : WritableSignal<I> {
  const result: any = isSignal(initial) ? initial : signal(initial);
  const directive: any = inject(token, options);
  const output = directive?.[`${String(key)}Change`];
  if (!directive) return result;
  let previous: any;
  effect(() => {
    const value: any = result();
    if (previous === value) return;
    if (isSignal(directive[key])) {
      nxpSetSignal(directive[key] as any, value);
    } else {
      directive[key] = value;
    }
    directive.ngOnChanges?.({});
    output?.emit?.(value);
    previous = value;
  });
  return result;
}
