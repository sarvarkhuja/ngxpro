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
 * Legacy `title`-input based API. For the new directive-based pattern that
 * participates in the animated proximity layers, use `nxp-accordion-trigger`
 * + `nxp-expand` siblings instead.
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
      <span class="flex-1 min-w-0 text-left font-medium">
        {{ title() }}
      </span>
      <i [class]="iconClasses()" aria-hidden="true"></i>
    </button>
    <nxp-expand [expanded]="expanded()">
      <div
        class="overflow-hidden px-3 pb-2 text-[13px] text-gray-700 dark:text-gray-200"
      >
        <ng-content />
      </div>
    </nxp-expand>
  `,
  host: {
    class: 'relative block rounded-lg overflow-hidden',
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
    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-gray-800 dark:text-gray-200',
    'hover:bg-gray-200/40 dark:hover:bg-gray-700/30',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    'disabled:cursor-default disabled:text-gray-400 dark:disabled:text-gray-600',
  );

  readonly iconClasses = () =>
    cx(
      'ri-arrow-right-s-line shrink-0 text-base leading-none text-gray-500 dark:text-gray-400 transition-transform duration-[160ms] ease-[cubic-bezier(0.22,1.2,0.36,1)]',
      this.expanded() && 'rotate-90',
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
