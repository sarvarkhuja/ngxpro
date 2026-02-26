import {
  ChangeDetectionStrategy,
  Directive,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import {
  NXP_LABEL,
  NXP_TEXTFIELD,
} from 'libs/cdk/src/lib/components/textfield/src';

/**
 * Label directive (Taiga architecture + Tremor styling).
 *
 * Standalone — regular label above an input:
 * ```html
 * <label nxpLabel for="email">Email</label>
 * <input id="email" nxpInput ... />
 * ```
 *
 * Inside nxp-textfield — floating label:
 * ```html
 * <nxp-textfield>
 *   <label nxpLabel>Email</label>
 *   <input nxpInput placeholder=" " />
 * </nxp-textfield>
 * ```
 */
@Directive({
  selector: 'label[nxpLabel]',
  standalone: true,
  providers: [
    // Register with parent textfield so it can detect label presence via
    // contentChild(NXP_LABEL).
    { provide: NXP_LABEL, useExisting: NxpLabelDirective },
  ],
  host: {
    '[attr.for]': 'labelFor()',
    '[class]': 'classes()',
  },
})
export class NxpLabelDirective {
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true });

  /** Explicit `for` attribute — falls back to the parent textfield's input id. */
  readonly for = input<string>('');
  /** Additional CSS classes merged via cx(). */
  readonly class = input<string>('');

  readonly labelFor = computed(
    () => this.for() || (this.textfield ? this.textfield.id : null),
  );

  readonly classes = computed(() => {
    if (!this.textfield) {
      // ── Standalone label ────────────────────────────────────────────────
      // Simple label rendered above the input with a bottom margin.
      return cx(
        'block text-sm font-medium text-gray-900 dark:text-gray-50',
        'mb-1.5',
        this.class(),
      );
    }

    // ── Floating label inside nxp-textfield ──────────────────────────────
    // Animates between a resting position (centered in the input) and a
    // floated position (sitting on top of the border edge when focused or
    // when the input has a value).
    const floating = this.textfield.hasValueOrFocused();
    const focused = this.textfield.focused();
    const hasError = this.textfield.hasError();

    return cx(
      // Base — always applied
      'pointer-events-none absolute left-3 z-10',
      'transition-all duration-200 ease-in-out',
      'select-none',

      floating
        ? [
            // Floated state: small text sitting on the border edge
            'top-0 -translate-y-1/2 px-1 text-xs leading-none',
            // Background "punch-through" to mask the border behind the text
            'bg-white dark:bg-gray-950',
            // Color: brand when focused (and no error), red when error,
            // gray otherwise
            hasError
              ? 'text-red-500 dark:text-red-400'
              : focused
                ? 'text-brand-500 dark:text-brand-400'
                : 'text-gray-500 dark:text-gray-400',
          ]
        : [
            // Resting state: centered vertically inside the input
            'top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500',
          ],

      this.class(),
    );
  });
}
