import { Pipe, type PipeTransform } from '@angular/core';

/**
 * Generic mapper pipe — runs an arbitrary pure function against the piped
 * value with optional extra arguments. Acts as a template-side `map` that
 * keeps templates declarative without forcing every transform into a
 * dedicated pipe.
 *
 * Pure: re-evaluates only when the value, the mapper function, or any of
 * the extra argument references change. When mutating a long-lived
 * collection (e.g. a `Map`), pass a new reference so the pipe re-runs.
 *
 * @example
 * <!-- isChecked(item, map) called from the template -->
 * <input
 *   type="checkbox"
 *   [checked]="item | nxpMapper: isChecked : map"
 * />
 *
 * @example
 * <!-- Multiple args -->
 * {{ user | nxpMapper: formatName : 'short' : locale }}
 */
@Pipe({
  name: 'nxpMapper',
  pure: true,
})
export class NxpMapperPipe implements PipeTransform {
  transform<T, A extends unknown[], R>(
    value: T,
    mapper: (value: T, ...args: A) => R,
    ...args: A
  ): R {
    return mapper(value, ...args);
  }
}
