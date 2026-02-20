import {
  Directive,
  HostBinding,
  input,
} from '@angular/core';
import { cx } from '../utils/cx';

/**
 * Title directive for creating structured title/subtitle layouts.
 *
 * Provides a flexible container for titles with optional size variants.
 * Works in conjunction with ngxproSubtitle for secondary text.
 *
 * @example
 * Basic usage (default size):
 * ```html
 * <div ngxproTitle>
 *   <h2>Main Title</h2>
 *   <p ngxproSubtitle>Supporting description</p>
 * </div>
 * ```
 *
 * @example
 * With size variant:
 * ```html
 * <div ngxproTitle="s">
 *   <span>Small Title</span>
 *   <span ngxproSubtitle>Caption text</span>
 * </div>
 * ```
 *
 * @example
 * Large heading:
 * ```html
 * <div ngxproTitle="l">
 *   <h1>Large Page Title</h1>
 *   <p ngxproSubtitle>Subtitle with more spacing</p>
 * </div>
 * ```
 *
 * @example
 * In a cell:
 * ```html
 * <div ngxproCell="m">
 *   <img src="avatar.png" class="w-10 h-10 rounded-full">
 *   <div ngxproTitle>
 *     <div>Jane Smith</div>
 *     <div ngxproSubtitle>Product Manager</div>
 *   </div>
 * </div>
 * ```
 *
 * Pattern: Taiga UI's TuiTitle directive
 * Styling: Tailwind CSS with responsive text sizes
 */
@Directive({
  selector: '[ngxproTitle]',
  standalone: true,
  host: {
    '[attr.data-size]': 'size() || null',
  },
})
export class TitleDirective {
  /**
   * Size variant for the title container.
   * - 's': Small text (text-sm)
   * - 'm': Medium text (text-lg)
   * - 'l': Large text (text-2xl)
   * - '': Default (no specific size, inherits from parent)
   * @default ''
   */
  readonly size = input<'s' | 'm' | 'l' | ''>('', { alias: 'ngxproTitle' });

  @HostBinding('class')
  protected get hostClasses(): string {
    const size = this.size();

    const baseClasses = 'flex flex-col min-w-0 text-left gap-1';

    // Size-based classes
    const sizeClasses: Record<string, string> = {
      s: 'text-sm gap-0.5',
      m: 'text-lg gap-0.5',
      l: 'text-2xl gap-2',
    };

    return cx(
      baseClasses,
      size ? sizeClasses[size] : ''
    );
  }
}
