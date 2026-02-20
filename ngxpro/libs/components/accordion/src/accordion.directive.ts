import { Directive, inject, model, HostListener } from '@angular/core';
import { AccordionComponent } from './accordion.component';

/**
 * Accordion trigger directive for custom accordion content (Taiga pattern).
 *
 * Use with button + ngxpro-expand for flexible accordion items.
 * Pairs with AccordionComponent: each directive matches the expand at the same index.
 * Use ngxproCell, ngxproTitle, ngxproSubtitle for layout (from @ngxpro/cdk).
 *
 * @example
 * <ngxpro-accordion>
 *   <button ngxproAccordion ngxproCell="m">
 *     <span ngxproTitle><strong>Group 1</strong></span>
 *     <span ngxproSubtitle>3 operations • Total: $1,234</span>
 *   </button>
 *   <ngxpro-expand>
 *     <div ngxproCell *ngFor="let item of items">...</div>
 *   </ngxpro-expand>
 *
 *   <button ngxproAccordion ngxproCell="m">
 *     <span ngxproTitle><strong>Group 2</strong></span>
 *     <span ngxproSubtitle>2 operations</span>
 *   </button>
 *   <ngxpro-expand>
 *     ...
 *   </ngxpro-expand>
 * </ngxpro-accordion>
 */
@Directive({
  selector:
    'button[ngxproAccordion], ngxpro-accordion-trigger[ngxproAccordion]',
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

  /** Whether this accordion item is open. Supports two-way binding via [ngxproAccordion]. */
  readonly open = model<boolean>(false);

  @HostListener('click')
  protected toggle(): void {
    this.open.set(!this.open());
    this.accordion?.toggleDirective(this);
  }
}
