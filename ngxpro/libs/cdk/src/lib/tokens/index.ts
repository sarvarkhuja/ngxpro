import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { merge, share, switchMap, takeUntil, type Observable } from 'rxjs';
import { nxpTypedFromEvent } from '../observables/typed-from-event';

/**
 * Token for the document reference.
 */
export const NXP_DOCUMENT = new InjectionToken<Document>('NXP_DOCUMENT', {
  factory: () => document,
});

/**
 * Token for the window reference.
 */
export const NXP_WINDOW = new InjectionToken<Window>('NXP_WINDOW', {
  factory: () => window,
});

/**
 * Token for checking if code is running in a browser environment.
 */
export const NXP_IS_BROWSER = new InjectionToken<boolean>('NXP_IS_BROWSER', {
  factory: () =>
    typeof window !== 'undefined' && typeof document !== 'undefined',
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
        const vv = (win as any).visualViewport;
        const height = vv?.height ?? 0;
        const offsetTop = vv?.offsetTop ?? 0;
        const rect = {
          top: 0,
          left: 0,
          right: win.innerWidth,
          bottom: win.innerHeight,
          width: win.innerWidth,
          height: height + offsetTop || win.innerHeight,
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
