import { Directive, HostBinding } from '@angular/core';
import { cx } from '../utils/cx';

/**
 * Subtitle directive for secondary text within cells and titles.
 *
 * Renders text in a lighter color with smaller font size.
 * Typically used for secondary information like descriptions or metadata.
 *
 * @example
 * ```html
 * <div ngxproTitle>
 *   <div>Primary Text</div>
 *   <div ngxproSubtitle>Secondary description text</div>
 * </div>
 * ```
 *
 * @example
 * With icons:
 * ```html
 * <div ngxproSubtitle>
 *   <svg class="w-4 h-4">...</svg>
 *   <span>Status: Active</span>
 * </div>
 * ```
 *
 * Pattern: Taiga UI's tuiSubtitle
 * Styling: Tailwind CSS with dark mode support
 */
@Directive({
  selector: '[ngxproSubtitle]',
  standalone: true,
})
export class SubtitleDirective {
  @HostBinding('class')
  protected get hostClasses(): string {
    return cx(
      'flex items-center gap-1',
      'text-sm text-gray-600 dark:text-gray-400'
    );
  }
}
