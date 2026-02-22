import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import { AccordionDirective } from './accordion.directive';

/**
 * Accordion trigger with default plus icon (Tremor style).
 * Use with nxp-expand for the directive-based accordion pattern.
 *
 * @example
 * <nxp-accordion type="single">
 *   <nxp-accordion-trigger nxpCell="m">
 *     <span nxpTitle><strong>Section 1</strong></span>
 *     <span nxpSubtitle>Description</span>
 *   </nxp-accordion-trigger>
 *   <nxp-expand>Content here</nxp-expand>
 * </nxp-accordion>
 */
@Component({
  selector: 'nxp-accordion-trigger[nxpAccordion]',
  standalone: true,
  hostDirectives: [AccordionDirective],
  template: `
    <span class="flex flex-1 min-w-0">
      <ng-content />
    </span>
    <i [class]="iconClasses()" class="ri-add-line" aria-hidden="true"></i>
  `,
  host: {
    type: 'button',
    role: 'button',
    '[attr.aria-expanded]': 'directive.open()',
    '[class._open]': 'directive.open()',
    '[class]': 'triggerClasses',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionTriggerComponent {
  protected readonly directive = inject(AccordionDirective);

  @HostBinding('style.width') readonly width = '-webkit-fill-available';

  readonly triggerClasses = cx(
    'flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left',
    'text-sm font-medium leading-none text-gray-900 dark:text-gray-50',
    'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
    'border-b border-gray-200 dark:border-gray-800',
  );

  readonly iconClasses = () =>
    cx(
      'size-5 shrink-0 text-gray-400 dark:text-gray-600 transition-transform duration-150 ease-[cubic-bezier(0.87,0,0.13,1)]',
      this.directive.open() && '-rotate-45',
    );
}
