import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { merge, share, switchMap, takeUntil, type Observable } from 'rxjs';
import { nxpTypedFromEvent } from '../observables/typed-from-event';

/**
 * Token for the document reference. SSR-safe via Angular's DOCUMENT token.
 */
export const NXP_DOCUMENT = new InjectionToken<Document>('NXP_DOCUMENT', {
  factory: () => inject(DOCUMENT),
});

/**
 * Token for the window reference. Returns `null` on the server.
 */
export const NXP_WINDOW = new InjectionToken<Window | null>('NXP_WINDOW', {
  factory: () => inject(NXP_DOCUMENT).defaultView,
});

/**
 * Token for checking if code is running in a browser environment.
 */
export const NXP_IS_BROWSER = new InjectionToken<boolean>('NXP_IS_BROWSER', {
  factory: () => isPlatformBrowser(inject(PLATFORM_ID)),
});

/**
 * Token providing a viewport rect accessor. Used by dropdown position calculations.
 */
export const NXP_VIEWPORT = new InjectionToken<{
  type: string;
  getClientRect(): DOMRect;
}>(ngDevMode ? 'NXP_VIEWPORT' : '', {
  factory: () => {
    const win = inject(NXP_WINDOW);
    return {
      type: 'viewport',
      getClientRect(): DOMRect {
        const innerWidth = win?.innerWidth ?? 0;
        const innerHeight = win?.innerHeight ?? 0;
        const vv = win?.visualViewport;
        const height = vv?.height ?? 0;
        const offsetTop = vv?.offsetTop ?? 0;
        const rect = {
          top: 0,
          left: 0,
          right: innerWidth,
          bottom: innerHeight,
          width: innerWidth,
          height: height + offsetTop || innerHeight,
          x: 0,
          y: 0,
        };
        return { ...rect, toJSON: () => JSON.stringify(rect) };
      },
    };
  },
});

/**
 * Token providing an observable that emits on text selection-related events.
 * Used by dropdown-selection directive.
 */
export const NXP_SELECTION_STREAM = new InjectionToken<Observable<unknown>>(
  ngDevMode ? 'NXP_SELECTION_STREAM' : '',
  {
    factory: () => {
      const doc = inject(DOCUMENT);
      return merge(
        nxpTypedFromEvent(doc, 'selectionchange'),
        nxpTypedFromEvent(doc, 'mouseup'),
        nxpTypedFromEvent(doc, 'mousedown').pipe(
          switchMap(() =>
            nxpTypedFromEvent(doc, 'mousemove').pipe(
              takeUntil(nxpTypedFromEvent(doc, 'mouseup')),
            ),
          ),
        ),
        nxpTypedFromEvent(doc, 'keydown'),
        nxpTypedFromEvent(doc, 'keyup'),
      ).pipe(share());
    },
  },
);

export { NXP_FALLBACK_VALUE, nxpFallbackValueProvider } from './fallback-value';
export {
  NXP_ITEMS_HANDLERS,
  NXP_DEFAULT_ITEMS_HANDLERS,
  nxpItemsHandlersProvider,
} from './items-handlers';
export type {
  NxpStringHandler,
  NxpIdentityMatcher,
  NxpItemsHandlers,
} from './items-handlers';
export { NXP_AUXILIARY, nxpAsAuxiliary, nxpInjectAuxiliary } from './auxiliary';
export { NXP_OPTION_CONTENT, nxpAsOptionContent } from './option-content';
export { NXP_DATA_LIST_HOST, nxpAsDataListHost } from './data-list';
export type { NxpDataListHost } from './data-list';
export { NXP_MULTI_SELECT_TEXTS } from './multi-select';
export type { NxpMultiSelectTexts } from './multi-select';
export {
  NXP_TEXTFIELD_ACCESSOR,
  nxpAsTextfieldAccessor,
  NXP_LABEL,
  NXP_TEXTFIELD,
} from './textfield';
export type { NxpTextfieldAccessor } from './textfield';
