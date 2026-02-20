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
 * <input ngxproAutoFocus />
 * <input [ngxproAutoFocus]="shouldFocus" />
 */
@Directive({
  selector: '[ngxproAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  readonly enabled = input(true, { alias: 'ngxproAutoFocus' });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    if (this.enabled()) {
      this.el.nativeElement.focus();
    }
  }
}
