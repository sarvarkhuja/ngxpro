import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { cx } from '@nxp/cdk';

/**
 * DataList — accessible listbox container.
 *
 * Wraps a list of `<button nxpOption>` or `<div nxpOptGroup>` children in a
 * `role="listbox"` container with:
 * - **Keyboard navigation**: Arrow / Home / End keys move focus between options.
 * - **Empty state**: Placeholder when no options are projected.
 * - **Size variants**: Readable by child `[nxpOption]` via direct parent injection.
 *
 * This is the @nxp equivalent of Taiga UI's `TuiDataList`.
 *
 * @example
 * <!-- Basic -->
 * <nxp-data-list>
 *   <button nxpOption>Option 1</button>
 *   <button nxpOption [selected]="true">Option 2</button>
 * </nxp-data-list>
 *
 * @example
 * <!-- With preset periods (CalendarRange use-case) -->
 * <nxp-data-list emptyLabel="No presets" size="sm">
 *   @for (item of periods; track item.label) {
 *     <button nxpOption [selected]="isActive(item)" (click)="select(item)">
 *       {{ item.label }}
 *     </button>
 *   }
 * </nxp-data-list>
 *
 * @example
 * <!-- With opt-groups -->
 * <nxp-data-list>
 *   <div nxpOptGroup label="Quick picks">
 *     <button nxpOption>Today</button>
 *   </div>
 *   <div nxpOptGroup label="Ranges">
 *     <button nxpOption>Last 7 days</button>
 *   </div>
 * </nxp-data-list>
 */
@Component({
  selector: 'nxp-data-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listbox',
    '[attr.aria-label]': 'label() || null',
    '[class]': 'hostClass()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <ng-content />

    @if (empty()) {
      <span
        class="flex items-center justify-center px-3 py-5 text-sm text-gray-400 dark:text-gray-600 select-none"
        aria-selected="false"
        aria-disabled="true"
        role="option"
      >
        {{ emptyLabel() }}
      </span>
    }
  `,
})
export class DataListComponent implements AfterContentChecked {
  private readonly elRef = inject(ElementRef);

  // ------------------------------------------------------------------ inputs

  /** Accessible label for the listbox (`aria-label`). */
  readonly label = input<string | undefined>(undefined);

  /**
   * Text shown when no `[nxpOption]` children are present.
   * The empty state is hidden when at least one option exists.
   */
  readonly emptyLabel = input<string>('No options');

  /**
   * Size variant — readable by child `[nxpOption]` elements via
   * direct parent injection (`inject(DataListComponent, { optional: true })`).
   * - `sm`: compact (px-2 py-1, text-xs)
   * - `md`: default (px-3 py-1.5, text-sm)
   * - `lg`: spacious (px-4 py-2, text-sm)
   */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /** Additional CSS classes merged onto the host element. */
  readonly class = input<string>('');

  // ------------------------------------------------------------------ state

  /** True when no `button[role="option"]` children are found in the DOM. */
  protected readonly empty = signal(false);

  // ------------------------------------------------------------------ host class

  protected readonly hostClass = () =>
    cx('flex flex-col gap-0.5 min-w-[9rem]', this.class());

  // ------------------------------------------------------------------ lifecycle

  ngAfterContentChecked(): void {
    const host = this.elRef.nativeElement as HTMLElement;
    const options = host.querySelectorAll('button[role="option"]');
    this.empty.set(options.length === 0);
  }

  // ------------------------------------------------------------------ keyboard navigation

  /**
   * Arrow keys move focus between enabled option buttons.
   * Home / End jump to the first / last option.
   */
  protected onKeydown(event: KeyboardEvent): void {
    const { key } = event;

    if (
      key !== 'ArrowDown' &&
      key !== 'ArrowUp' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return;
    }

    const host = this.elRef.nativeElement as HTMLElement;
    const nodeList = host.querySelectorAll(
      'button[role="option"]:not([disabled]):not([aria-disabled="true"])',
    );
    const options = Array.from(nodeList) as HTMLElement[];

    if (!options.length) return;

    event.preventDefault();

    const active = document.activeElement;
    const currentIndex = active ? options.indexOf(active as HTMLElement) : -1;

    let nextIndex: number;
    switch (key) {
      case 'ArrowDown':
        nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = options.length - 1;
        break;
      default:
        return;
    }

    const target = options[nextIndex];
    if (target) {
      target.focus();
    }
  }
}
