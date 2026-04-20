import { DOCUMENT } from '@angular/common';
import { Directive, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NXP_FALSE_HANDLER, NXP_TRUE_HANDLER } from '../../../constants';
import { nxpTypedFromEvent } from '../../../observables/typed-from-event';
import { nxpInjectElement } from '../../../utils/inject-element';
import { combineLatest, filter, map, merge, tap } from 'rxjs';

const SLIDER_INTERACTION_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
]);

/**
 * Native `<input type="range" readonly>` does not actually prevent interaction.
 * This directive imitates the expected readonly behaviour for range inputs.
 *
 * Apply alongside `nxpSlider`:
 * @example
 * ```html
 * <input type="range" nxpSlider readonly />
 * ```
 */
@Directive({
  selector: 'input[nxpSlider][readonly]',
  host: {
    '(keydown)': 'preventKeyboardInteraction($any($event))',
    '(mousedown)': 'preventEvent($any($event))',
  },
})
export class NxpSliderReadonly {
  private readonly el = nxpInjectElement<HTMLInputElement>();
  private readonly doc = inject(DOCUMENT);

  /** Whether the slider is readonly. Mirrors the host `readonly` attribute. */
  public readonly readonly = input(true);

  constructor() {
    const touchStart$ = nxpTypedFromEvent(this.el, 'touchstart', { passive: false });
    const touchMove$ = nxpTypedFromEvent(this.doc, 'touchmove', { passive: false });
    const touchEnd$ = nxpTypedFromEvent(this.doc, 'touchend', { passive: true });

    const shouldPreventMove$ = merge(
      touchStart$.pipe(
        tap((e) => this.preventEvent(e)),
        map(NXP_TRUE_HANDLER),
      ),
      touchEnd$.pipe(map(NXP_FALSE_HANDLER)),
    );

    /**
     * We cannot call preventDefault inside a @HostListener('touchstart') on mobile Chrome —
     * so we use a combineLatest pattern to track whether a touch move should be blocked.
     */
    combineLatest([touchMove$, shouldPreventMove$])
      .pipe(
        filter(([, shouldPrevent]) => shouldPrevent),
        takeUntilDestroyed(),
      )
      .subscribe(([moveEvent]) => this.preventEvent(moveEvent));
  }

  protected preventEvent(event: Event): void {
    if (event.cancelable && this.readonly()) {
      event.preventDefault();
    }
  }

  protected preventKeyboardInteraction(event: KeyboardEvent): void {
    if (SLIDER_INTERACTION_KEYS.has(event.key)) {
      this.preventEvent(event);
    }
  }
}
