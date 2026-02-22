import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';

/**
 * Directive that emits when a click occurs outside the host element.
 *
 * @example
 * <div (nxpClickOutside)="onClose()">...</div>
 */
@Directive({
  selector: '[nxpClickOutside]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  readonly nxpClickOutside = output<MouseEvent>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly listener = (event: MouseEvent): void => {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.nxpClickOutside.emit(event);
    }
  };

  ngOnInit(): void {
    document.addEventListener('click', this.listener, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.listener, true);
  }
}
