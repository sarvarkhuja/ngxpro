import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NxpRootComponent } from '@ngxpro/cdk/components/root';
import { NxpDocHeaderComponent } from '@ngxpro/addon-doc-lib/header';
import { NxpDocNavigationComponent } from '@ngxpro/addon-doc-lib/navigation';

/**
 * Doc-portal shell. Wires the fixed header, the sidebar
 * `<nxp-doc-navigation>`, and a `<router-outlet>` content area inside an
 * `<nxp-root>` so dropdown / dialog / popup portals work.
 *
 * Projection slots:
 *  - `[nxpDocNavigation]` — extra content rendered inside the sidebar.
 *  - `[nxpDocMobileNavigation]` — content for the mobile drawer (forwarded
 *    to the header).
 *  - default — header right-side actions (theme switcher, source-code link).
 *  - `[nxpOverContent]` — content forwarded to `<nxp-root>` over-content
 *    layer (above all popups).
 *
 * @example
 * <nxp-doc-main>
 *   <nxp-doc-theme-switcher />
 *   <ng-container nxpDocMobileNavigation>
 *     <my-mobile-extras />
 *   </ng-container>
 * </nxp-doc-main>
 */
@Component({
  selector: 'nxp-doc-main',
  imports: [
    NxpRootComponent,
    NxpDocHeaderComponent,
    NxpDocNavigationComponent,
    RouterOutlet,
  ],
  template: `
    <nxp-root>
      <header nxpDocHeader>
        <ng-content
          ngProjectAs="[nxpDocMobileNavigation]"
          select="[nxpDocMobileNavigation]"
        />
        <ng-content />
      </header>

      <nxp-doc-navigation>
        <ng-content select="[nxpDocNavigation]" />
      </nxp-doc-navigation>

      <main
        class="ml-[16.5rem] pt-[4.125rem] isolate max-md:ml-0 block bg-bg-base text-text-primary"
      >
        <router-outlet />
      </main>

      <ng-container ngProjectAs="[nxpOverContent]">
        <ng-content select="[nxpOverContent]" />
      </ng-container>
    </nxp-root>
  `,
  host: {
    class: 'block',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocMainComponent {}
