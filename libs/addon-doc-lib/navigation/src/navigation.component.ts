import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, Scroll } from '@angular/router';
import { NxpNavComponent, NxpNavItemDirective } from '@ngxpro/components/menu';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { cx, NXP_DOCUMENT } from '@ngxpro/cdk';
import {
  NXP_DOC_ICONS,
  NXP_DOC_PAGES,
  NXP_DOC_PAGES_ICONS,
  NXP_DOC_SEARCH_ENABLED,
  NXP_DOC_SEARCH_TEXT,
  NXP_DOC_TITLE,
} from '@ngxpro/addon-doc-lib/tokens';
import type { NxpDocRoutePage } from '@ngxpro/addon-doc-lib/types';
import { nxpTransliterateKeyboardLayout } from '@ngxpro/addon-doc-lib/utils';
import { combineLatest, filter, map, mergeMap, type Observable } from 'rxjs';

function uniqBy<T>(array: readonly T[], key: keyof T): readonly T[] {
  return Array.from(
    array
      .reduce(
        (m, item) => (m.has(item[key]) ? m : m.set(item[key], item)),
        new Map<T[keyof T], T>(),
      )
      .values(),
  );
}

/**
 * Sidebar navigation that drives the doc portal. Composes:
 *
 * - A search input (`<input>` + `<nxp-icon>`) — defaulted to enabled, can
 *   filter pages by title or keywords.
 * - Section labels rendered as plain headings, each followed by a flat
 *   `<nxp-nav>` list of that section's pages (subPages flattened in-place).
 * - Top-level pages without a section rendered as a leading flat `<nxp-nav>`
 *   list driven by Angular Router via `[nxpNavItem]`.
 *
 * @example
 * <nxp-doc-navigation />
 */
