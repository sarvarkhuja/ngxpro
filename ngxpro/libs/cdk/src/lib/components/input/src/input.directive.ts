import { Directive, computed, inject, input } from '@angular/core';
import { cx, focusInput, hasErrorInput, NXP_TEXTFIELD } from '@nxp/cdk';

/**
 * Input directive — applies Tremor-style classes to native `<input>` and `<textarea>` elements.
 *
 * Standalone (most common):
 * ```html
 * <label nxpLabel for="email">Email</label>
 * <input nxpInput id="email" type="email" placeholder="you@example.com" />
 * ```
 *
 * Inside nxp-textfield (border/bg come from the wrapper — input is transparent):
 * ```html
 * <nxp-textfield>
 *   <input nxpInput type="text" placeholder="Search…" />
 * </nxp-textfield>
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
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true });

  /** Whether the input has a validation error (standalone only; textfield manages its own error state). */
  readonly hasError = input(false);

  /** Additional CSS classes to merge in. */
  readonly class = input<string>('');

  readonly classes = computed(() => {
    if (this.textfield && !this.textfield.hasLabel()) {
      // Inside nxp-textfield box mode (select/combo-box/date — no label):
      // wrapper provides the border/bg; input is transparent.
      return cx(
        'block w-full h-full bg-transparent border-0 outline-none ring-0 px-2.5',
        'text-gray-900 dark:text-gray-50 sm:text-sm',
        'placeholder-gray-400 dark:placeholder-gray-500',
        'disabled:cursor-not-allowed',
        '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
        this.class(),
      );
    }

    // Standalone OR inside form-field mode (textfield with label):
    // full Tremor-style border, bg, focus ring.
    return cx(
      'relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-xs outline-hidden transition sm:text-sm',
      'border-gray-300 dark:border-gray-800',
      'text-gray-900 dark:text-gray-50',
      'placeholder-gray-400 dark:placeholder-gray-500',
      'bg-white dark:bg-gray-950',
      'disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
      'dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
      '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
      ...focusInput,
      ...(this.hasError() ? hasErrorInput : []),
      this.class(),
    );
  });
}
