import { DOCUMENT } from '@angular/common';
import { ElementRef, inject, Injectable, InjectionToken } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs';

/** Token for external close triggers (e.g. router navigation). */
export const NXP_DIALOGS_CLOSE = new InjectionToken<Observable<unknown>>(
  'NXP_DIALOGS_CLOSE',
  { factory: () => merge() }
);

/**
 * Observable that emits when the dialog should close: Esc key or click outside.
 * Pattern from Taiga UI TuiDialogCloseService.
 */
@Injectable()
export class NxpDialogCloseService extends Observable<unknown> {
  private readonly doc = inject(DOCUMENT);
  private readonly elRef = inject(ElementRef<HTMLElement>);

  constructor() {
    super((subscriber) =>
      merge(
        fromEvent<KeyboardEvent>(this.doc, 'keydown').pipe(
          filter(
            (e) =>
              e.key?.toLowerCase() === 'escape' &&
              !e.defaultPrevented
          ),
          map(() => ({}))
        ),
        fromEvent<MouseEvent>(this.doc, 'mousedown').pipe(
          filter((e) => {
            const target = e.target as Node;
            return !this.elRef.nativeElement.contains(target);
          }),
          take(1),
          map(() => ({}))
        )
      ).subscribe(subscriber)
    );
  }
}
