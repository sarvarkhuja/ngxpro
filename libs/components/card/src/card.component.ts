import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cx } from '@nxp/cdk';

/**
 * Card container component (Tremor-style).
 *
 * @example
 * <nxp-card>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </nxp-card>
 */
@Component({
  selector: 'nxp-card',
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  /** Additional CSS classes. */
  readonly class = input<string>('');

  readonly hostClasses = () =>
    cx(
      // base
      'relative block rounded-lg border p-6',
      // border color
      'border-gray-200 dark:border-gray-800',
      // background
      'bg-white dark:bg-gray-950',
      // shadow
      'shadow-sm',
      this.class(),
    );
}
