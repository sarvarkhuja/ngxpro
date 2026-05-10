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
  host: {
    '[attr.data-size]': 'size()',
    '[attr.role]': '"tablist"',
    '(nxp-tab-activate)': 'onActivate($event)',
    '(keydown.arrowRight)': 'onArrow($event, 1)',
    '(keydown.arrowLeft)': 'onArrow($event, -1)',
    '(keydown.arrowDown)': 'onArrow($event, 1)',
    '(keydown.arrowUp)': 'onArrow($event, -1)',
    '(keydown.home)': 'onHomeEnd($event, 0)',
    '(keydown.end)': 'onHomeEnd($event, -1)',
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
    return Array.from(this.el.querySelectorAll('[nxpTab]')) as HTMLElement[];
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

  protected onArrow(event: Event, step: number): void {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.hasAttribute('nxpTab')) return;
    event.preventDefault();
    this.moveFocus(event.target, step);
  }

  protected onHomeEnd(event: Event, indexFromEnd: 0 | -1): void {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.hasAttribute('nxpTab')) return;
    event.preventDefault();
    const enabled = this.tabs.filter((t) => !t.hasAttribute('disabled'));
    const target =
      indexFromEnd === 0 ? enabled[0] : enabled[enabled.length - 1];
    target?.focus();
  }

  markTabAsActive(): void {
    const { tabs, activeElement } = this;
    tabs.forEach((el) => {
      const active = el === activeElement;
      el.classList.toggle('_active', active);
      el.classList.toggle('text-text-primary', active);
      el.classList.toggle('font-semibold', active);
      el.classList.toggle('text-text-secondary', !active);
      el.setAttribute('tabindex', active ? '0' : '-1');
      el.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }
}
