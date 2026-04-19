import { Directive } from '@angular/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { NxpAnimated } from '../../directives/animated.directive';
import { NxpSwipeDismiss } from '../../directives/swipe-dismiss.directive';

export interface NxpPositionOptions {
  readonly block: 'end' | 'start';
  readonly inline: 'center' | 'end' | 'start';
}

/**
 * Directive to position and style an alert item inside the alert portal.
 * Add as hostDirective to your alert component. Uses Tailwind for layout.
 * Pattern from Taiga UI TuiAlertDirective.
 *
 * Composes NxpAnimated (CSS enter/leave classes) and NxpSwipeDismiss
 * (touch swipe-to-dismiss gesture) as host directives.
 */
@Directive({
  standalone: true,
  hostDirectives: [
    NxpAnimated,
    {
      directive: NxpSwipeDismiss,
      inputs: ['swipeDirections', 'swipeThreshold'],
      outputs: ['swipeDismissed'],
    },
  ],
  host: {
    role: 'alert',
    '[attr.data-block]': 'context.block',
    '[attr.data-inline]': 'context.inline',
    '[class]': 'hostClasses()',
  },
})
export class NxpAlertDirective {
  protected readonly context = injectContext<NxpPositionOptions>();

  protected hostClasses(): string {
    return 'm-1';
  }
}
