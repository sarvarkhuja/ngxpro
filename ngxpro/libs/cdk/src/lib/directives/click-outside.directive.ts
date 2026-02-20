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
 * <div (ngxproClickOutside)="onClose()">...</div>
 */
@Directive({
  selector: '[ngxproClickOutside]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  readonly ngxproClickOutside = output<MouseEvent>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly listener = (event: MouseEvent): void => {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.ngxproClickOutside.emit(event);
    }
  };

  ngOnInit(): void {
    document.addEventListener('click', this.listener, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.listener, true);
  }
}
