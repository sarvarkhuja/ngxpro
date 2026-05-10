import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { cx, nxpInjectElement } from '@ngxpro/cdk';
import {
  NXP_DOC_MAP_PAGES,
  NXP_DOC_PAGE_CONTEXT,
  NXP_DOC_SEE_ALSO,
  NXP_DOC_SEE_ALSO_TEXT,
  NXP_DOC_TOC_TEXT,
} from '@ngxpro/addon-doc-lib/tokens';
import { NxpDocKebabPipe, nxpToKebab } from '@ngxpro/addon-doc-lib/utils';

/**
 * Table-of-contents column rendered alongside `<nxp-doc-page>`. Discovers
 * `<nxp-doc-example>` headings from the surrounding page DOM and tracks
 * which one is currently in view via a `nxp-example` custom event the
 * example component dispatches when its scroll-margin enters the viewport.
 *
 * The "See also" section is computed by reading the current page's header
 * (via `NXP_DOC_PAGE_CONTEXT`) and intersecting it against the configured
 * `NXP_DOC_SEE_ALSO` groups.
 *
 * @example
 * <nxp-doc-page header="Button">
 *   <nxp-doc-toc />
 *   <nxp-doc-example heading="Variants">…</nxp-doc-example>
 * </nxp-doc-page>
 */
@Component({
  selector: 'nxp-doc-toc',
  imports: [RouterLink, NxpDocKebabPipe],
  template: `
    @if (toc().length > 1) {
      <h2 class="text-sm font-bold text-text-primary my-2">{{ tocText() }}</h2>
      <nav
        class="flex flex-col my-4 mx-0 [clip-path:inset(0.5rem_-1rem)] shadow-[inset_1px_0_0_var(--nxp-border-normal,theme(colors.gray.200))]"
      >
        @for (item of toc(); track $index) {
          <a
            routerLink="."
            [class]="linkClass(isActive(item))"
            [fragment]="item | nxpKebab"
            [relativeTo]="route.firstChild ?? route"
          >
            {{ item }}
          </a>
        }
      </nav>
      @if (seeAlso().length) {
        <h2 class="text-sm font-bold text-text-primary my-2">
          {{ seeAlsoText() }}
        </h2>
        @for (item of seeAlso(); track $index) {
          <a
            class="text-text-action hover:underline"
            [routerLink]="getRouterLink(item)"
            [innerText]="item"
          ></a>
          @if (!$last) {
            <span class="text-text-secondary">{{ ', ' }}</span>
          }
        }
      }
    }
  `,
  host: {
    class: 'sticky top-24 block text-sm empty:hidden',
    '(document:nxp-example)': 'onExample($any($event).detail)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocTocComponent implements OnInit {
  private readonly el = nxpInjectElement<HTMLElement>();
  private readonly pages = inject(NXP_DOC_MAP_PAGES);
  private readonly pageContext = inject(NXP_DOC_PAGE_CONTEXT, {
    optional: true,
  });
  private readonly seeAlsoConfig = inject(NXP_DOC_SEE_ALSO);

  private examples = new Set<string>();
  private readonly active = signal('');

  protected readonly toc = signal<readonly string[]>([]);
  protected readonly route = inject(ActivatedRoute);
  protected readonly tocText = inject(NXP_DOC_TOC_TEXT);
  protected readonly seeAlsoText = inject(NXP_DOC_SEE_ALSO_TEXT);

  protected readonly seeAlso = computed<readonly string[]>(() => {
    const current = this.pageContext?.header() ?? '';
    if (!current) return [];
    const groups = this.seeAlsoConfig.filter((group) =>
      group.includes(current),
    );
    return Array.from(
      new Set(
        groups
          .join()
          .split(',')
          .filter((component) => component && component !== current),
      ),
    );
  });

  public ngOnInit(): void {
    setTimeout(() => {
      const page = this.el.closest('nxp-doc-page');
      const links = page?.querySelectorAll(
        'nxp-doc-example > header [data-nxp-example-link]',
      );
      const toc = Array.from(links || []).map(
        (el) => el.textContent?.trim() || '',
      );
      this.toc.set(toc);
    });
  }

  protected isActive(fragment: string): boolean {
    const active = this.active();
    return active ? fragment === active : fragment === this.toc()[0];
  }

  protected getRouterLink(pageTitle: string): string {
    return this.pages.get(pageTitle)?.route ?? '';
  }

  protected linkClass(active: boolean): string {
    return cx(
      'relative px-4 py-1.5 no-underline text-text-secondary hover:text-text-primary',
      active && 'font-bold text-text-primary',
      active &&
        'before:absolute before:left-[-1px] before:top-2 before:bottom-2 before:w-[3px] before:h-4 before:bg-text-primary before:rounded-full before:p-0',
    );
  }

  protected onExample(detail: { id: string; intersecting: boolean }): void {
    if (detail.intersecting) {
      this.examples.add(detail.id);
    } else {
      this.examples.delete(detail.id);
    }
    const toc = this.toc();
    this.active.set(
      toc.find((item) => this.examples.has(nxpToKebab(item))) ||
        toc[toc.length - 1] ||
        '',
    );
  }
}
