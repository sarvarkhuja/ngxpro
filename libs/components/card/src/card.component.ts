import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cx } from '@ngxpro/cdk';

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
      'relative block rounded-m border p-6',
      'border-border-normal',
      'bg-bg-base',
      'shadow-sm',
      this.class(),
    );
}
