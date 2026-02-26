import { inject, Injectable } from '@angular/core';
import { NXP_WINDOW } from '../tokens';
import type { NxpPoint } from '../types';

/**
 * Service that corrects position coordinates for WebKit's visual viewport offset.
 * Required for correct positioning in Safari when the keyboard is visible.
 */
@Injectable({ providedIn: 'root' })
export class NxpVisualViewportService {
  private readonly win = inject(NXP_WINDOW);

  /** Corrects a point for WebKit visual viewport offset (Safari fix). */
  correct(point: NxpPoint): NxpPoint {
    const isWebkit =
      /WebKit/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    return isWebkit
      ? [
          point[0] + ((this.win as any).visualViewport?.offsetLeft ?? 0),
          point[1] + ((this.win as any).visualViewport?.offsetTop ?? 0),
        ]
      : point;
  }
}
