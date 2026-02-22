import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cx, focusInput, hasErrorInput } from '@nxp/cdk';

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
      // base
      'relative block w-full appearance-none rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm',
      // border
      'border-gray-300 dark:border-gray-800',
      // background
      'bg-white dark:bg-gray-950',
      // text
      'text-gray-900 dark:text-gray-50',
      // placeholder
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      // disabled
      'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
      'dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
      // focus
      ...focusInput,
      // error
      this.hasError() && hasErrorInput,
      this.class(),
    );
}
