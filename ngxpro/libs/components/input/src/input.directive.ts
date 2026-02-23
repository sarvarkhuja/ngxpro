import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { cx, focusInput, hasErrorInput } from '@nxp/cdk';
import {
  NXP_TEXTFIELD,
  NXP_TEXTFIELD_ACCESSOR,
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@nxp/components/textfield';

/**
 * Input directive — applies to native `<input>` and `<textarea>` elements.
 * Inspired by Taiga UI's TuiInputDirective.
 *
 * Standalone mode (without nxp-textfield):
 * ```html
 * <input nxpInput placeholder="Enter text..." />
 * <input nxpInput [hasError]="true" />
 * ```
 *
 * Textfield mode (inside nxp-textfield):
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Name</label>
 *   <input nxpInput placeholder=" " />
 * </nxp-textfield>
 * ```
 */
@Component({
  selector: 'input[nxpInput], textarea[nxpInput]',
  standalone: true,
  template: '',
  providers: [nxpAsTextfieldAccessor(NxpInputDirective)],
  host: {
    '[class]': 'hostClasses()',
    '[id]': 'inputId()',
    '(input)': 'value.set(el.value)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpInputDirective implements NxpTextfieldAccessor {
  protected readonly el = inject(ElementRef<HTMLInputElement>).nativeElement;
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true });

  /** Whether the input has a validation error (standalone mode only). */
  readonly hasError = input(false);
  /** Additional CSS classes. */
  readonly class = input<string>('');

  /** Current string value — updated on every input event. */
  readonly value = signal(this.el.value);

  /** Auto-generated id if none is set (used by textfield to wire label[for]). */
  private static _idCounter = 0;
  private readonly _autoId = `nxp-input-${++NxpInputDirective._idCounter}`;

  readonly inputId = computed(
    () => this.el.id || (this.textfield ? this.textfield.id : this._autoId),
  );

  setValue(value: unknown | null): void {
    this.el.focus();
    if (value == null) {
      this.el.value = '';
    } else {
      this.el.value = String(value);
    }
    this.value.set(this.el.value);
    // Dispatch input event so reactive forms pick up the change
    this.el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  protected readonly hostClasses = computed(() => {
    if (this.textfield) {
      // Inside nxp-textfield: transparent, fills the container
      const hasLabel = this.textfield.hasLabel();

      return cx(
        'absolute inset-0 w-full h-full bg-transparent border-0 outline-none ring-0',
        'text-gray-900 dark:text-gray-50 sm:text-sm',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'disabled:cursor-not-allowed',
        // Horizontal padding
        'px-3',
        // Vertical padding: more top space when floating label present
        hasLabel ? 'pt-5 pb-1' : 'py-2',
        this.class(),
      );
    }

    // Standalone: full styled (same as original InputComponent)
    return cx(
      'relative block w-full appearance-none rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm',
      'border-gray-300 dark:border-gray-800',
      'bg-white dark:bg-gray-950',
      'text-gray-900 dark:text-gray-50',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
      'dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
      ...focusInput,
      ...(this.hasError() ? hasErrorInput : []),
      this.class(),
    );
  });
}
