import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * `<table tuiDocAPI>` equivalent — a thin wrapper around a `<table>` that
 * applies a default doc-style layout via `nxpDocApi` directive selector.
 *
 * Encapsulation is `None` so the layout rules cascade onto the (un-styled)
 * `<th>` / `<td>` children projected by consumers.
 */
@Component({
  selector: 'table[nxpDocApi]',
  template: `
    <thead>
      <tr>
        <ng-content select="th" />
      </tr>
    </thead>
    <tbody>
      <ng-content />
    </tbody>
    <ng-content select="tbody" />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      [nxpDocApi] {
        inline-size: 100%;
      }
      [nxpDocApi] tbody [data-nxp-title] {
        align-items: flex-start;
        padding: 1rem;
        box-shadow: 0 1px var(--nxp-border-normal, #e5e7eb);
        background: var(--nxp-bg-neutral-1, #f9fafb);
      }
      [nxpDocApi] th {
        padding: 0.5rem 0;
        color: var(--nxp-text-secondary, #6b7280);
        font-size: 0.875rem;
        text-align: start;
        box-shadow: inset 0 -1px var(--nxp-border-normal, #e5e7eb);
      }
      [nxpDocApi] th:last-child {
        text-align: end;
      }
      @media (max-width: 768px) {
        [nxpDocApi],
        [nxpDocApi] tbody,
        [nxpDocApi] tr {
          display: flex;
          flex-direction: column;
        }
        [nxpDocApi] th {
          display: none;
        }
      }
    `,
  ],
})
export class NxpDocApiComponent {}
