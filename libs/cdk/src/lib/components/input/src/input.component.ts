import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { focusInput, hasErrorInput } from '../../../utils';
import { cx } from '../../../utils';

/**
 * Input directive styled with Tremor patterns.
 * Apply to native `<input>` elements.
 *
 * @example
 * <input nxp-input placeholder="Enter text..." />
 * <input nxp-input [hasError]="true" />
 */
@Component({
  selector: '[nxp-input]',
  template: ``,
  host: {
    '[class]': 'hostClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  /** Whether the input has a validation error. */
  readonly hasError = input(false);

  /** Additional CSS classes. */
  readonly class = input<string>('');

  readonly hostClasses = () =>
    cx(
      'relative block w-full appearance-none rounded-m border px-3 py-2 shadow-sm outline-none transition sm:text-sm',
      'border-border-normal',
      'bg-bg-base',
      'text-text-primary',
      'placeholder:text-text-tertiary',
      'disabled:cursor-not-allowed disabled:bg-bg-neutral-1 disabled:text-text-tertiary',
      ...focusInput,
      this.hasError() && hasErrorInput,
      this.class(),
    );
}
