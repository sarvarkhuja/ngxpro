import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NxpPortalService, NxpPortals } from '@nxp/cdk';
import { NxpPopupService } from './popup.service';

@Component({
  selector: 'nxp-popups',
  standalone: true,
  template: `<ng-content /><ng-container #vcr />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NxpPortalService, useExisting: NxpPopupService }],
  styles: [`
    nxp-popups {
      position: fixed;
      inset: 0;
      z-index: 9000;
      display: grid;
      grid-template-rows: repeat(9, min-content) 1fr;
      pointer-events: none;
      overflow: hidden;
      overflow-wrap: break-word;
      box-sizing: border-box;
      padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0)
               env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);
    }

    nxp-popups::after {
      content: '';
      grid-row: 10;
    }

    nxp-popups > * {
      pointer-events: auto;
    }

    /* Alert item base positioning — mirrors Taiga alert.style.less */
    nxp-popups > [data-block][data-inline] {
      grid-column: 1;
      place-self: start start;
    }

    nxp-popups > [data-inline='end']    { justify-self: end; }
    nxp-popups > [data-inline='center'] { justify-self: center; }
    nxp-popups > [data-block='end']     { align-self: end; }

    /* Top stacking: rows 5–9 (rows 1–4 reserved for other portal types) */
    nxp-popups > [data-block='start']:nth-of-type(1) { grid-row: 5; }
    nxp-popups > [data-block='start']:nth-of-type(2) { grid-row: 6; }
    nxp-popups > [data-block='start']:nth-of-type(3) { grid-row: 7; }
    nxp-popups > [data-block='start']:nth-of-type(4) { grid-row: 8; }
    nxp-popups > [data-block='start']:nth-of-type(5) { grid-row: 9; }

    /* Bottom stacking: rows 11–15 (overrides the default top rows above) */
    nxp-popups > [data-block='end']:nth-of-type(1) { grid-row: 11; }
    nxp-popups > [data-block='end']:nth-of-type(2) { grid-row: 12; }
    nxp-popups > [data-block='end']:nth-of-type(3) { grid-row: 13; }
    nxp-popups > [data-block='end']:nth-of-type(4) { grid-row: 14; }
    nxp-popups > [data-block='end']:nth-of-type(5) { grid-row: 15; }
  `],
})
export class NxpPopupsComponent extends NxpPortals {}
