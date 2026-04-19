import { Directive, input } from '@angular/core';
import { cx } from '@nxp/cdk';

/**
 * OptGroup directive — groups related options inside `<nxp-data-list>`.
 *
 * Adds ARIA `role="group"` and renders a labelled section separator.
 *
 * @example
 * <nxp-data-list>
 *   <div nxpOptGroup label="Recent">
 *     <button nxpOption>Today</button>
 *   </div>
 *   <div nxpOptGroup label="Preset ranges">
 *     <button nxpOption>Last week</button>
 *   </div>
 * </nxp-data-list>
 */
@Directive({
  selector: '[nxpOptGroup]',
  standalone: true,
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
    '[class]': 'hostClass',
  },
})
export class OptGroupDirective {
  /** Label displayed above the group (also used as `aria-label`). */
  readonly label = input<string>('');

  protected readonly hostClass = cx(
    'flex flex-col gap-0.5',
    'border-t border-neutral-200 dark:border-neutral-800',
    'pt-1 mt-1 first:border-t-0 first:pt-0 first:mt-0',
  );
}
