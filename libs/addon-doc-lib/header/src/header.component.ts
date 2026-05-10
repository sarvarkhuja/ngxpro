import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { cx } from '@ngxpro/cdk';
import { DrawerComponent } from '@ngxpro/components/drawer';
import {
  NXP_DOC_ICONS,
  NXP_DOC_LOGO,
  NXP_DOC_MENU_TEXT,
} from '@ngxpro/addon-doc-lib/tokens';
import { NxpDocNavigationComponent } from '@ngxpro/addon-doc-lib/navigation';

/**
 * Sticky doc-portal header — logo on the left, projected actions on the
 * right (theme switcher, source-code link, etc.), with a mobile-only
 * hamburger menu that opens an `NxpDrawer` containing a clone of the
 * sidebar `NxpDocNavigation`.
 *
 * @example
 * <header nxpDocHeader>
 *   <ng-container nxpDocMobileNavigation>
 *     <my-mobile-side-content />
 *   </ng-container>
 *   <nxp-doc-theme-switcher />
 * </header>
 */
@Component({
  selector: 'header[nxpDocHeader]',
  imports: [DrawerComponent, NxpDocNavigationComponent, NgTemplateOutlet],
  template: `
    <button
      type="button"
      [class]="menuButtonClass"
      [attr.aria-label]="menu()"
      (click)="open.set(true)"
    >
      <i [class]="menuIconClass" aria-hidden="true"></i>
    </button>

    @if (open()) {
      <nxp-drawer
        direction="start"
        [overlay]="true"
        class="w-72"
        (closed)="open.set(false)"
      >
        <nxp-doc-navigation>
          <ng-content select="[nxpDocMobileNavigation]" />
        </nxp-doc-navigation>
      </nxp-drawer>
    }

    <div class="mr-auto text-base font-bold">
      @if (logoTemplate(); as tpl) {
        <ng-container [ngTemplateOutlet]="tpl" />
      } @else if (logoString()) {
        <img alt="Logo" class="block" [src]="logoString()" />
      }
    </div>
    <ng-content />
  `,
  host: {
    class:
      'fixed inset-x-0 top-0 z-10 flex h-[4.125rem] items-center px-6 ' +
      'bg-bg-base dark:bg-bg-neutral-2 border-b border-border-normal',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocHeaderComponent {
  private readonly router = inject(Router);
  private readonly routeEvents = toSignal(this.router.events, {
    initialValue: null,
  });
  protected readonly icons = inject(NXP_DOC_ICONS);
  protected readonly logo = inject(NXP_DOC_LOGO);
  protected readonly menu = inject(NXP_DOC_MENU_TEXT);
  protected readonly open = signal(false);

  protected readonly logoTemplate = computed(() =>
    this.logo instanceof TemplateRef ? this.logo : null,
  );

  protected readonly logoString = computed(() =>
    typeof this.logo === 'string' ? this.logo : '',
  );

  protected readonly menuButtonClass = cx(
    'inline-flex items-center justify-center size-10 rounded-s -ml-5',
    'hover:bg-bg-neutral-1 transition-colors duration-normal',
    'md:hidden',
  );

  protected readonly menuIconClass = cx(
    'text-xl leading-none',
    this.icons.menu,
  );

  constructor() {
    effect(() => {
      // Close drawer on every navigation event.
      this.routeEvents();
      this.open.set(false);
    });
  }
}
