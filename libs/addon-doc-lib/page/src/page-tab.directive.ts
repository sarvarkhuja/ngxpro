import { Directive, inject, input, TemplateRef } from '@angular/core';

/**
 * `<ng-template pageTab="…">` connector projected into `<nxp-doc-page>` to
 * register an additional tab. The directive captures the template and an
 * optional label; the page component pulls them out via `contentChildren`.
 */
@Directive({ selector: 'ng-template[pageTab]' })
export class NxpDocPageTabConnectorDirective {
  /** Display label for the tab. Falls back to a configured default. */
  public readonly pageTab = input<string>();
  public readonly template = inject(TemplateRef<Record<string, unknown>>);
}
