import {
  Directive,
  HostBinding,
  computed,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { cx } from '../utils/cx';

/**
 * Cell directive for creating list items with consistent spacing and sizing.
 *
 * Provides three size variants (s, m, l) and three height modes (compact, normal, spacious).
 * Automatically adds hover effects when applied to interactive elements (button, label, a).
 *
 * @example
 * Basic usage:
 * ```html
 * <div ngxproCell="m">
 *   <img src="avatar.png" alt="User" class="w-8 h-8 rounded-full">
 *   <div ngxproTitle>
 *     <div>John Doe</div>
 *     <div ngxproSubtitle>Software Engineer</div>
 *   </div>
 * </div>
 * ```
 *
 * @example
 * With height modifier:
 * ```html
 * <button ngxproCell="l" [height]="'spacious'">
 *   Content with extra padding
 * </button>
 * ```
 *
 * @example
 * Compact height:
 * ```html
 * <div ngxproCell="s" [height]="'compact'">
 *   Minimal padding
 * </div>
 * ```
 *
 * Pattern: Taiga UI's TuiCell directive
 * Styling: Tailwind CSS with dark mode support
 */
@Directive({
  selector: '[ngxproCell]',
  standalone: true,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-height]': 'height()',
  },
})
export class CellDirective {
  /**
   * Size variant for the cell.
   * - 's': Small (40px min height, 8px padding)
   * - 'm': Medium (52px min height, 12px padding)
   * - 'l': Large (72px min height, 16px padding)
   * @default 'l'
   */
  readonly size = input<'s' | 'm' | 'l'>('l', { alias: 'ngxproCell' });

  /**
   * Height mode for vertical spacing.
   * - 'compact': No vertical padding
   * - 'normal': Standard padding based on size
   * - 'spacious': Extra vertical padding
   * @default 'normal'
   */
  readonly height = input<'compact' | 'normal' | 'spacious'>('normal');

  @HostBinding('class')
  protected get hostClasses(): string {
    const size = this.size();
    const heightMode = this.height();

    const baseClasses =
      'group/cell flex items-center relative text-left transition-colors box-content isolate';

    // Size-based classes
    const sizeClasses = {
      s: 'py-2 px-4 gap-2 min-h-[40px]',
      m: 'py-3 px-4 gap-3 min-h-[52px]',
      l: 'py-4 px-4 gap-4 min-h-[72px]',
    };

    // Height modifier classes
    const heightClasses: Record<string, string> = {
      compact: 'py-0',
      spacious: size === 's' ? 'py-[7px]' : size === 'm' ? 'py-4' : 'py-5', // Extra padding for spacious
    };

    // Interactive states (applied via CSS when element is button/label/a)
    const interactiveClasses =
      '[&:is(button,label,a):not(:disabled)]:hover:bg-gray-50 [&:is(button,label,a):not(:disabled)]:dark:hover:bg-gray-900/50 [&:is(button,label,a):not(:disabled)]:cursor-pointer [&:is(button,label,a):not(:disabled):active]:bg-gray-100 [&:is(button,label,a):not(:disabled):active]:dark:bg-gray-900/70';

    // Focus visible state
    const focusClasses =
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:-outline-offset-2';

    return cx(
      baseClasses,
      sizeClasses[size],
      heightMode !== 'normal' ? heightClasses[heightMode] : '',
      interactiveClasses,
      focusClasses,
    );
  }
}
