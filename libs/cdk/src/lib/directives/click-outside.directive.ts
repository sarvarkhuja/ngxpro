import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  output,
} from '@angular/core';
import { NXP_DOCUMENT, NXP_IS_BROWSER } from '../tokens';

/**
 * Directive that emits when a click occurs outside the host element.
 * SSR-safe.
 *
 * @example
 * <div (nxpClickOutside)="onClose()">...</div>
 */
@Directive({
  selector: '[nxpClickOutside]',
})
export class ClickOutsideDirective {
  readonly nxpClickOutside = output<MouseEvent>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.isBrowser) return;
    const listener = (event: MouseEvent): void => {
      if (!this.el.nativeElement.contains(event.target as Node)) {
        this.nxpClickOutside.emit(event);
      }
    };
    this.doc.addEventListener('click', listener, true);
    this.destroyRef.onDestroy(() =>
      this.doc.removeEventListener('click', listener, true),
    );
  }
}
