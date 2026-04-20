import {
  afterNextRender,
  AfterViewChecked,
  Directive,
  ElementRef,
  inject,
  INJECTOR,
  input,
  model,
} from '@angular/core';
import { NXP_TABS_OPTIONS, type NxpTabsSize } from './tabs.options';

/**
 * Core tabs directive — manages active index and tab state.
 *
 * Applied via `hostDirectives` on `NxpTabsHorizontal` and `NxpTabsVertical`.
 * Listens for `nxp-tab-activate` custom events from child `[nxpTab]` elements
 * and updates the `activeItemIndex` model accordingly.
 *
 * Exposes `moveFocus(current, step)` for keyboard navigation.
 */
@Directive({
  standalone: true,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.role]': '"tablist"',
    '(nxp-tab-activate)': 'onActivate($event)',
  },
})
export class NxpTabsDirective implements AfterViewChecked {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly injector = inject(INJECTOR);
  private readonly options = inject(NXP_TABS_OPTIONS);

  /** Size variant. Controls padding/font-size of child tabs via `data-size`. */
  readonly size = input<NxpTabsSize>(this.options.size);

  /** Index of the currently active tab. Supports two-way binding. */
  readonly activeItemIndex = model(0);

  /** All direct `[nxpTab]` elements within this tablist. */
  get tabs(): HTMLElement[] {
    return Array.from(
      this.el.querySelectorAll('[nxpTab]'),
    ) as HTMLElement[];
  }

  /** The currently active tab element, or null if none. */
  get activeElement(): HTMLElement | null {
    return this.tabs[this.activeItemIndex()] ?? null;
  }

  /** Move keyboard focus by `step` positions relative to `current`. */
  moveFocus(current: HTMLElement, step: number): void {
    const tabs = this.tabs.filter(
      (t) => !t.hasAttribute('disabled') && t.getAttribute('tabindex') !== '-2',
    );
    const idx = tabs.indexOf(current);
    const next = tabs[idx + step];
    next?.focus();
  }

  ngAfterViewChecked(): void {
    afterNextRender(
      () => {
        this.markTabAsActive();
      },
      { injector: this.injector },
    );
  }

  protected onActivate(event: Event): void {
    event.stopPropagation();
    const element = event.target;
    if (!(element instanceof HTMLElement)) return;
    const idx = this.tabs.findIndex((t) => t === element);
    if (idx !== -1) {
      this.activeItemIndex.set(idx);
    }
  }

  markTabAsActive(): void {
    const { tabs, activeElement } = this;
    tabs.forEach((el) => {
      const active = el === activeElement;
      el.classList.toggle('_active', active);
      el.classList.toggle('text-gray-900', active);
      el.classList.toggle('dark:text-gray-100', active);
      el.classList.toggle('font-semibold', active);
      el.classList.toggle('text-gray-500', !active);
      el.classList.toggle('dark:text-gray-400', !active);
      el.setAttribute('tabindex', active ? '0' : '-1');
      el.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }
}
