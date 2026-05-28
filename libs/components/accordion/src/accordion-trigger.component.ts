import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { NXP_SPRING_FAST } from '@ngxpro/cdk';
import { AccordionIndicatorDirective } from './accordion-indicator.directive';
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
  hostDirectives: [AccordionDirective],
  imports: [NgTemplateOutlet],
  template: `
    <span class="flex-1 min-w-0 text-left">
      <ng-content />
    </span>
    @if (customIndicator(); as t) {
      <ng-container
        [ngTemplateOutlet]="t.template"
        [ngTemplateOutletContext]="{ $implicit: directive.open() }"
      />
    } @else {
      <i
        [class]="indicatorClasses()"
        [style.transition]="chevronTransition"
        [style.transform]="
          directive.open() ? 'rotate(' + rotation() + 'deg)' : 'rotate(0deg)'
        "
        aria-hidden="true"
      ></i>
    }
  `,
  host: {
    role: 'button',
    tabindex: '0',
    '[attr.aria-expanded]': 'directive.open()',
    '[class._open]': 'directive.open()',
    '(keydown.enter)': '$event.preventDefault(); directive.toggle()',
    '(keydown.space)': '$event.preventDefault(); directive.toggle()',
    class:
      'relative z-10 flex items-center gap-2.5 rounded-m px-3 py-2 w-full cursor-pointer outline-none text-[13px] text-left font-medium text-text-primary focus-visible:outline-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionTriggerComponent {
  protected readonly directive = inject(AccordionDirective);
  protected readonly customIndicator = contentChild(
    AccordionIndicatorDirective,
  );

  /** Remix-icon class for the default rotating indicator. */
  public readonly indicator = input<string>('ri-arrow-right-s-line');

  /** Rotation (deg) applied to the default indicator when the section is open. */
  public readonly rotation = input<number>(90);

  protected readonly indicatorClasses = computed(
    () => `${this.indicator()} shrink-0 text-base leading-none`,
  );

  /** Fast spring transition for the chevron rotation. */
  protected readonly chevronTransition = `transform ${NXP_SPRING_FAST.duration}ms ${NXP_SPRING_FAST.easing}`;
}
