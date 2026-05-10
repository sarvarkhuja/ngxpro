import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@ngxpro/cdk';
import {
  NXP_DOC_ICONS,
  NXP_DOC_SOURCE_CODE,
  NXP_DOC_SOURCE_CODE_TEXT,
} from '@ngxpro/addon-doc-lib/tokens';
import type { NxpDocSourceCodePathOptions } from '@ngxpro/addon-doc-lib/types';

/**
 * "Source code" link rendered next to the page tab strip. The link target
 * comes from `NXP_DOC_SOURCE_CODE`:
 *
 * - `string` → used directly as the `href`.
 * - `TemplateRef<NxpDocSourceCodePathOptions>` → instantiated per page; the
 *   first child node's `[href]` is used.
 * - `null` → button is hidden (default).
 *
 * If the page-level `path` input is itself a URL (`http(s)://…`) it overrides
 * the configured handler — useful for pages that want to link to a specific
 * external resource.
 */
@Component({
  selector: 'nxp-doc-source-code',
  imports: [NgTemplateOutlet],
  template: `
    @if (resolvedHref(); as href) {
      <a [class]="linkClasses" target="_blank" rel="noreferrer" [href]="href">
        <i [class]="iconClasses" aria-hidden="true"></i>
        <span>{{ text() }}</span>
      </a>
    } @else if (sourceCodeTemplate(); as tpl) {
      <ng-container
        [ngTemplateOutlet]="tpl"
        [ngTemplateOutletContext]="pathOptions()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocSourceCodeComponent {
  protected readonly icons = inject(NXP_DOC_ICONS);
  protected readonly sourceCode = inject(NXP_DOC_SOURCE_CODE);
  protected readonly text = inject(NXP_DOC_SOURCE_CODE_TEXT);

  public readonly header = input('');
  public readonly package = input('');
  public readonly type = input('');
  public readonly path = input('');

  protected readonly pathOptions = computed(
    (): NxpDocSourceCodePathOptions => ({
      header: this.header(),
      package: this.package(),
      type: this.type(),
      path: this.path(),
    }),
  );

  protected readonly pathIsUrl = computed(
    (): boolean => this.path()?.startsWith('http') ?? false,
  );

  protected readonly resolvedHref = computed<string | null>(() => {
    if (this.pathIsUrl()) return this.path();
    if (typeof this.sourceCode === 'string' && this.sourceCode) {
      return this.sourceCode;
    }
    return null;
  });

  protected readonly sourceCodeTemplate = computed(() =>
    this.sourceCode instanceof TemplateRef ? this.sourceCode : null,
  );

  protected readonly linkClasses = cx(
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-s text-sm font-medium',
    'border border-border-normal bg-bg-base text-text-primary',
    'hover:bg-bg-neutral-1 transition-colors duration-normal',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
  );

  protected readonly iconClasses = cx(
    'text-base leading-none',
    this.icons.code,
  );
}
