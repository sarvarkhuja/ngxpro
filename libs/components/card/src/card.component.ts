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
      // Design-system spacing skips 20/24px; cards use the next in-scale value (16px).
      'relative block rounded-lg p-4',
      'bg-bg-base',
      'shadow-card',
      this.class(),
    );
}
