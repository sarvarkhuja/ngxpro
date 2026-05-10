import { InjectionToken } from '@angular/core';
import type { UrlTree } from '@angular/router';

/**
 * Hook that serializes a `UrlTree` to the path string written back to
 * `Location.go(...)` when API/Demo controls update query params. Default is
 * `String(tree)` — sufficient for apps without a base href; consumers with
 * special routing conventions can override.
 */
export const NXP_DOC_URL_STATE_HANDLER = new InjectionToken<
  (tree: UrlTree) => string
>('NXP_DOC_URL_STATE_HANDLER', { factory: () => String });
