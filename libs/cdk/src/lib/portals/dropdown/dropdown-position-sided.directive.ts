import { Directive, inject, input } from '@angular/core';
import { nxpAsPositionAccessor, NxpPositionAccessor } from '../../classes/accessors';
import { NXP_VIEWPORT } from '../../tokens';
import { EMPTY_CLIENT_RECT } from '../../constants';
import type { NxpPoint } from '../../types';
import { NXP_DROPDOWN_OPTIONS } from './dropdown-options.directive';
import { NxpDropdownPosition } from './dropdown-position.directive';

/**
 * Directive that positions a dropdown to the side of its host element instead of below/above.
 * Falls back to vertical positioning when nxpDropdownSided is false.
 */
@Directive({
  selector: '[nxpDropdownSided]',
  providers: [NxpDropdownPosition, nxpAsPositionAccessor(NxpDropdownPositionSided)],
})
export class NxpDropdownPositionSided extends NxpPositionAccessor {
  private readonly options = inject(NXP_DROPDOWN_OPTIONS);
  private readonly viewport = inject(NXP_VIEWPORT);
  private readonly vertical = inject(NxpDropdownPosition);
  private previous = this.options.direction || 'bottom';

  public readonly nxpDropdownSided = input<boolean | string>('');
  public readonly nxpDropdownSidedOffset = input(4);
  public readonly type = 'dropdown';

  public getPosition(rect: DOMRect): NxpPoint {
    if (this.nxpDropdownSided() === false) return this.vertical.getPosition(rect);

    const { height, width } = rect;
    const hostRect = this.vertical.accessor?.getClientRect() ?? EMPTY_CLIENT_RECT;
    const viewport = this.viewport.getClientRect();
    const { direction, offset } = this.options;
    const adjusted = this.vertical.getAlign(this.options.align);
    const align = adjusted === 'center' ? 'left' : adjusted;
    const available = {
      top: hostRect.bottom - viewport.top,
      left: hostRect.left - offset - viewport.left,
      right: viewport.right - hostRect.right - offset,
      bottom: viewport.bottom - hostRect.top,
    } as const;
    const position = {
      top: hostRect.bottom - height + this.nxpDropdownSidedOffset() + 1,
      left: hostRect.left - width - offset,
      right: hostRect.right + offset,
      bottom: hostRect.top - this.nxpDropdownSidedOffset() - 1,
    } as const;
    const better = available.top > available.bottom ? 'top' : 'bottom';
    const maxLeft = available.left > available.right ? position.left : position.right;
    const left = available[align] > width ? position[align] : maxLeft;

    if ((available[this.previous] > height && direction) || this.previous === better) {
      this.vertical.direction.next(this.previous);
      return [left, position[this.previous]];
    }
    this.previous = better;
    this.vertical.direction.next(better);
    return [left, position[better]];
  }
}
