import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { NxpPopupService } from './popup.service';
import { NxpPortalService, NxpPortals } from '../../../portals';

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
      grid-template-rows: repeat(9, min-content) 1fr repeat(5, min-content);
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

    /* ── Alert enter/exit animations (Sonner-style) ─────────────────────── */

    /* Enter: slide in from block edge */
    nxp-popups > .nxp-enter[data-block='start'] {
      animation: nxp-slide-in-top 400ms cubic-bezier(0.21, 1.02, 0.73, 1) both;
    }
    nxp-popups > .nxp-enter[data-block='end'] {
      animation: nxp-slide-in-bottom 400ms cubic-bezier(0.21, 1.02, 0.73, 1) both;
    }

    /* Exit: slide out + fade */
    nxp-popups > .nxp-leave[data-block='start'] {
      animation: nxp-slide-out-top 200ms ease-out both;
    }
    nxp-popups > .nxp-leave[data-block='end'] {
      animation: nxp-slide-out-bottom 200ms ease-out both;
    }

    /* Swipe-out override: follow swipe direction */
    nxp-popups > [data-swipe-out][data-swipe-direction='left'] {
      animation: nxp-swipe-out-left 200ms ease-out both;
    }
    nxp-popups > [data-swipe-out][data-swipe-direction='right'] {
      animation: nxp-swipe-out-right 200ms ease-out both;
    }

    @keyframes nxp-slide-in-top {
      from { opacity: 0; transform: translateY(-100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes nxp-slide-in-bottom {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes nxp-slide-out-top {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(-100%); }
    }
    @keyframes nxp-slide-out-bottom {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(100%); }
    }
    @keyframes nxp-swipe-out-left {
      from { opacity: 1; transform: translateX(var(--swipe-amount-x, 0)); }
      to   { opacity: 0; transform: translateX(calc(var(--swipe-amount-x, 0) - 100%)); }
    }
    @keyframes nxp-swipe-out-right {
      from { opacity: 1; transform: translateX(var(--swipe-amount-x, 0)); }
      to   { opacity: 0; transform: translateX(calc(var(--swipe-amount-x, 0) + 100%)); }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion) {
      nxp-popups > .nxp-enter,
      nxp-popups > .nxp-leave,
      nxp-popups > [data-swipe-out] {
        animation: none !important;
      }
    }
  `],
})
export class NxpPopupsComponent extends NxpPortals {}
