import { Directive, HostBinding, input } from '@angular/core';
import { cx } from '../utils/cx';

/**
 * Title directive for creating structured title/subtitle layouts.
 *
 * Provides a flexible container for titles with optional size variants.
 * Works in conjunction with nxpSubtitle for secondary text.
 *
 * @example
 * Basic usage (default size):
 * ```html
 * <div nxpTitle>
 *   <h2>Main Title</h2>
 *   <p nxpSubtitle>Supporting description</p>
 * </div>
 * ```
 *
 * @example
 * With size variant:
 * ```html
 * <div nxpTitle="s">
 *   <span>Small Title</span>
 *   <span nxpSubtitle>Caption text</span>
 * </div>
 * ```
 *
 * @example
 * Large heading:
 * ```html
 * <div nxpTitle="l">
 *   <h1>Large Page Title</h1>
 *   <p nxpSubtitle>Subtitle with more spacing</p>
 * </div>
 * ```
 *
 * @example
 * In a cell:
 * ```html
 * <div nxpCell="m">
 *   <img src="avatar.png" class="w-10 h-10 rounded-full">
 *   <div nxpTitle>
 *     <div>Jane Smith</div>
 *     <div nxpSubtitle>Product Manager</div>
 *   </div>
 * </div>
 * ```
 *
 * Pattern: Taiga UI's TuiTitle directive
 * Styling: Tailwind CSS with responsive text sizes
 */
@Directive({
  selector: '[nxpTitle]',
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
  readonly size = input<'s' | 'm' | 'l' | ''>('', { alias: 'nxpTitle' });

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

    return cx(baseClasses, size ? sizeClasses[size] : '');
  }
}
