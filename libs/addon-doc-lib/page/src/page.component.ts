import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChildren,
  inject,
  input,
  model,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { forwardRef } from '@angular/core';
import { cx } from '@ngxpro/cdk';
import {
  NXP_DOC_DEFAULT_TABS,
  NXP_DOC_PAGE_CONTEXT,
  type NxpDocPageContext,
} from '@ngxpro/addon-doc-lib/tokens';
import { NxpDocSourceCodeComponent } from '@ngxpro/addon-doc-lib/source-code';
import { NxpSegmentedComponent } from '@ngxpro/components/segmented';
import { NxpBadgeDirective } from '@ngxpro/components/badge';
import { NXP_DOC_TABS } from './page.providers';
import { NxpDocPageTabConnectorDirective } from './page-tab.directive';

/**
 * Top-level page shell rendered by each documentation route.
 *
 * Renders a heading section (title + package/tag badges + optional source-code
 * link + optional segmented tab strip) followed by the page body. Tabs come
 * from two sources:
 *
 * - `<ng-template pageTab="Label">…</ng-template>` content children — projected
 *   directly inside this page.
 * - The `NXP_DOC_TABS` token — resolved per route, useful for share-able
 *   "Examples / API / How to use" tab sets.
 *
 * Provides `NXP_DOC_PAGE_CONTEXT` so descendants like `<nxp-doc-toc>` can
 * read the current header without circularly importing `NxpDocPageComponent`.
 *
 * @example
 * <nxp-doc-page header="Button" package="components" type="component" path="button">
 *   <ng-template pageTab="Examples">
 *     <nxp-doc-example heading="Variants">…</nxp-doc-example>
 *   </ng-template>
 *   <ng-template pageTab="API">
 *     <table nxpDocApi>…</table>
 *   </ng-template>
 * </nxp-doc-page>
 */
@Component({
  selector: 'nxp-doc-page',
  imports: [
    KeyValuePipe,
    NgTemplateOutlet,
    NxpBadgeDirective,
    NxpDocSourceCodeComponent,
    NxpSegmentedComponent,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <header [class]="headerClass">
      <hgroup class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold flex items-center flex-wrap gap-2">
          {{ header() }}
          @if (package()) {
            <span nxpBadge size="md" class="uppercase mr-2">
              {{ package() }}
            </span>
          }
          @for (tag of tags(); track $index) {
            <span nxpBadge size="md" class="uppercase mr-2">
              {{ tag }}
            </span>
          }
        </h1>
        <p [class]="navigationClass">
          @if (visibleTabConnectors().length > 1) {
            <nxp-segmented [(activeItemIndex)]="activeItemIndex">
              @for (tab of visibleTabConnectors(); track tab; let i = $index) {
                @let label = tab.pageTab() || defaultTabs[i];
                @if (label) {
                  <a
                    routerLinkActive
                    [routerLink]="i === 0 ? './' : label.replace(spaceRe, '_')"
                    [routerLinkActiveOptions]="{ exact: i === 0 }"
                    >{{ label }}</a
                  >
                }
              }
              @for (tab of tabsRecord() | keyvalue; track tab.key) {
                <a routerLinkActive [routerLink]="tab.key">{{ tab.key }}</a>
              }
            </nxp-segmented>
          }
          @if (package() || path() || type()) {
            <nxp-doc-source-code
              class="inline-flex"
              [header]="header()"
              [package]="package()"
              [path]="path()"
              [type]="type()"
            />
          }
        </p>
      </hgroup>
    </header>
    <div class="flex gap-12 max-lg:block">
      <main class="flex-1 min-w-0">
        <ng-content />
        @for (tab of visibleTabConnectors(); track tab; let i = $index) {
          @if (i === activeItemIndex()) {
            <ng-container [ngTemplateOutlet]="tab.template" />
          }
        }
        @for (tab of tabsRecord() | keyvalue; track tab.key; let j = $index) {
          @if (j + visibleTabConnectors().length === activeItemIndex()) {
            @if (isTemplate(tab.value); as templ) {
              <ng-container [ngTemplateOutlet]="templ" />
            } @else {
              {{ tab.value }}
            }
          }
        }
      </main>
      <aside class="w-56 shrink-0 max-lg:hidden empty:hidden">
        <ng-content select="nxp-doc-toc" />
      </aside>
    </div>
  `,
  host: {
    class:
      'block max-w-[70rem] text-base p-12 mx-auto max-md:p-4 ' +
      'bg-bg-base text-text-primary',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NXP_DOC_PAGE_CONTEXT,
      useExisting: forwardRef(() => NxpDocPageComponent),
    },
  ],
})
export class NxpDocPageComponent implements NxpDocPageContext {
  protected readonly tabConnectors = contentChildren(
    NxpDocPageTabConnectorDirective,
  );

  private readonly route = inject(ActivatedRoute);
  protected readonly tabsResolver = inject(NXP_DOC_TABS);
  protected readonly tabsRecord = computed(() =>
    this.tabsResolver(this.route.snapshot),
  );

  protected readonly defaultTabs = inject(NXP_DOC_DEFAULT_TABS);
  protected readonly spaceRe = / /g;

  public readonly header = input('');
  public readonly package = input('');
  public readonly type = input('');
  public readonly tags = input<string[]>([]);
  public readonly path = input('');
  public readonly activeItemIndex = model(0);

  protected readonly headerClass = cx('mb-8');

  protected readonly navigationClass = cx(
    'flex gap-2.5 mt-4 overflow-auto',
    '[scrollbar-width:none] [-ms-overflow-style:none]',
    '[&::-webkit-scrollbar]:hidden',
  );

  // header() exposed via NXP_DOC_PAGE_CONTEXT (read by toc).
  protected readonly visibleTabConnectors = computed(() =>
    this.tabConnectors(),
  );

  protected isTemplate(value: unknown): TemplateRef<unknown> | null {
    return value instanceof TemplateRef ? value : null;
  }
}
