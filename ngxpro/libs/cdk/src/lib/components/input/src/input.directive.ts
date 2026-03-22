import { Directive, computed, input } from '@angular/core';
import { cx, focusInput, hasErrorInput } from '@nxp/cdk';

/**
 * Input directive — applies Tremor-style classes to native `<input>` and `<textarea>` elements.
 *
 * Usage:
 * ```html
 * <label nxpLabel for="email">Email</label>
 * <input nxpInput id="email" type="email" placeholder="you@example.com" />
 *
 * <input nxpInput [hasError]="true" />
 * <input nxpInput [class]="'w-48'" />
 * ```
 */
@Directive({
  selector: 'input[nxpInput], textarea[nxpInput]',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
})
export class NxpInputDirective {
  /** Whether the input has a validation error. */
  readonly hasError = input(false);

  /** Additional CSS classes to merge in. */
  readonly class = input<string>('');

  readonly classes = computed(() =>
    cx(
      // base
      'relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-xs outline-hidden transition sm:text-sm',
      // border
      'border-gray-300 dark:border-gray-800',
      // text
      'text-gray-900 dark:text-gray-50',
      // placeholder
      'placeholder-gray-400 dark:placeholder-gray-500',
      // background
      'bg-white dark:bg-gray-950',
      // disabled
      'disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
      'dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
      // search cancel button
      '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
      // focus
      ...focusInput,
      // error
      ...(this.hasError() ? hasErrorInput : []),
      this.class(),
    ),
  );
}
