import { Injectable } from '@angular/core';

/**
 * Tracks whether a tooltip was recently visible so the next tooltip in the
 * same "group" (e.g. a toolbar with several icon triggers) can open instantly
 * without the usual showDelay and without an enter animation.
 *
 * Mirrors the skip-delay behaviour Radix/Ariakit tooltip-providers give you.
 */
@Injectable({ providedIn: 'root' })
export class NxpTooltipGroupService {
  /**
   * Window during which a hover on a different trigger is treated as
   * "continuing" the previous tooltip — enters instantly.
   */
  private readonly skipWindowMs = 300;
  private lastHiddenAt = 0;

  noteHidden(): void {
    this.lastHiddenAt = Date.now();
  }

  shouldSkipDelay(): boolean {
    return Date.now() - this.lastHiddenAt < this.skipWindowMs;
  }
}