@Component({
  selector: 'nxp-doc-navigation',
  imports: [
    NxpIconComponent,
    NxpNavComponent,
    NxpNavItemDirective,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    @if (searchEnabled()) {
      <div [class]="searchWrapperClass">
        <nxp-icon
          [icon]="docIcons.search"
          class="text-text-tertiary"
          size="sm"
        />
        <input
          #searchInput
          type="search"
          [class]="searchInputClass"
          [formControl]="search"
          [placeholder]="searchText()"
          autocomplete="off"
        />
        @if (canOpen()) {
          <ul [class]="resultsClass">
            @for (group of filtered(); track $index; let gi = $index) {
              @if (group.length) {
                <li class="text-xs uppercase text-text-tertiary px-3 py-1">
                  {{ labels()[gi] || '' }}
                </li>
                @for (item of group; track item.title) {
                  <li>
                    @if (item.route.includes('://')) {
                      <a
                        [class]="resultLinkClass"
                        [attr.rel]="item.rel"
                        [href]="item.route"
                        [target]="item.target || '_self'"
                        (click)="onClick()"
                        >{{ item.title }}</a
                      >
                    } @else {
                      <a
                        [class]="resultLinkClass"
                        [attr.rel]="item.rel"
                        [routerLink]="item.route"
                        [fragment]="item.fragment"
                        [target]="item.target || '_self'"
                        (click)="onClick()"
                        >{{ item.title }}</a
                      >
                    }
                  </li>
                }
              }
            }
          </ul>
        }
      </div>
    }

    <nav class="flex flex-col gap-4">
      @if (rootPages().length) {
        <nxp-nav class="px-2">
          @for (item of rootPages(); track item.title) {
            @if (item.route.includes('://')) {
              <a
                nxpNavItem
                [attr.rel]="item.rel"
                [href]="item.route"
                [target]="item.target || '_self'"
                >{{ item.title }}</a
              >
            } @else {
              <a
                nxpNavItem
                [attr.rel]="item.rel"
                [routerLink]="item.route"
                [target]="item.target || '_self'"
                >{{ item.title }}</a
              >
            }
          }
        </nxp-nav>
      }
      @for (label of sectionLabels(); track label; let li = $index) {
        <div class="flex flex-col gap-1">
          <div [class]="sectionLabelClass">{{ label }}</div>
          <nxp-nav class="px-2">
            @for (item of sectionPages()[li]; track item.route) {
              @if (item.route.includes('://')) {
                <a
                  nxpNavItem
                  [attr.rel]="item.rel"
                  [href]="item.route"
                  [target]="item.target || '_self'"
                  >{{ item.title }}</a
                >
              } @else {
                <a
                  nxpNavItem
                  [attr.rel]="item.rel"
                  [routerLink]="item.route"
                  [fragment]="item.fragment"
                  [target]="item.target || '_self'"
                  >{{ item.title }}</a
                >
              }
            }
          </nxp-nav>
        </div>
      }
    </nav>
    <ng-content />
  `,
  host: {
    class:
      'fixed left-0 bottom-0 top-[4.125rem] w-[16.5rem] z-0 box-border ' +
      'bg-bg-base dark:bg-bg-neutral-2 border-r border-border-normal ' +
      'flex flex-col text-sm overflow-y-auto p-2 ' +
      'max-md:hidden',
    '(window:keydown)': 'onFocusSearch($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocNavigationComponent {
  private readonly searchInput =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private readonly router = inject(Router);
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly titlePrefix = inject(NXP_DOC_TITLE);
  private readonly titleService = inject(Title);
  private readonly pages = inject(NXP_DOC_PAGES);

  protected readonly searchText = inject(NXP_DOC_SEARCH_TEXT);
  protected readonly searchEnabled = inject(NXP_DOC_SEARCH_ENABLED);
  protected readonly docIcons = inject(NXP_DOC_ICONS);
  protected readonly pagesIcons = inject(NXP_DOC_PAGES_ICONS);

  /** Opt-in Russian-keyboard transliteration for search. Default is `false`. */
  public readonly transliterate = input(false);

  protected readonly search = new FormControl('');
  protected readonly searchValue = toSignal(this.search.valueChanges, {
    initialValue: '',
  });

  protected readonly canOpen = computed(
    () => (this.searchValue()?.trim().length ?? 0) > 2,
  );

  protected readonly labels = computed(() =>
    Array.from(new Set(this.pages.map((page) => page.section))).filter(
      (s): s is string => !!s,
    ),
  );

  /** Top-level flat pages (no section, not a group). */
  protected readonly rootPages = computed(() =>
    this.pages.filter(
      (page): page is NxpDocRoutePage => !page.section && 'route' in page,
    ),
  );

  protected readonly sectionLabels = this.labels;

  /**
   * Pages per section label, flattened. Any `subPages` group within a section
   * contributes its leaf pages in-place — no nested grouping is preserved.
   */
  protected readonly sectionPages = computed<
    ReadonlyArray<readonly NxpDocRoutePage[]>
  >(() => {
    const labels = this.labels();
    return labels.map((label) =>
      this.pages
        .filter((page) => page.section === label)
        .reduce<
          readonly NxpDocRoutePage[]
        >((acc, page) => ('subPages' in page ? [...acc, ...page.subPages] : [...acc, page]), []),
    );
  });

  protected readonly flat = computed<ReadonlyArray<readonly NxpDocRoutePage[]>>(
    () => [...this.sectionPages(), this.rootPages()],
  );

  protected readonly filtered = computed(() => {
    const value = (this.searchValue() ?? '').toLowerCase().trim();
    if (value.length <= 2) return [];
    return this.filterItems(this.flat(), value);
  });

  protected readonly searchWrapperClass = cx(
    'relative inline-flex items-center gap-2 mx-2 my-3 px-3 py-2 rounded-s',
    'border border-border-normal bg-bg-base',
    'focus-within:ring-1 focus-within:ring-border-focus',
  );

  protected readonly searchInputClass = cx(
    'flex-1 min-w-0 bg-transparent outline-none text-sm text-text-primary',
    'placeholder:text-text-quaternary',
  );

  protected readonly resultsClass = cx(
    'absolute top-full inset-x-0 mt-1 max-h-72 overflow-auto rounded-s',
    'bg-bg-base border border-border-normal shadow-md z-10',
  );

  protected readonly resultLinkClass = cx(
    'block px-3 py-2 no-underline text-text-primary hover:bg-bg-neutral-1',
  );

  protected readonly sectionLabelClass = cx(
    'px-3 text-xs font-medium uppercase tracking-wide text-text-tertiary',
  );

  private readonly titleStream$: Observable<string> = combineLatest([
    this.router.events.pipe(
      filter(
        (event): event is NavigationEnd | Scroll =>
          event instanceof NavigationEnd ||
          (event instanceof Scroll &&
            event.routerEvent instanceof NavigationEnd),
      ),
    ),
  ]).pipe(
    map(() => this.router.routerState.root.firstChild),
    filter((r): r is NonNullable<typeof r> => !!r),
    mergeMap((r) => r.data),
    map((data: { title?: string }) => `${this.titlePrefix}${data.title ?? ''}`),
  );

  constructor() {
    this.titleStream$
      .pipe(takeUntilDestroyed())
      .subscribe((title) => this.titleService.setTitle(title));
  }

  protected onClick(): void {
    this.search.setValue('');
  }

  protected onFocusSearch(event: KeyboardEvent): void {
    if (
      event.code === 'Slash' &&
      !this.doc.activeElement?.matches('input,textarea,[contenteditable]')
    ) {
      this.searchInput()?.nativeElement?.focus();
      event.preventDefault();
    }
  }

  private filterItems(
    items: ReadonlyArray<readonly NxpDocRoutePage[]>,
    search: string,
  ): ReadonlyArray<readonly NxpDocRoutePage[]> {
    return items.map((section) =>
      uniqBy(
        section.filter(({ title, keywords = '' }) => {
          const ti = title.toLowerCase();
          const ki = keywords.toLowerCase();
          if (ti.includes(search) || ki.includes(search)) return true;
          if (this.transliterate()) {
            const translit = nxpTransliterateKeyboardLayout(search);
            if (ti.includes(translit) || ki.includes(translit)) return true;
          }
          if (search.replaceAll('-', '').includes(ti)) return true;
          if (
            ti.includes(search.replaceAll(/\s/g, '')) ||
            ki.includes(search.replaceAll(/\s/g, ''))
          ) {
            return true;
          }
          return search.split(/\s/).some((word) => ti.includes(word));
        }),
        'title',
      ),
    );
  }
}
