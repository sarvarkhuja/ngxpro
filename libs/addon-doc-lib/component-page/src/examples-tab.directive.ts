import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * `<ng-template nxpExamplesTab>` — captures the Examples-tab content for
 * `<nxp-doc-component-page>`. Equivalent to writing
 * `<ng-template pageTab="Examples">` directly against `<nxp-doc-page>`, but
 * the label is standardized across all component pages.
 */
@Directive({ selector: 'ng-template[nxpExamplesTab]' })
export class NxpDocExamplesTabDirective {
  public readonly template = inject(TemplateRef<unknown>);
}
