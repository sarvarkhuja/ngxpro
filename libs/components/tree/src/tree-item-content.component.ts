import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { cx } from '@ngxpro/cdk';
import { NxpTreeItemComponent } from './tree-item.component';
import { NXP_TREE_LEVEL } from './tree.tokens';

/**
 * Default renderer for a tree node's visible row. Displays a chevron toggle
 * button when the node is expandable, followed by projected content.
 *
 * Visual language (design-system.md):
 * - `rounded-m` (6px — Vercel button radius) on the row hover surface
 * - Hover background: `bg-bg-neutral-1` (Gray 50 — subtle surface tint)
 * - Chevron: `cubic-bezier(0.32, 0.72, 0, 1)` at duration-slow — Vercel's
 *   engineered snap-then-settle motion. `active:scale-90` for tactile press.
 * - Focus ring: `border-focus` outline at 2px, offset 1px — Geist focus blue
 * - Label uses `tracking-body` (-0.02em) — Geist's signature negative tracking
 *   that runs through the entire scale.
 * - The entire row is the click target when the node is expandable; the
 *   chevron button stays for keyboard activation and its click bubbles up.
 *
 * @example
 * <nxp-tree-item-content>
 *   <span>Folder label</span>
 * </nxp-tree-item-content>
 */
@Component({
  selector: 'nxp-tree-item-content',
  template: `
    <!-- Row click is a mouse convenience; the inner button below carries the
         keyboard semantics (focus, Enter/Space, aria-expanded). -->
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div
      [class]="rowClasses()"
      [style.padding-left.px]="indentPx()"
      (click)="item.toggle()"
    >
      @if (item.expandable()) {
        <button
          type="button"
          [attr.aria-label]="item.expanded() ? 'Collapse' : 'Expand'"
          [attr.aria-expanded]="item.expanded()"
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
        <span class="size-5 shrink-0" aria-hidden="true"></span>
      }
      <span
        class="min-w-0 flex-1 text-sm leading-5 tracking-body text-text-primary"
      >
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

  /**
   * Row container — selectable, indented, hover-tinted. The row itself is the
   * click target when the node is expandable, so `cursor-pointer` lights up
   * there; leaf rows keep the default cursor since `toggle()` is a no-op.
   */
  readonly rowClasses = computed(() =>
    cx(
      'group/row relative flex select-none items-center gap-1 rounded-m py-1 pr-2',
      'transition-colors duration-fast ease-out',
      'hover:bg-bg-neutral-1',
      this.item.expandable() && 'cursor-pointer',
    ),
  );

  /**
   * Chevron toggle — 20px hit-target, 16px icon. Hovering the chevron itself
   * deepens its surface (bg-neutral-2) on top of the row hover; pressing
   * compresses to 90% scale for tactile feedback.
   */
  readonly toggleClasses = cx(
    'inline-flex size-5 shrink-0 items-center justify-center rounded-xs',
    'text-text-tertiary',
    'transition-[color,transform,background-color] duration-fast ease-out',
    'group-hover/row:text-text-primary',
    'hover:bg-bg-neutral-2 active:scale-90',
    'cursor-pointer',
    'outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus',
  );

  /**
   * Chevron rotation — Vercel's signature easing curve (snap-then-settle).
   * `cubic-bezier(0.32, 0.72, 0, 1)` mirrors the curve used on Vercel.com
   * for compressed-feeling, engineered motion. 200ms reads as deliberate
   * without feeling sluggish.
   */
  readonly chevronClasses = computed(() =>
    cx(
      'size-4 shrink-0',
      'transition-transform duration-slow ease-[cubic-bezier(0.32,0.72,0,1)]',
      this.item.expanded() && 'rotate-90',
    ),
  );
}
