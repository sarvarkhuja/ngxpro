import type { TemplateRef } from '@angular/core';
import { nxpCreateOptions } from '@ngxpro/cdk';
import { NXP_EXAMPLE_PRIMARY_FILE_NAME } from '@ngxpro/addon-doc-lib/types';

/**
 * Optional config for the `<nxp-doc-example>` component.
 */
export interface NxpDocExampleOptions {
  /**
   * Returns true when the "Edit on …" button should be visible. Default
   * behaviour: visible when both `TypeScript` and `HTML` files are present.
   */
  readonly codeEditorVisibilityHandler: (
    files: Record<string, string>,
  ) => boolean;
  /** Whether the demo area expands to its parent's width by default. */
  readonly fullsize: boolean;
  /** Custom labels for tab buttons keyed by file name. */
  readonly tabTitles: Map<unknown, string | TemplateRef<unknown>>;
}

const DEFAULTS: NxpDocExampleOptions = {
  codeEditorVisibilityHandler: (files) =>
    Boolean(
      files[NXP_EXAMPLE_PRIMARY_FILE_NAME.TS] &&
        files[NXP_EXAMPLE_PRIMARY_FILE_NAME.HTML],
    ),
  tabTitles: new Map(),
  fullsize: true,
};

export const [NXP_DOC_EXAMPLE_OPTIONS, nxpDocExampleOptionsProvider] =
  nxpCreateOptions(DEFAULTS);
