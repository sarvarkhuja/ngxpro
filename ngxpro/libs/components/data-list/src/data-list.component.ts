import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import {
  cx,
  NxpAnimatedProximityBase,
  type NxpItemRect,
} from '@nxp/cdk';

/**
 * DataList — accessible listbox container with animated proximity-hover.
 *
 * Wraps a list of `<button nxpOption>` or `<div nxpOptGroup>` children in a
 * `role="listbox"` container with:
 * - **Animated indicators**: Selected background, hover background, focus ring
 *   driven by pointer proximity (extends `NxpAnimatedProximityBase`).
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
 * <nxp-data-list emptyLabel="No presets" size="sm" [(selectedIndex)]="activeIdx">
 *   @for (item of periods; track item.label; let i = $index) {
 *     <button nxpOption [selected]="isActive(item)" (click)="select(item, i)">
 *       {{ item.label }}
 *     </button>
 *   }
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
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut()',
  },
  template: `
    <ng-content />

    @if (empty()) {
      <span
        class="flex items-center justify-center px-3 py-5 text-sm text-gray-400 dark:text-gray-600 select-none"
        role="presentation"
      >
        {{ emptyLabel() }}
      </span>
    }

    <!-- Active/selected background overlay -->
    @if (selectedRect(); as r) {
      <div
        class="absolute pointer-events-none rounded-lg bg-neutral-900/[0.06] dark:bg-white/[0.08]"
        [style.left.px]="r.left"
        [style.top.px]="r.top"
        [style.width.px]="r.width"
        [style.height.px]="r.height"
        [style.opacity]="isHoveringOther() ? 0.8 : 1"
        [style.transition]="segmentTransition"
      ></div>
    }

    <!-- Hover background overlay (all hovered items including selected) -->
    @if (hoverRect(); as h) {
      <div
        class="absolute pointer-events-none rounded-lg bg-neutral-900/[0.04] dark:bg-white/[0.05]"
        [style.left.px]="h.left"
        [style.top.px]="h.top"
        [style.width.px]="h.width"
        [style.height.px]="h.height"
        [style.transition]="hoverTransition"
      ></div>
    }

    <!-- Focus ring overlay -->
    @if (focusRect(); as f) {
      <div
        class="absolute pointer-events-none z-20 rounded-lg border border-[#6B97FF]"
        [style.left.px]="f.left - 2"
        [style.top.px]="f.top - 2"
        [style.width.px]="f.width + 4"
        [style.height.px]="f.height + 4"
        [style.transition]="hoverTransition"
      ></div>
    }
  `,
})
export class DataListComponent
  extends NxpAnimatedProximityBase
  implements AfterViewChecked
{
  protected readonly axis = 'y' as const;

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

  /** Index of the currently selected option (two-way bindable). */
  readonly selectedIndex = model<number | null>(null);

  // ------------------------------------------------------------------ state

  /** True when no projected `button[nxpOption]` children are found in the DOM. */
  protected readonly empty = signal(false);

  /**
   * Auto-derived selected index from whichever option has `aria-selected="true"`.
   * Falls back to the explicit `selectedIndex` model when set.
   * This mirrors how `NxpNavComponent` derives `checkedIndex` from children.
   */
  private readonly derivedSelectedIndex = signal<number | null>(null);

  /** Effective selected index: explicit model takes priority, then auto-derived. */
  private readonly effectiveSelectedIndex = computed<number | null>(() =>
    this.selectedIndex() ?? this.derivedSelectedIndex(),
  );

  /** Rect of the selected item for the active overlay. */
  protected readonly selectedRect = computed<NxpItemRect | null>(() => {
    const idx = this.effectiveSelectedIndex();
    return idx == null ? null : this.itemRects()[idx] ?? null;
  });

  // ------------------------------------------------------------------ host class

  protected readonly hostClass = () =>
    cx('relative flex flex-col gap-0.5 min-w-[9rem] select-none', this.class());

  // ------------------------------------------------------------------ public API for children

  /** Whether the given element is the currently hovered item. */
  isItemHovered(el: HTMLElement): boolean {
    const idx = this.hoveredIndex();
    if (idx === null) return false;
    const items = this.getItems();
    return items[idx] === el;
  }

  // ------------------------------------------------------------------ base hooks

  protected override resolveActiveIndex(): number | null {
    return this.effectiveSelectedIndex();
  }

  protected override getItems(): readonly HTMLElement[] {
    const options = this.hostEl.querySelectorAll(
      '[role="option"]:not([aria-disabled="true"])',
    );
    return Array.from(options) as HTMLElement[];
  }

  // ------------------------------------------------------------------ lifecycle

  ngAfterViewChecked(): void {
    this.syncIfItemCountChanged();

    // Count only projected nxpOption buttons — NOT the empty-state placeholder.
    const projected = this.hostEl.querySelectorAll('button[nxpOption]');
    this.empty.set(projected.length === 0);

    // Auto-derive selected index from whichever option has aria-selected="true".
    // This lets consumers just use [selected] on nxpOption without needing
    // to also bind [(selectedIndex)] on the data-list.
    if (this.selectedIndex() == null) {
      const items = this.getItems();
      const idx = items.findIndex(
        (el) => el.getAttribute('aria-selected') === 'true',
      );
      this.derivedSelectedIndex.set(idx === -1 ? null : idx);
    }
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

    const options = this.getItems();

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
