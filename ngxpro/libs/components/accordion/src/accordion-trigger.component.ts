import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { cx } from '@ngxpro/cdk';
import { AccordionDirective } from './accordion.directive';

/**
 * Accordion trigger with default plus icon (Tremor style).
 * Use with ngxpro-expand for the directive-based accordion pattern.
 *
 * @example
 * <ngxpro-accordion type="single">
 *   <ngxpro-accordion-trigger ngxproCell="m">
 *     <span ngxproTitle><strong>Section 1</strong></span>
 *     <span ngxproSubtitle>Description</span>
 *   </ngxpro-accordion-trigger>
 *   <ngxpro-expand>Content here</ngxpro-expand>
 * </ngxpro-accordion>
 */
@Component({
  selector: 'ngxpro-accordion-trigger[ngxproAccordion]',
  standalone: true,
  hostDirectives: [AccordionDirective],
  template: `
    <span class="flex flex-1 min-w-0">
      <ng-content />
    </span>
    <svg
      [class]="iconClasses()"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
    </svg>
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
