/**
 * Context object passed to `NXP_DOC_SOURCE_CODE` consumers when building the
 * source-code link for the current page.
 */
export interface NxpDocSourceCodePathOptions {
  readonly header: string;
  readonly package: string;
  readonly path: string;
  readonly type: string;
}
