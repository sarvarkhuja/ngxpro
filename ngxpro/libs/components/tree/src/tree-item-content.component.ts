import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { cx } from '@nxp/cdk';
import { NxpTreeItemComponent } from './tree-item.component';
import { NXP_TREE_LEVEL } from './tree.tokens';

/**
 * Default renderer for a tree node's visible row. Displays a chevron toggle
 * button when the node is expandable, followed by projected content.
 *
 * @example
 * <nxp-tree-item-content>
 *   <span>Folder label</span>
 * </nxp-tree-item-content>
 */
@Component({
  selector: 'nxp-tree-item-content',
  template: `
    <div
      [class]="rowClasses"
      [style.padding-left.px]="indentPx()"
    >
      @if (item.expandable()) {
        <button
          type="button"
          (click)="item.toggle()"
          [attr.aria-label]="item.expanded() ? 'Collapse' : 'Expand'"
          [class]="toggleClasses"
        >
          <svg
            [class]="chevronClasses()"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      } @else {
        <span class="size-5 shrink-0"></span>
      }
      <span class="flex-1 truncate text-sm text-gray-900 dark:text-gray-50">
        <ng-content />
      </span>
    </div>
  `,
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTreeItemContentComponent {
  protected readonly item = inject(NxpTreeItemComponent);
  private readonly level = inject(NXP_TREE_LEVEL);

  /** Left padding in pixels based on nesting depth. */
  readonly indentPx = computed(() => Math.max(0, this.level) * 16 + 4);

  readonly rowClasses = cx(
    'group flex cursor-pointer select-none items-center gap-1 rounded-md py-1 pr-2',
    'text-gray-700 dark:text-gray-300',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
    'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1',
  );

  readonly toggleClasses = cx(
    'flex shrink-0 items-center justify-center rounded',
    'size-5 text-gray-400 dark:text-gray-500',
    'hover:text-gray-600 dark:hover:text-gray-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  );

  readonly chevronClasses = () =>
    cx(
      'size-4 shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.87,0,0.13,1)]',
      this.item.expanded() && 'rotate-90',
    );
}
