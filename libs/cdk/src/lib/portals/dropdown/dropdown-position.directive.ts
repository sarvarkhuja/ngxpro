import { Directive, inject } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { nxpInjectElement } from '../../utils/inject-element';
import {
  nxpFallbackAccessor,
  NxpPositionAccessor,
  NxpRectAccessor,
} from '../../classes/accessors';
import { NXP_VIEWPORT } from '../../tokens';
import type { NxpPoint, NxpVerticalDirection } from '../../types';
import { distinctUntilChanged, Subject } from 'rxjs';
import { NXP_DROPDOWN_OPTIONS, type NxpDropdownAlign } from './dropdown-options.directive';

/**
 * Directive that calculates the optimal position for a dropdown relative to its host element.
 * Considers viewport bounds, configured direction, alignment, and available space.
 */
@Directive()
export class NxpDropdownPosition extends NxpPositionAccessor {
  private readonly el = nxpInjectElement();
  private readonly options = inject(NXP_DROPDOWN_OPTIONS);
  private readonly viewport = inject(NXP_VIEWPORT);
  private previous?: NxpVerticalDirection;

  public readonly direction = new Subject<NxpVerticalDirection>();
  public readonly type = 'dropdown';
  public readonly accessor = nxpFallbackAccessor<NxpRectAccessor>('dropdown')(
    inject<any>(NxpRectAccessor, { optional: true }),
    { getClientRect: () => this.el.getBoundingClientRect() },
  );

  public readonly nxpDropdownDirectionChange = outputFromObservable(
    this.direction.pipe(distinctUntilChanged()),
  );

  public getPosition({ width, height }: DOMRect): NxpPoint {
    if (!width && !height) this.previous = undefined;

    const hostRect = this.accessor.getClientRect();
    const viewportRect = this.viewport.getClientRect();
    const { minHeight, direction, offset } = this.options;
    const align = this.getAlign(this.options.align);
    const viewport = {
      top: viewportRect.top - offset,
      bottom: viewportRect.bottom + offset,
      right: viewportRect.right - offset,
      left: viewportRect.left + offset,
    } as const;
    const previous = this.previous || direction || 'bottom';
    const available = {
      top: hostRect.top - 2 * offset - viewport.top,
      bottom: viewport.bottom - hostRect.bottom - 2 * offset,
    } as const;
    const rectWidth = this.options.limitWidth === 'fixed' ? hostRect.width : width;
    const right = Math.max(hostRect.right - rectWidth, offset);
    const left = hostRect.left + width < viewport.right ? hostRect.left : right;
    const position = {
      top: hostRect.top - offset - height,
      bottom: hostRect.bottom + offset,
      right: Math.max(viewport.left, right),
      center:
        hostRect.left + hostRect.width / 2 + width / 2 < viewport.right
          ? hostRect.left + hostRect.width / 2 - width / 2
          : right,
      left: Math.max(viewport.left, left),
    } as const;
    const better: NxpVerticalDirection = available.top > available.bottom ? 'top' : 'bottom';

    if ((available[previous] > minHeight && direction) || available[previous] > height) {
      this.direction.next(previous);
      return [position[align], position[previous]];
    }
    this.previous = better;
    this.direction.next(better);
    return [position[align], position[better]];
  }

  public getAlign(align: NxpDropdownAlign): 'center' | 'left' | 'right' {
    const rtl = this.el.matches('[dir="rtl"] :scope');
    if (rtl && align === 'start') return 'right';
    if (rtl && align === 'end') return 'left';
    if (align === 'center') return 'center';
    return align === 'end' ? 'right' : 'left';
  }
}
