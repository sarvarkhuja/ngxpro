import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
  input,
} from '@angular/core';

export const NXP_TAB_ACTIVATE = 'nxp-tab-activate';

/**
 * Individual tab item directive.
 *
 * Apply to `button` or `a` elements inside an `nxp-tabs` container.
 * Dispatches a custom `nxp-tab-activate` event on click, which the parent
 * `NxpTabsDirective` listens for to update the active index.
 *
 * Size is controlled via the parent's `[data-size]` attribute using CSS.
 * Active/inactive state is toggled by the parent via the `_active` CSS class
 * and the `classList.toggle` calls in `NxpTabsDirective.markTabAsActive()`.
 *
 * @example
 * <nxp-tabs>
 *   <button nxpTab>Overview</button>
 *   <button nxpTab>Analytics</button>
 *   <button nxpTab>Settings</button>
 * </nxp-tabs>
 *
 * @example
 * <!-- Anchor tabs -->
 * <nxp-tabs>
 *   <a nxpTab href="/overview">Overview</a>
 *   <a nxpTab href="/settings">Settings</a>
 * </nxp-tabs>
 *
 * @example
 * <!-- Disabled tab -->
 * <nxp-tabs>
 *   <button nxpTab>Active</button>
 *   <button nxpTab [disabled]="true">Unavailable</button>
 * </nxp-tabs>
 */
@Directive({
  selector: 'button[nxpTab], a[nxpTab]',
  standalone: true,
  host: {
    '[attr.role]': '"tab"',
    '[attr.tabindex]': '"-1"',
    '[attr.disabled]': 'disabled() || null',
    // Base layout classes — active/inactive colors managed by NxpTabsDirective.markTabAsActive()
    class:
      'relative z-10 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ' +
      'transition-colors duration-150 ' +
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1 ' +
      'text-gray-500 hover:text-gray-700 ' +
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  },
})
export class NxpTabDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;

  /** Whether this tab is disabled. */
  readonly disabled = input(false);

  @HostListener('click')
  protected onClick(): void {
    if (this.disabled()) return;
    this.el.dispatchEvent(
      new CustomEvent(NXP_TAB_ACTIVATE, { bubbles: true }),
    );
  }

  ngOnDestroy(): void {
    if (document.activeElement === this.el) {
      this.el.blur();
    }
  }
}
