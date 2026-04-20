import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpPortals } from '../portals.directive';
import { NxpPortalService } from '../portal.service';
import { nxpProvide } from '../../utils/provide';
import { NxpPopupService } from './popup.service';

/**
 * Host component for popup portals. Add this to your app shell template
 * to enable dropdowns, tooltips, and other popup overlays.
 *
 * @example
 * <nxp-popups />
 */
@Component({
  selector: 'nxp-popups',
  template: '<ng-content /><ng-container #vcr />',
  styles: [
    `
      :host {
        position: fixed;
        z-index: 1000;
        inset: 0;
        pointer-events: none;
      }
      :host > * {
        pointer-events: all;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [nxpProvide(NxpPortalService, NxpPopupService)],
})
export class NxpPopups extends NxpPortals {}
