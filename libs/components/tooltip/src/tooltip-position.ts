import { Directive, inject, signal } from '@angular/core';
import {
  NxpPositionAccessor,
  NxpRectAccessor,
  nxpInjectElement,
} from '@nxp/cdk';
import { NXP_VIEWPORT } from '@nxp/cdk';
import type { NxpPoint } from '@nxp/cdk';
import { NXP_TOOLTIP_OPTIONS } from './tooltip.options';

export type NxpTooltipDirection = 'top' | 'bottom' | 'left' | 'right';
export type NxpTooltipAlign = 'start' | 'center' | 'end';

/**
 * Computes the [x, y] position for a tooltip panel.
 * Handles all four directions (top, bottom, left, right) plus alignment.
 * Automatically flips to the opposite direction when there is not enough space.
 *
 * Depends on `NxpRectAccessor` (injected optionally) to determine the host
 * element rect — the directive provides itself as `NxpRectAccessor` in the
 * child injector so this returns the trigger's bounding rect.
 */
@Directive()
export class NxpTooltipPosition extends NxpPositionAccessor {
  private readonly el = nxpInjectElement();
  private readonly options = inject(NXP_TOOLTIP_OPTIONS);
  private readonly viewport = inject(NXP_VIEWPORT);

  /** Falls back to the component element rect if no RectAccessor is provided. */
  private readonly rectAccessor = inject(NxpRectAccessor, { optional: true });

  /** The resolved direction after any auto-flip (updated on each getPosition call). */
  public readonly resolvedDirection = signal<NxpTooltipDirection | null>(null);

  public readonly type = 'tooltip';

  private getHostRect(): DOMRect {
    return this.rectAccessor?.getClientRect() ?? this.el.getBoundingClientRect();
  }

  public getPosition({ width, height }: DOMRect): NxpPoint {
    const hostRect = this.getHostRect();
    const viewportRect = this.viewport.getClientRect();
    const { offset } = this.options;
    const preferredDirection =
      (this.options.direction as NxpTooltipDirection) ?? 'top';
    const previous = this.resolvedDirection();

    const available = {
      top: hostRect.top - offset,
      bottom: viewportRect.bottom - hostRect.bottom - offset,
      left: hostRect.left - offset,
      right: viewportRect.right - hostRect.right - offset,
    } as const;

    // On first render (previous is null) always try preferred direction.
    // On subsequent renders keep the current direction if it still fits,
    // otherwise re-evaluate from the preferred direction.
    const candidate = previous ?? preferredDirection;
    const resolved: NxpTooltipDirection = this.hasSpace(candidate, available, width, height)
      ? candidate
      : this.pickDirection(preferredDirection, available, width, height);

    this.resolvedDirection.set(resolved);
    return this.computePoint(resolved, hostRect, width, height, viewportRect, offset);
  }

  private pickDirection(
    preferred: NxpTooltipDirection,
    available: { top: number; bottom: number; left: number; right: number },
    width: number,
    height: number,
  ): NxpTooltipDirection {
    if (this.hasSpace(preferred, available, width, height)) return preferred;
    const opposite = this.oppositeDirection(preferred);
    if (this.hasSpace(opposite, available, width, height)) return opposite;
    return preferred; // fallback: use preferred even if cramped
  }

  private hasSpace(
    direction: NxpTooltipDirection,
    available: { top: number; bottom: number; left: number; right: number },
    width: number,
    height: number,
  ): boolean {
    return direction === 'top'
      ? available.top >= height
      : direction === 'bottom'
        ? available.bottom >= height
        : direction === 'left'
          ? available.left >= width
          : available.right >= width;
  }

  private oppositeDirection(d: NxpTooltipDirection): NxpTooltipDirection {
    return d === 'top'
      ? 'bottom'
      : d === 'bottom'
        ? 'top'
        : d === 'left'
          ? 'right'
          : 'left';
  }

  private computePoint(
    direction: NxpTooltipDirection,
    host: DOMRect,
    panelWidth: number,
    panelHeight: number,
    viewport: DOMRect,
    offset: number,
  ): NxpPoint {
    const align = this.options.align as NxpTooltipAlign;

    if (direction === 'top' || direction === 'bottom') {
      const y =
        direction === 'top'
          ? host.top - panelHeight - offset
          : host.bottom + offset;
      const x = this.crossAxisX(align, host, panelWidth, viewport);
      return [x, y];
    }

    // left | right
    const x =
      direction === 'left'
        ? host.left - panelWidth - offset
        : host.right + offset;
    const y = this.crossAxisY(align, host, panelHeight, viewport);
    return [x, y];
  }

  private crossAxisX(
    align: NxpTooltipAlign,
    host: DOMRect,
    panelWidth: number,
    viewport: DOMRect,
  ): number {
    let x: number;
    if (align === 'start') {
      x = host.left;
    } else if (align === 'end') {
      x = host.right - panelWidth;
    } else {
      x = host.left + host.width / 2 - panelWidth / 2;
    }
    return Math.max(viewport.left + 4, Math.min(x, viewport.right - panelWidth - 4));
  }

  private crossAxisY(
    align: NxpTooltipAlign,
    host: DOMRect,
    panelHeight: number,
    viewport: DOMRect,
  ): number {
    let y: number;
    if (align === 'start') {
      y = host.top;
    } else if (align === 'end') {
      y = host.bottom - panelHeight;
    } else {
      y = host.top + host.height / 2 - panelHeight / 2;
    }
    return Math.max(viewport.top + 4, Math.min(y, viewport.bottom - panelHeight - 4));
  }
}
