import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * `<ng-template nxpApiTab>` — captures the API-tab content for
 * `<nxp-doc-component-page>`. Equivalent to writing
 * `<ng-template pageTab="API">` directly against `<nxp-doc-page>`, but the
 * label is standardized across all component pages.
 */
@Directive({ selector: 'ng-template[nxpApiTab]' })
export class NxpDocApiTabDirective {
  public readonly template = inject(TemplateRef<unknown>);
}
