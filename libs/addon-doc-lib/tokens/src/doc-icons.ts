import { nxpCreateOptions } from '@ngxpro/cdk';

/**
 * Icon names used by the documentation chrome. Defaults are Remix Icons
 * (`ri-*`) — see `nxpIconsProvider` and the `<nxp-icon>` resolver chain for
 * how the names are resolved at render time.
 */
export interface NxpDocIcons {
  readonly code: string;
  readonly menu: string;
  readonly search: string;
  readonly link: string;
  readonly shrink: string;
  readonly expand: string;
  readonly resizer?: string;
  readonly more: string;
  readonly check: string;
  readonly copy: string;
}

export const NXP_DOC_DEFAULT_ICONS: NxpDocIcons = {
  search: 'ri-search-line',
  code: 'ri-code-line',
  menu: 'ri-menu-line',
  link: 'ri-link',
  shrink: 'ri-fullscreen-exit-line',
  expand: 'ri-fullscreen-line',
  resizer: 'ri-drag-move-2-line',
  more: 'ri-arrow-right-s-line',
  check: 'ri-check-line',
  copy: 'ri-file-copy-line',
};

export const [NXP_DOC_ICONS, nxpDocIconsProvider] = nxpCreateOptions(
  NXP_DOC_DEFAULT_ICONS,
);
