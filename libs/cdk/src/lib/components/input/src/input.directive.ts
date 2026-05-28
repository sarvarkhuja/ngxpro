import {
  AfterViewInit,
  Directive,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { cx, hasErrorInput, inputVariants } from '@ngxpro/cdk';
import {
  NXP_TEXTFIELD,
  NxpTextfieldAccessor,
  nxpAsTextfieldAccessor,
} from '@ngxpro/cdk/components/textfield';

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
  host: {
    '[class]': 'classes()',
    '[attr.aria-invalid]': 'hasError() || null',
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
      // Inside a textfield (no floating label): the wrapper owns chrome.
      // The input itself is transparent so background/shadow/focus live
      // on the wrapper — Vercel-style composition.
      return cx(
        'block w-full h-full bg-transparent border-0 outline-none ring-0 px-2.5',
        'text-[14px] leading-[1.43] text-text-primary placeholder:text-text-quaternary',
        'disabled:cursor-not-allowed',
        '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
        this.adornmentPadding(),
        this.class(),
      );
    }

    // Standalone (or textfield-with-label) mode — wear the full input
    // chrome from `inputVariants` so all input-style controls match.
    return cx(
      inputVariants(),
      '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
      this.hasError() && hasErrorInput,
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
