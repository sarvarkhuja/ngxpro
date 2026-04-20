import { type OperatorFunction, EMPTY, Observable, pipe, switchMap } from 'rxjs';

/**
 * When value satisfies predicate, projects to an observable; otherwise emits nothing.
 * Pattern from Taiga UI tuiIfMap.
 */
export function nxpIfMap<T, G>(
  project: (value: T) => Observable<G>,
  predicate: (value: T) => boolean = Boolean,
): OperatorFunction<T, G> {
  return pipe(switchMap((value) => (predicate(value) ? project(value) : EMPTY)));
}
