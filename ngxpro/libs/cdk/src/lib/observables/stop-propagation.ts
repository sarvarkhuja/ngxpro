import { type MonoTypeOperatorFunction, tap } from 'rxjs';

/**
 * RxJS operator that calls stopPropagation() on each emitted Event.
 */
export function nxpStopPropagation<T extends Event>(): MonoTypeOperatorFunction<T> {
  return tap((event) => event.stopPropagation());
}

/**
 * RxJS operator that calls preventDefault() on each emitted Event.
 */
export function nxpPreventDefault<T extends Event>(): MonoTypeOperatorFunction<T> {
  return tap((event) => event.preventDefault());
}
