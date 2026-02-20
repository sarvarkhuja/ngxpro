import { Directive, HostBinding } from '@angular/core';
import { cx } from '../utils/cx';

/**
 * Cell actions directive for positioning action buttons within a cell.
 *
 * Actions are positioned absolutely on the right side and revealed on hover.
 * Individual buttons/links fade in smoothly when the cell is hovered.
 *
 * @example
 * ```html
 * <div ngxproCell="l">
 *   <div ngxproTitle>
 *     <div>Item Title</div>
 *     <div ngxproSubtitle>Description</div>
 *   </div>
 *   <div ngxproCellActions>
 *     <button class="p-2 rounded hover:bg-gray-100">Edit</button>
 *     <button class="p-2 rounded hover:bg-gray-100">Delete</button>
 *   </div>
 * </div>
 * ```
 *
 * Pattern: Taiga UI's tuiCellActions
 * Styling: Tailwind CSS with opacity transitions
 */
@Directive({
  selector: '[ngxproCellActions]',
  standalone: true,
})
export class CellActionsDirective {
  @HostBinding('class')
  protected get hostClasses(): string {
    return cx(
      'absolute right-0 z-10 flex items-center gap-2',
      'pr-4', // Match cell padding
      '[&>button]:opacity-0 [&>a]:opacity-0 [&>label]:opacity-0',
      '[&>button]:transition-opacity [&>a]:transition-opacity [&>label]:transition-opacity',
      '[&>button:focus-visible]:opacity-100 [&>a:focus-visible]:opacity-100',
      // Hover state controlled by parent cell
      'group-hover/cell:[&>button]:opacity-100 group-hover/cell:[&>a]:opacity-100 group-hover/cell:[&>label]:opacity-100'
    );
  }
}
