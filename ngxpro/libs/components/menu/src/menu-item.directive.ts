import {
  Directive,
  ElementRef,
  inject,
  output,
  signal,
} from '@angular/core';

/**
 * A selectable item inside `NxpMenuComponent`. Host role is
 * `menuitemradio`; the parent menu tracks its index via `contentChildren`
 * and drives the `aria-checked` state from `[(checkedIndex)]`.
 */
@Directive({
  selector: '[nxpMenuItem]',
  standalone: true,
  host: {
    role: 'menuitemradio',
    tabindex: '0',
    class:
      'relative z-10 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm outline-none cursor-default',
    '[attr.data-proximity-index]': 'index()',
    '[attr.aria-checked]': 'checked() ? "true" : "false"',
    '(click)': 'onClick()',
  },
})
export class NxpMenuItemDirective {
  /** Host element — exposed so `NxpMenuComponent` can measure & focus it. */
  readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  /** Index assigned by the parent menu on enumeration. */
  readonly index = signal(-1);

  /** Whether this item is currently the checked item in its menu. */
  readonly checked = signal(false);

  /** Fires on click — the parent menu listens and updates `checkedIndex`. */
  readonly nxpMenuItemSelect = output<number>();

  protected onClick(): void {
    const i = this.index();
    if (i !== -1) this.nxpMenuItemSelect.emit(i);
  }
}
