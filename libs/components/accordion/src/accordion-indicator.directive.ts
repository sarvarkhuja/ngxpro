import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * `<ng-template nxpAccordionIndicator let-open>…</ng-template>` — captures a
 * custom indicator template for `<nxp-accordion-trigger>`. The template
 * receives the current `open` boolean as `$implicit`, so consumers can render
 * different content per state (e.g. plus → minus icon swap).
 *
 * @example
 * <nxp-accordion-trigger nxpAccordion>
 *   FAQ Title
 *   <ng-template nxpAccordionIndicator let-open>
 *     <i [class]="open ? 'ri-subtract-line' : 'ri-add-line'"></i>
 *   </ng-template>
 * </nxp-accordion-trigger>
 */
@Directive({ selector: 'ng-template[nxpAccordionIndicator]' })
export class AccordionIndicatorDirective {
  public readonly template = inject(TemplateRef<{ $implicit: boolean }>);
}
