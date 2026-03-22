import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  cx,
  focusInput,
  hasErrorInput,
  NXP_TEXTFIELD,
  nxpAsTextfieldAccessor,
  type NxpTextfieldAccessor,
} from '@nxp/cdk';
import { NXP_TEXTAREA_OPTIONS } from './textarea.options';

/**
 * Auto-resizing textarea component.
 * Integrates with nxp-textfield (floating label, focus ring, error state).
 *
 * Standalone usage (most common for textarea):
 * ```html
 * <textarea nxpTextarea placeholder="Enter text..."></textarea>
 * <textarea nxpTextarea [min]="3" [max]="8" placeholder="Enter text..."></textarea>
 * ```
 *
 * Inside nxp-textfield (add `class="h-auto"` to textfield for auto-sizing):
 * ```html
 * <nxp-textfield class="h-auto">
 *   <label nxpLabel>Description</label>
 *   <textarea nxpTextarea placeholder=" "></textarea>
 * </nxp-textfield>
 * ```
 *
 * With character limit:
 * ```html
 * <textarea nxpTextarea [limit]="500" placeholder="Max 500 chars"></textarea>
 * ```
 */
@Component({
  selector: 'textarea[nxpTextarea]',
  standalone: true,
  template: '',
  providers: [nxpAsTextfieldAccessor(NxpTextareaComponent)],
  host: {
    '[class]': 'hostClasses()',
    '[id]': 'inputId()',
    '(input)': 'onInput()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTextareaComponent implements NxpTextfieldAccessor, OnInit {
  private readonly el = inject(ElementRef<HTMLTextAreaElement>).nativeElement;
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true });
  private readonly options = inject(NXP_TEXTAREA_OPTIONS);

  /** Minimum number of rows (default: 2). */
  readonly min = input<number | null>(null);
  /** Maximum number of rows (default: 6). */
  readonly max = input<number | null>(null);
  /** Whether the textarea has a validation error (standalone mode only). */
  readonly hasError = input(false);
  /** Additional CSS classes. */
  readonly class = input<string>('');

  /** Current string value — updated on every input event. */
  readonly value = signal(this.el.value);

  private static _idCounter = 0;
  private readonly _autoId = `nxp-textarea-${++NxpTextareaComponent._idCounter}`;

  readonly inputId = computed(
    () => this.el.id || (this.textfield ? this.textfield.id : this._autoId),
  );

  readonly effectiveMin = computed(() => this.min() ?? this.options.min());
  readonly effectiveMax = computed(() => this.max() ?? this.options.max());

  // Line height: Tailwind's `leading-normal` is 1.5 (24px at 16px base)
  // Vertical padding: py-2 = 0.5rem top + 0.5rem bottom
  private readonly LINE_HEIGHT_REM = 1.5;
  private readonly PADDING_V_REM = 1.0; // py-2 top+bottom = 0.5 + 0.5

  setValue(value: unknown | null): void {
    this.el.focus();
    if (value == null) {
      this.el.value = '';
    } else {
      this.el.value = String(value);
    }
    this.value.set(this.el.value);
    this.el.dispatchEvent(new Event('input', { bubbles: true }));
    this.resize();
  }

  readonly hostClasses = computed(() => {
    if (this.textfield) {
      return cx(
        // When inside nxp-textfield, fill width and remove border/bg (textfield provides them)
        'block w-full bg-transparent border-0 outline-none ring-0',
        'text-gray-900 dark:text-gray-50 sm:text-sm',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'disabled:cursor-not-allowed',
        'px-3 py-2',
        'resize-none overflow-auto',
        'whitespace-pre-wrap break-words',
        this.class(),
      );
    }

    // Standalone: full styled
    return cx(
      'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm',
      'border-gray-300 dark:border-gray-800',
      'bg-white dark:bg-gray-950',
      'text-gray-900 dark:text-gray-50',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
      'dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
      'resize-none overflow-auto',
      'whitespace-pre-wrap break-words',
      ...focusInput,
      ...(this.hasError() ? hasErrorInput : []),
      this.class(),
    );
  });

  ngOnInit(): void {
    this.resize();
  }

  onInput(): void {
    this.value.set(this.el.value);
    this.resize();
  }

  private resize(): void {
    const el = this.el;
    // Use the document root font-size as the rem base (typically 16px)
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    const minPx = (this.effectiveMin() * this.LINE_HEIGHT_REM + this.PADDING_V_REM) * rootFontSize;
    const maxPx = (this.effectiveMax() * this.LINE_HEIGHT_REM + this.PADDING_V_REM) * rootFontSize;

    // Temporarily reset height so scrollHeight reflects actual content
    el.style.height = 'auto';
    const scrollH = el.scrollHeight;
    const desired = Math.max(scrollH, minPx);
    el.style.height = `${Math.min(desired, maxPx)}px`;

    // Show scrollbar only when content overflows the max height
    el.style.overflowY = scrollH > maxPx ? 'auto' : 'hidden';
  }
}
