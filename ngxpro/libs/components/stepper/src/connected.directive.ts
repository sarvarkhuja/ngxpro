import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  Directive,
  EnvironmentInjector,
  ViewEncapsulation,
  createComponent,
  inject,
} from '@angular/core';

/**
 * Styles-only component that injects the connector-line CSS into the document
 * once per application (ViewEncapsulation.None means no scope hash is added).
 * This mirrors the `tuiWithStyles` pattern used in Taiga UI.
 */
@Component({
  standalone: true,
  template: '',
  styles: [
    `
      /* Steps that have a following sibling need relative positioning. */
      .nxp-connected button[nxpStep]:not(:last-of-type),
      .nxp-connected a[nxpStep]:not(:last-of-type) {
        position: relative;
      }

      /* ── VERTICAL connector ──────────────────────────────────────────────
         Draws a dashed vertical line from the bottom of the step indicator
         circle down to the top of the next step's circle.
         Circle = size-8 (2rem), step padding = p-2 (0.5rem). */
      .nxp-connected[data-orientation="vertical"] button[nxpStep]:not(:last-of-type)::before,
      .nxp-connected[data-orientation="vertical"] a[nxpStep]:not(:last-of-type)::before {
        content: '';
        position: absolute;
        top: calc(2rem + 0.5rem + 0.125rem);
        left: calc(0.5rem + 1rem - 0.5px);
        display: block;
        height: calc(100% - 2rem - 0.5rem);
        width: 1px;
        background: linear-gradient(to bottom, #d1d5db 75%, transparent 75%)
          top center / 4px 8px repeat-y;
      }

      .dark .nxp-connected[data-orientation="vertical"] button[nxpStep]:not(:last-of-type)::before,
      .dark .nxp-connected[data-orientation="vertical"] a[nxpStep]:not(:last-of-type)::before {
        background: linear-gradient(to bottom, #374151 75%, transparent 75%)
          top center / 4px 8px repeat-y;
      }

      /* ── HORIZONTAL connector ────────────────────────────────────────────
         Add a fixed gap between steps so there is actual space for the line.
         The ::after on each non-last step starts at left:100% (just outside
         the button's right edge) and fills that gap. */
      .nxp-connected[data-orientation="horizontal"] {
        gap: 2rem;
      }

      .nxp-connected[data-orientation="horizontal"] button[nxpStep]:not(:last-of-type),
      .nxp-connected[data-orientation="horizontal"] a[nxpStep]:not(:last-of-type) {
        overflow: visible;
      }

      .nxp-connected[data-orientation="horizontal"] button[nxpStep]:not(:last-of-type)::after,
      .nxp-connected[data-orientation="horizontal"] a[nxpStep]:not(:last-of-type)::after {
        content: '';
        position: absolute;
        /* Vertically centred on the size-8 (2rem) circle with p-2 (0.5rem) top padding */
        top: calc(0.5rem + 1rem - 0.5px);
        /* Start just outside the button's right edge, fill the 2rem gap */
        left: 100%;
        width: 2rem;
        height: 1px;
        background: linear-gradient(to right, #d1d5db 75%, transparent 75%)
          left center / 8px 4px repeat-x;
      }

      .dark .nxp-connected[data-orientation="horizontal"] button[nxpStep]:not(:last-of-type)::after,
      .dark .nxp-connected[data-orientation="horizontal"] a[nxpStep]:not(:last-of-type)::after {
        background: linear-gradient(to right, #374151 75%, transparent 75%)
          left center / 8px 4px repeat-x;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NxpConnectedStyles {}

/**
 * Directive that draws vertical connector lines between stepper steps.
 *
 * Apply to an `nxp-stepper` element to render a dashed line connecting
 * consecutive step indicator circles. Works best with `orientation="vertical"`.
 *
 * @example
 * <nxp-stepper nxpConnected orientation="vertical" [(activeItemIndex)]="step">
 *   <button nxpStep stepState="pass">Account</button>
 *   <button nxpStep>Details</button>
 *   <button nxpStep>Review</button>
 * </nxp-stepper>
 */
@Directive({
  selector: 'nxp-stepper[nxpConnected]',
  standalone: true,
  host: { class: 'nxp-connected' },
})
export class NxpConnectedDirective {
  constructor() {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    // Guard: inject the styles component only once per document.
    if (!document.querySelector('.nxp-connected-style-host')) {
      const ref = createComponent(NxpConnectedStyles, {
        environmentInjector: injector,
      });
      ref.location.nativeElement.className = 'nxp-connected-style-host';
      document.body.appendChild(ref.location.nativeElement);
      appRef.attachView(ref.hostView);
    }
  }
}
