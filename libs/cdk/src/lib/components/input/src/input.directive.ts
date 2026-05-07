import {
  AfterViewInit,
  Directive,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { focusInput, hasErrorInput } from '../../../utils';
import { cx } from '../../../utils';
import {
  NXP_TEXTFIELD,
  NxpTextfieldAccessor,
  nxpAsTextfieldAccessor,
} from '../../textfield/src/textfield-accessor';

/**
 * Input directive — applies Tremor-style classes to native `<input>` and `<textarea>` elements,
 * and exposes the host's value via `NXP_TEXTFIELD_ACCESSOR` so `<nxp-textfield>` and its
 * trailing helpers (cleaner, `nxpCopy`) can read / clear it.
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
    '(input)': 'syncFromHost()',
    '(change)': 'syncFromHost()',
  },
  providers: [nxpAsTextfieldAccessor(NxpInputDirective)],
})
export class NxpInputDirective
  implements NxpTextfieldAccessor<string>, AfterViewInit
{
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true });
  private readonly el =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);

  readonly hasError = input(false);

  readonly class = input<string>('');

  private readonly valueSig = signal<string>('');

  /** Live string value of the native input/textarea. */
  readonly value = computed(() => this.valueSig());

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
        'text-text-primary sm:text-sm',
        'placeholder:text-text-tertiary',
        'disabled:cursor-not-allowed',
        '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
        this.adornmentPadding(),
        this.class(),
      );
    }

    return cx(
      'relative block w-full appearance-none rounded-m border px-2.5 py-2 shadow-sm outline-hidden transition sm:text-sm',
      'border-border-normal',
      'text-text-primary',
      'placeholder:text-text-tertiary',
      'bg-bg-base',
      'disabled:border-border-normal disabled:bg-bg-neutral-1 disabled:text-text-tertiary',
      '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
      ...focusInput,
      ...(this.hasError() ? hasErrorInput : []),
      this.adornmentPadding(),
      this.class(),
    );
  });

  ngAfterViewInit(): void {
    // Capture any pre-existing DOM value (e.g. `value="…"` static attribute or
    // `[(ngModel)]` binding flushed during the first detection cycle).
    this.syncFromHost();
  }

  /** Programmatic write — used by the cleaner and `nxpCopy` indirectly. */
  setValue(v: string | null): void {
    const target = this.el.nativeElement;
    const next = v ?? '';
    if (target.value !== next) {
      target.value = next;
      // Notify ngModel / formControl listeners.
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
    this.valueSig.set(next);
  }

  protected syncFromHost(): void {
    this.valueSig.set(this.el.nativeElement.value ?? '');
  }
}
