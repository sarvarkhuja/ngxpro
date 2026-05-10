/**
 * Documentation page types — ngxpro port of `TuiDocRoutePages` family.
 *
 * Plain shapes; no Taiga UI deps.
 */

export type NxpDocRoutePages = ReadonlyArray<
  NxpDocRoutePage | NxpDocRoutePageGroup
>;

export interface NxpDocRoutePageBase {
  readonly section?: string;
  readonly title: string;
}

export interface NxpDocRoutePage extends NxpDocRoutePageBase {
  readonly fragment?: string;
  readonly keywords?: string;
  readonly route: string;
  readonly rel?: HTMLAnchorElement['rel'];
  readonly target?: HTMLAnchorElement['target'];
}

export interface NxpDocRoutePageGroup extends NxpDocRoutePageBase {
  readonly subPages: readonly NxpDocRoutePage[];
}

/**
 * Raw text loader content — either a Promise (e.g. from a `?raw` import) or
 * a literal string.
 */
export type NxpRawLoaderContent =
  | Promise<{ readonly default: unknown }>
  | string;

/**
 * Canonical example file names. Matches Taiga's `TUI_EXAMPLE_PRIMARY_FILE_NAME`.
 */
export const NXP_EXAMPLE_PRIMARY_FILE_NAME = {
  TS: 'TypeScript',
  LESS: 'LESS',
  HTML: 'HTML',
} as const;
