import { InjectionToken } from '@angular/core';
import { defer, of, switchMap, timer, type Observable } from 'rxjs';

/**
 * Stream that emits `true` once the page is considered loaded — used to
 * trigger scroll-into-view for the active sidebar entry. The default delays
 * by 200 ms to allow lazy components to mount.
 */
export const NXP_DOC_PAGE_LOADED = new InjectionToken<Observable<boolean>>(
  'NXP_DOC_PAGE_LOADED',
  { factory: () => defer(() => timer(200).pipe(switchMap(() => of(true)))) },
);
