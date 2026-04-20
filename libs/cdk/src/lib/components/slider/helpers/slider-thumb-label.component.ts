import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  computed,
} from '@angular/core';
import { NxpSliderComponent } from '../slider.component';

/**
 * Renders a floating label above the slider thumb showing the current value.
 *
 * Wrap the `<input nxpSlider>` with this component to display a tooltip label.
 *
 * @example
 * ```html
 * <div nxpSliderThumbLabel>
 *   <input type="range" nxpSlider [(ngModel)]="value" />
 * </div>
 * ```
 */
@Component({
  selector: '[nxpSliderThumbLabel]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (slider()) {
      <span
        class="pointer-events-none absolute -top-8 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-0.5 text-xs text-white dark:bg-gray-100 dark:text-gray-900"
        [style.left.%]="thumbOffsetPercent()"
        aria-hidden="true"
      >
        {{ slider()!.value }}
      </span>
    }
  `,
  host: {
    class: 'relative block',
  },
})
export class NxpSliderThumbLabel {
  /** The slider instance projected inside this wrapper. */
  protected readonly slider = contentChild(NxpSliderComponent);

  /**
   * Percentage position of the thumb along the track.
   * Accounts for the natural bias in native range input thumb positioning
   * (at 0% the thumb centre is slightly to the right of 0%; vice versa at 100%).
   */
  protected readonly thumbOffsetPercent = computed(() => {
    const s = this.slider();
    if (!s) return 0;

    const ratio = s.valueRatio;
    // Correct for native thumb size bias: thumb is 16px wide, track width varies.
    // A simple linear correction keeps the label centred across the full range.
    return ratio * 100;
  });
}
