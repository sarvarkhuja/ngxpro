import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NXP_SPRING_FAST } from '@nxp/cdk';
import { AccordionDirective } from './accordion.directive';

/**
 * Accordion trigger with a chevron that rotates 90° on open.
 *
 * Visual language ported from `fluidfunctionalizm/registry/default/accordion.tsx`.
 * The parent `AccordionComponent` paints the hover/focus/open backgrounds via
 * proximity tracking — the trigger itself stays transparent.
 *
 * Note: the reference React component crossfades a normal-weight and a
 * semibold text layer to reserve width. This port omits the dual-layer trick
 * and keeps a single `font-medium` weight, avoiding layout shift without
 * requiring an extra label input and preserving the existing `<ng-content>`
 * projection API.
 *
 * @example
 * <nxp-accordion type="single">
 *   <nxp-accordion-trigger nxpAccordion>
 *     <span nxpTitle><strong>Section 1</strong></span>
 *   </nxp-accordion-trigger>
 *   <nxp-expand>Content here</nxp-expand>
 * </nxp-accordion>
 */
@Component({
  selector: 'nxp-accordion-trigger[nxpAccordion]',
  standalone: true,
  hostDirectives: [AccordionDirective],
  template: `
    <span class="flex-1 min-w-0 text-left">
      <ng-content />
    </span>
    <i
      class="ri-arrow-right-s-line shrink-0 text-base leading-none"
      [style.transition]="chevronTransition"
      [style.transform]="directive.open() ? 'rotate(90deg)' : 'rotate(0deg)'"
      aria-hidden="true"
    ></i>
  `,
  host: {
    type: 'button',
    role: 'button',
    '[attr.aria-expanded]': 'directive.open()',
    '[class._open]': 'directive.open()',
    class:
      'relative z-10 flex items-center gap-2.5 rounded-lg px-3 py-2 w-full cursor-pointer outline-none text-[13px] text-left font-medium text-gray-800 dark:text-gray-200 focus-visible:outline-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionTriggerComponent {
  protected readonly directive = inject(AccordionDirective);

  /** Fast spring transition for the chevron rotation. */
  protected readonly chevronTransition = `transform ${NXP_SPRING_FAST.duration}ms ${NXP_SPRING_FAST.easing}`;
}
