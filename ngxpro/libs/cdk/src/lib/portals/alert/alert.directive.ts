import { Directive } from '@angular/core';
import { injectContext } from '@taiga-ui/polymorpheus';

export interface NxpPositionOptions {
  readonly block: 'end' | 'start';
  readonly inline: 'center' | 'end' | 'start';
}

/**
 * Directive to position and style an alert item inside the alert portal.
 * Add as hostDirective to your alert component. Uses Tailwind for layout.
 * Pattern from Taiga UI TuiAlertDirective.
 */
@Directive({
  standalone: true,
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
    return 'm-4';
  }
}
