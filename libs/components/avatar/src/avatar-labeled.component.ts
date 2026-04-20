import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cx } from '@nxp/cdk';

/**
 * Wraps an avatar with a text label displayed below it.
 *
 * @example
 * <nxp-avatar-labeled label="John Doe">
 *   <nxp-avatar alt="John Doe" />
 * </nxp-avatar-labeled>
 */
@Component({
  selector: 'nxp-avatar-labeled',
  template: `
    <ng-content select="nxp-avatar" />
    @if (label()) {
      <span [class]="labelClasses()">{{ label() }}</span>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarLabeledComponent {
  /** Label text displayed below the avatar. */
  readonly label = input<string>('');

  /** Additional CSS classes for the host element. */
  readonly class = input<string>('');

  readonly hostClasses = computed(() =>
    cx('inline-flex flex-col items-center gap-1.5', this.class()),
  );

  readonly labelClasses = computed(() =>
    cx(
      'max-w-14 truncate text-center text-xs leading-tight',
      'text-gray-700 dark:text-gray-300',
    ),
  );
}
