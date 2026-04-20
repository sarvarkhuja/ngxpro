import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

/**
 * Directive that automatically focuses the host element after view init.
 *
 * @example
 * <input nxpAutoFocus />
 * <input [nxpAutoFocus]="shouldFocus" />
 */
@Directive({
  selector: '[nxpAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  readonly enabled = input(true, { alias: 'nxpAutoFocus' });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    if (this.enabled()) {
      this.el.nativeElement.focus();
    }
  }
}
