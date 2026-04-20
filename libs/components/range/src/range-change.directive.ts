import { DOCUMENT } from '@angular/common';
import {
  Directive,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { nxpTypedFromEvent } from '@nxp/cdk';
import { nxpInjectElement } from '@nxp/cdk';
import { filter, repeat, switchMap, takeUntil, tap } from 'rxjs';
import { NxpRangeComponent } from './range.component';

/**
 * Host directive that handles pointer interaction for the range component.
 *
 * Detects which thumb is closest, captures the pointer, and drives
 * `range.processValue()` on every `pointermove` until `pointerup`.
 */
@Directive({
  selector: '[nxpRangeChange]',
  standalone: true,
})
export class NxpRangeChange {
  private readonly el = nxpInjectElement<HTMLElement>();
  private readonly doc = inject(DOCUMENT);
  private readonly range = inject(NxpRangeComponent);

  /** Emits 0 (left thumb) or 1 (right thumb) when the active thumb changes. */
  readonly activeThumbChange = output<0 | 1>();

  constructor() {
    nxpTypedFromEvent(this.el, 'pointerdown')
      .pipe(
        filter(() => !this.range.disabled()),
        tap((event) => {
          event.preventDefault();
          this.el.setPointerCapture(event.pointerId);
        }),
        switchMap((downEvent) => {
          const activeThumb = this.detectThumb(downEvent);
          this.activeThumbChange.emit(activeThumb);
          this.updateValue(downEvent, activeThumb);

          return nxpTypedFromEvent(this.doc, 'pointermove').pipe(
            tap((moveEvent) => this.updateValue(moveEvent, activeThumb)),
            takeUntil(nxpTypedFromEvent(this.doc, 'pointerup')),
          );
        }),
        repeat(),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private detectThumb(event: PointerEvent): 0 | 1 {
    const target = event.target as HTMLElement;

    // If the user clicked directly on a thumb input, use that
    if (target instanceof HTMLInputElement) {
      const inputs = this.el.querySelectorAll('input[type="range"]');
      if (target === inputs[0]) return 0;
      if (target === inputs[1]) return 1;
    }

    // Otherwise pick whichever thumb is closest by percentage
    const rect = this.el.getBoundingClientRect();
    const fraction = (event.clientX - rect.left) / rect.width;
    const [startPercent, endPercent] = this.range.thumbPercents();
    const startDist = Math.abs(fraction * 100 - startPercent);
    const endDist = Math.abs(fraction * 100 - endPercent);

    return startDist <= endDist ? 0 : 1;
  }

  private updateValue(event: PointerEvent, activeThumb: 0 | 1): void {
    const rect = this.el.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const value = this.range.toValue(fraction);

    this.range.processValue(value, activeThumb === 1);
  }
}
