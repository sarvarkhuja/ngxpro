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
      /* Fixed layout so column widths declared on <th> elements (eg.
         class="w-[25%]") are honored. Set widths per-table at the call site. */
      [nxpDocApi] {
        inline-size: 100%;
        table-layout: fixed;
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
      /* Dark-mode fallback values for when the host hasn't defined
         --nxp-* CSS variables. The vars themselves auto-switch under .dark
         via the consumer's theme config — these :where(.dark) rules just
         keep the *fallback* chain dark-aware. */
      :where(.dark) [nxpDocApi] tbody [data-nxp-title] {
        box-shadow: 0 1px var(--nxp-border-normal, #262626);
        background: var(--nxp-bg-neutral-1, #1a1a1a);
      }
      :where(.dark) [nxpDocApi] th {
        color: var(--nxp-text-secondary, #a3a3a3);
        box-shadow: inset 0 -1px var(--nxp-border-normal, #262626);
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
