import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Directive,
  inject,
  PLATFORM_ID,
  type Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { nxpInjectElement } from '../utils/inject-element';

/** CSS class added when an animated element is entering. */
export const NXP_ENTER = 'nxp-enter';

/** CSS class added when an animated element is leaving (before removal from DOM). */
export const NXP_LEAVE = 'nxp-leave';

/**
 * NxpAnimated — coordinates CSS enter/leave animations on host element.
 *
 * - Adds `nxp-enter` class to the host on init; removes it once animations finish.
 * - Wraps Angular's `Renderer2.removeChild` to add `nxp-leave`, wait for
 *   CSS animations to finish, then actually remove the element from the DOM.
 */
@Directive({
  selector: '[nxpAnimated]',
  exportAs: 'nxpAnimated',
  host: {
    class: NXP_ENTER,
    '(animationend.self)': 'remove()',
    '(animationcancel.self)': 'remove()',
  },
})
export class NxpAnimated {
  // @ts-ignore — access internal Angular renderer via ViewContainerRef lView
  private readonly renderer = inject(ViewContainerRef)._hostLView?.[11];
  private readonly el = nxpInjectElement();

  constructor() {
    afterNextRender(() => this.remove());

    if (this.renderer && isPlatformBrowser(inject(PLATFORM_ID))) {
      // `delegate` is used when Angular Animations renderer is active
      wrap(this.renderer.delegate || this.renderer);
    }
  }

  protected remove(): void {
    if (this.el.isConnected && !this.el.getAnimations?.().length) {
      this.el.classList.remove(NXP_ENTER);
    }
  }
}

function wrap(renderer: Renderer2): void {
  if (renderer.data[NXP_LEAVE]) {
    return;
  }

  const { removeChild } = renderer;

  renderer.data[NXP_LEAVE] = true;

  renderer.removeChild = (parent: Node, el: Node, host?: boolean): void => {
    if (!(el instanceof Element)) {
      removeChild.call(renderer, parent, el, host);
      return;
    }

    el.classList.remove(NXP_ENTER);

    const { length } = el.getAnimations?.() || [];

    el.classList.add(NXP_LEAVE);

    const animations = el.getAnimations?.() ?? [];
    const last = animations[animations.length - 1];
    const finish = (): void => {
      if (!parent || parent.contains(el)) {
        removeChild.call(renderer, parent, el, host);
      }
    };

    if (animations.length > length && last) {
      last.onfinish = finish;
      last.oncancel = finish;
    } else {
      finish();
    }
  };
}
