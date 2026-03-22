import { Directive, computed, input } from '@angular/core';
import { cx } from '@nxp/cdk';

/**
 * Label directive (Tremor styling).
 *
 * @example
 * <label nxpLabel for="email">Email</label>
 * <label nxpLabel [disabled]="true">Disabled</label>
 */
@Directive({
  selector: 'label[nxpLabel]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class NxpLabelDirective {
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly classes = computed(() =>
    cx(
      'text-sm leading-none',
      'text-gray-900 dark:text-gray-50',
      this.disabled() && 'text-gray-400 dark:text-gray-600',
      this.class(),
    ),
  );
}
