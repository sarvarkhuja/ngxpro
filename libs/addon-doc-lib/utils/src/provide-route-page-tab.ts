import type { Type } from '@angular/core';
import type { DefaultExport, LoadChildren, Route } from '@angular/router';
import type { Observable } from 'rxjs';

interface NxpRoutePageTabOptions {
  path?: string;
  title?: string;
  loadComponent?: () =>
    | Observable<DefaultExport<Type<unknown>> | Type<unknown>>
    | Promise<DefaultExport<Type<unknown>> | Type<unknown>>
    | Type<unknown>;
  loadChildren?: LoadChildren;
}

/**
 * Helper for declaring a documentation route that owns a `:tab` child route.
 * Equivalent to `tuiProvideRoutePageTab`. Does not start with a slash —
 * Angular's `Route.path` rejects `/`-prefixed paths (NG04014).
 */
export function nxpProvideRoutePageTab({
  path,
  title,
  loadComponent,
  loadChildren,
}: NxpRoutePageTabOptions = {}): Route {
  return {
    path: path?.replace(/^\//, ''),
    loadComponent,
    loadChildren,
    data: { title },
    ...(!loadChildren && path !== ''
      ? { children: [{ path: ':tab', loadComponent }] }
      : {}),
  };
}
