import { Directive, computed, inject, input } from '@angular/core';
import { cx, focusInput, hasErrorInput } from '../../../utils';
import { NXP_TEXTFIELD } from '../../../tokens';

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
 * <nxp-textfield iconStart="ri-search-line">
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

  readonly hasError = input(false);

  readonly class = input<string>('');

  /** Reads textfield's iconStart/iconEnd/cleaner state to add the right horizontal padding. */
  private readonly adornmentPadding = computed(() => {
    const tf = this.textfield;
    if (!tf) return '';
    const start = tf.hasStartAdornment?.() ? 'pl-9' : '';
    const end = tf.hasEndAdornment?.() ? 'pr-9' : '';
    return `${start} ${end}`.trim();
  });

  readonly classes = computed(() => {
    if (this.textfield && !this.textfield.hasLabel()) {
      return cx(
        'block w-full h-full bg-transparent border-0 outline-none ring-0 px-2.5',
        'text-gray-900 dark:text-gray-50 sm:text-sm',
        'placeholder-gray-400 dark:placeholder-gray-500',
        'disabled:cursor-not-allowed',
        '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
        this.adornmentPadding(),
        this.class(),
      );
    }

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
      this.adornmentPadding(),
      this.class(),
    );
  });
}
