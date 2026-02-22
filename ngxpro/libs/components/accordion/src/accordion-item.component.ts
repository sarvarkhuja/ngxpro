import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AccordionComponent } from './accordion.component';
import { cx, ExpandComponent } from '@nxp/cdk';

/**
 * Individual accordion item with trigger and collapsible content.
 *
 * @example
 * <nxp-accordion-item title="Section Title">
 *   <p>Collapsed content goes here.</p>
 * </nxp-accordion-item>
 */
@Component({
  selector: 'nxp-accordion-item',
  imports: [ExpandComponent],
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="expanded()"
      [attr.disabled]="disabled() ? true : null"
      [class]="triggerClasses"
    >
      <span
        class="text-sm font-medium leading-none text-gray-900 dark:text-gray-50"
      >
        {{ title() }}
      </span>
      <i [class]="iconClasses()" class="ri-add-line" aria-hidden="true"></i>
    </button>
    <nxp-expand [expanded]="expanded()">
      <div
        class="overflow-hidden px-4 pb-4 text-sm text-gray-700 dark:text-gray-200"
      >
        <ng-content />
      </div>
    </nxp-expand>
  `,
  host: {
    class:
      'block overflow-hidden border-b border-gray-200 dark:border-gray-800 first:mt-0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  /** Title displayed in the trigger. */
  readonly title = input.required<string>();

  /** Whether this item is disabled. */
  readonly disabled = input(false);

  /** Emits when the expanded state changes. */
  readonly expandedChange = output<boolean>();

  /** Whether this item is currently expanded. */
  readonly expanded = signal(false);

  private readonly accordion = inject(AccordionComponent, { optional: true });

  readonly triggerClasses = cx(
    // base (Tremor: group flex flex-1 cursor-pointer items-center justify-between py-3 text-left text-sm leading-none font-medium)
    'flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left',
    // focus
    'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
    // disabled (Tremor: data-disabled:cursor-default data-disabled:text-gray-400)
    'disabled:cursor-default disabled:text-gray-400 dark:disabled:text-gray-600',
  );

  readonly iconClasses = () =>
    cx(
      // base (Tremor: size-5 shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[state=open]:-rotate-45)
      'size-5 shrink-0 text-gray-400 dark:text-gray-600 transition-transform duration-150 ease-[cubic-bezier(0.87,0,0.13,1)]',
      this.expanded() && '-rotate-45',
      this.disabled() && '!text-gray-300 dark:!text-gray-700',
    );

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.expanded();
    this.expanded.set(next);
    this.expandedChange.emit(next);

    if (next) {
      this.accordion?.closeAllExcept(this);
    }
  }

  close(): void {
    if (this.expanded()) {
      this.expanded.set(false);
      this.expandedChange.emit(false);
    }
  }
}
