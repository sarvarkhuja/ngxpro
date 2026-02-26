import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { cx } from '@nxp/cdk';
import { NXP_RADIO_OPTIONS } from './radio.options';

export type NxpRadioSize = 's' | 'm' | 'l';
export type NxpRadioColor = 'primary' | 'secondary' | 'danger';

/**
 * Radio input directive — applies to native `<input type="radio">` elements.
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
 *
 * @example
 * <!-- Disabled state (automatically reflected from NgControl) -->
 * <input type="radio" nxpRadio [formControl]="disabledCtrl" value="x" />
 */
@Component({
  selector: 'input[type="radio"][nxpRadio]',
  standalone: true,
  template: '',
  host: {
    '[class]': 'hostClasses()',
    '[style.background-image]': 'backgroundImage()',
    '[style.background-size]': 'isChecked() ? "75% 75%" : null',
    '[style.background-position]': 'isChecked() ? "center" : null',
    '[style.background-repeat]': 'isChecked() ? "no-repeat" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class.nxp-radio]': 'true',
    '[disabled]': 'isDisabled()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpRadioComponent implements OnInit, DoCheck {
  private readonly options = inject(NXP_RADIO_OPTIONS);
  private readonly control = inject(NgControl, {
    self: true,
    optional: true,
  });
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Size of the radio input. Defaults to option value ('m'). */
  readonly size = input<NxpRadioSize>(this.options.size);

  /** Color variant. Controls border and checked fill color. */
  readonly color = input<NxpRadioColor>('primary');

  /** Additional CSS classes. */
  readonly class = input<string>('');

  /** Tracks disabled state derived from NgControl or the native disabled attribute. */
  readonly isDisabled = signal(false);

  /** Tracks checked state from the native element — drives fill color and dot. */
  readonly isChecked = signal(false);

  ngOnInit(): void {
    this.isDisabled.set(this.control?.disabled ?? false);
    this.isChecked.set(this.el.nativeElement.checked);
  }

  ngDoCheck(): void {
    this.isDisabled.set(this.control?.disabled ?? false);
    this.isChecked.set(this.el.nativeElement.checked);
  }

  /**
   * White dot via SVG data URI — shown only when checked.
   * Follows Taiga's pattern of computing appearance from element state in ngDoCheck.
   */
  readonly backgroundImage = computed(() => {
    if (!this.isChecked()) return null;
    return `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='3.5' fill='white'/%3E%3C/svg%3E")`;
  });

  readonly hostClasses = computed(() => {
    const size = this.size();
    const color = this.color();
    const checked = this.isChecked();

    return cx(
      // Reset browser appearance
      'appearance-none cursor-pointer shrink-0',
      // Shape
      'rounded-full border-2',
      // Transition
      'transition-all duration-150',
      // Focus
      'outline-none',
      'focus-visible:ring-2 focus-visible:ring-offset-2',
      // Disabled
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'dark:disabled:opacity-40',

      // Size variants
      size === 's' && 'size-4',
      size === 'm' && 'size-5',
      size === 'l' && 'size-6',

      // Color variants — state driven by isChecked() signal (Taiga ngDoCheck pattern)
      color === 'primary' && [
        checked
          ? ['border-blue-600 dark:border-blue-400', 'bg-blue-600 dark:bg-blue-400']
          : ['border-gray-300 dark:border-gray-600', 'bg-white dark:bg-gray-800'],
        'focus-visible:ring-blue-500',
      ],
      color === 'secondary' && [
        checked
          ? ['border-gray-600 dark:border-gray-400', 'bg-gray-600 dark:bg-gray-400']
          : ['border-gray-300 dark:border-gray-600', 'bg-white dark:bg-gray-800'],
        'focus-visible:ring-gray-500',
      ],
      color === 'danger' && [
        checked
          ? ['border-red-600 dark:border-red-400', 'bg-red-600 dark:bg-red-400']
          : ['border-red-300 dark:border-red-600', 'bg-white dark:bg-gray-800'],
        'focus-visible:ring-red-500',
      ],

      this.class(),
    );
  });
}
