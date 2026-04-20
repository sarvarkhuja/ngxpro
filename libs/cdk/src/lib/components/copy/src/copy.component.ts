import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx, nxpWriteToClipboard, NXP_DOCUMENT } from '@nxp/cdk';
import { NXP_COPY_OPTIONS } from './copy.options';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const copyVariants = tv({
  base: [
    'group relative inline-flex items-center gap-2 max-w-full min-w-0',
    'rounded-md border border-gray-200 bg-gray-50 px-3',
    'dark:border-gray-800 dark:bg-gray-900',
    'cursor-pointer',
    // Fade-mask at the right edge so long content visually gives way to the action icon.
    '[mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]',
  ],
  variants: {
    size: {
      sm: 'h-8 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type NxpCopySize = NonNullable<VariantProps<typeof copyVariants>['size']>;

/**
 * Copyable value pill with click-to-copy behavior.
 *
 * Renders projected text content with an inline "copy" action button.
 * Uses `nxpWriteToClipboard` (Clipboard API + execCommand fallback) —
 * no `@angular/cdk` dependency. Shows a transient "Copied" overlay for
 * `NXP_COPY_OPTIONS.successTimeout` ms after a successful copy.
 *
 * TODO: swap the inline feedback overlay for `NxpHintDirective` once a
 * hint primitive lands in `@nxp/cdk`.
 *
 * @example
 * <nxp-copy>api-key-1234</nxp-copy>
 */
@Component({
  selector: 'nxp-copy',
  standalone: true,
  template: `
    <span #content class="min-w-0 truncate"><ng-content /></span>
    <button
      type="button"
      class="nxp-copy__btn absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded p-1 text-gray-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      [attr.aria-label]="copied() ? 'Copied' : 'Copy'"
      (click)="copy($event); $event.stopPropagation()"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
    @if (copied()) {
      <span
        class="nxp-copy__feedback absolute inset-x-0 bottom-full mb-1 text-center text-xs text-emerald-600 dark:text-emerald-400"
        aria-live="polite"
      >
        Copied
      </span>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'copy($event)',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpCopyComponent implements OnDestroy {
  private readonly options = inject(NXP_COPY_OPTIONS);
  private readonly doc = inject(NXP_DOCUMENT);

  /** Normalized size to align with `NxpTextfieldSize` (`sm | md | lg`). */
  readonly size = input<NxpCopySize>('md');

  protected readonly contentRef =
    viewChild<ElementRef<HTMLElement>>('content');
  protected readonly copied = signal(false);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly hostClasses = computed(() =>
    cx(copyVariants({ size: this.size() })),
  );

  protected async copy(event: Event): Promise<void> {
    event.preventDefault();
    const text = this.contentRef()?.nativeElement.textContent?.trim() ?? '';
    if (!text) {
      return;
    }
    const ok = await nxpWriteToClipboard(text, this.doc);
    if (!ok) {
      return;
    }
    this.copied.set(true);
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.copied.set(false);
      this.timeoutId = null;
    }, this.options.successTimeout);
  }

  ngOnDestroy(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
