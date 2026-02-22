import { Directive, inject, model, HostListener } from '@angular/core';
import { AccordionComponent } from './accordion.component';

/**
 * Accordion trigger directive for custom accordion content (Taiga pattern).
 *
 * Use with button + nxp-expand for flexible accordion items.
 * Pairs with AccordionComponent: each directive matches the expand at the same index.
 * Use nxpCell, nxpTitle, nxpSubtitle for layout (from @nxp/cdk).
 *
 * @example
 * <nxp-accordion>
 *   <button nxpAccordion nxpCell="m">
 *     <span nxpTitle><strong>Group 1</strong></span>
 *     <span nxpSubtitle>3 operations • Total: $1,234</span>
 *   </button>
 *   <nxp-expand>
 *     <div nxpCell *ngFor="let item of items">...</div>
 *   </nxp-expand>
 *
 *   <button nxpAccordion nxpCell="m">
 *     <span nxpTitle><strong>Group 2</strong></span>
 *     <span nxpSubtitle>2 operations</span>
 *   </button>
 *   <nxp-expand>
 *     ...
 *   </nxp-expand>
 * </nxp-accordion>
 */
@Directive({
  selector: 'button[nxpAccordion], nxp-accordion-trigger[nxpAccordion]',
  standalone: true,
  host: {
    type: 'button',
    '[attr.aria-expanded]': 'open()',
    '[class._open]': 'open()',
    '[class.border-b]': 'true',
    '[class.block]': 'true',
    '[class.border-gray-200]': 'true',
    '[class.dark\\:border-gray-800]': 'true',
  },
})
export class AccordionDirective {
  private readonly accordion = inject(AccordionComponent, { optional: true });

  /** Whether this accordion item is open. Supports two-way binding via [nxpAccordion]. */
  readonly open = model<boolean>(false);

  @HostListener('click')
  protected toggle(): void {
    this.open.set(!this.open());
    this.accordion?.toggleDirective(this);
  }
}
