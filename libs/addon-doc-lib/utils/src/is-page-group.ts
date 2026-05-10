import type {
  NxpDocRoutePage,
  NxpDocRoutePageGroup,
} from '@ngxpro/addon-doc-lib/types';

export function nxpIsRoutePageGroup(
  page: NxpDocRoutePage | NxpDocRoutePageGroup,
): page is NxpDocRoutePageGroup {
  return 'subPages' in page;
}
