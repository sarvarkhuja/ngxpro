import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { NXP_RADIO_OPTIONS } from './radio.options';
import { cx } from '@ngxpro/cdk';

export type NxpRadioSize = 's' | 'm' | 'l';
export type NxpRadioColor = 'primary' | 'secondary' | 'danger';

/**
 * Radio input directive — applies to native `<input type="radio">` elements.
 *
 * State is read by the browser via `:checked` / `:disabled` pseudo-classes.
 * No signal mirrors `nativeElement.checked` — that was the source of the
 * "fade on route change" bug (CVA writes land one CD tick after first paint,
 * signal flips, `transition-colors` animates the mismatch).
 *
 * Integrates with Angular Reactive Forms via the built-in RadioControlValueAccessor.
 * Use with `formControl`, `formControlName`, or `[(ngModel)]`.
 *
 * @example
 * <!-- Basic radio -->
 * <input type="radio" nxpRadio name="fruit" value="apple" />
 *
 * @example
 * <!-- With reactive forms -->
 * <input type="radio" nxpRadio [formControl]="fruitControl" value="apple" />
 *
 * @example
 * <!-- Size and color variants -->
 * <input type="radio" nxpRadio size="l" color="danger" name="opt" value="no" />
 */
@Component({
  selector: 'input[type="radio"][nxpRadio]',
  template: '',
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class.nxp-radio]': 'true',
  },
  styles: [
    `
      /* Per-variant dot color — flips automatically with theme via the
         existing token system (no .dark override needed). Each variant
         picks the token whose contrast pair matches its checked background:
           primary  bg = --nxp-primary       → dot = --nxp-text-on-accent
           secondary bg = --nxp-bg-neutral-2 → dot = --nxp-text-primary
           danger   bg = --nxp-status-negative (red in both modes) → dot = white */
      :host([data-color='primary']) {
        --nxp-radio-dot: var(--nxp-text-on-accent);
      }
      :host([data-color='secondary']) {
        --nxp-radio-dot: var(--nxp-text-primary);
      }
      :host([data-color='danger']) {
        --nxp-radio-dot: #ffffff;
      }

      /* Dot painted by a radial-gradient so the color is themable via CSS
         variable. Data-URI SVG fill can't read currentColor, hence the gradient.
         Geometry matches the previous SVG: r=3.5 in a 16-viewBox at 75% size
         → dot radius = 16.4% of input ≈ 32.8% of closest-side. 1.5%
         transition zone preserves antialiased edge. */
      :host(:checked) {
        background-image: radial-gradient(
          circle closest-side,
          var(--nxp-radio-dot, #ffffff) 31.5%,
          transparent 33%
        );
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpRadioComponent {
  private readonly options = inject(NXP_RADIO_OPTIONS);

  /** Size of the radio input. Defaults to option value ('m'). */
  readonly size = input<NxpRadioSize>(this.options.size);

  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpRadioColor>('primary');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const size = this.size();
    const color = this.color();

    return cx(
      'appearance-none cursor-pointer shrink-0',
      'rounded-full border-2',
      'transition-[background-color,border-color,box-shadow] duration-normal ease-out',
      'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus',
      'disabled:opacity-50 disabled:cursor-not-allowed',

      size === 's' && 'size-4',
      size === 'm' && 'size-5',
      size === 'l' && 'size-6',

      color === 'primary' && [
        'border-border-normal bg-bg-base',
        'checked:border-primary checked:bg-primary',
      ],
      color === 'secondary' && [
        'border-border-normal bg-bg-base',
        'checked:border-bg-neutral-2 checked:bg-bg-neutral-2',
      ],
      color === 'danger' && [
        'border-status-negative/40 bg-bg-base',
        'checked:border-status-negative checked:bg-status-negative',
      ],

      this.class(),
    );
  });
}
