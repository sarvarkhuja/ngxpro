import type {
  NxpDocRoutePage,
  NxpDocRoutePageGroup,
} from '@ngxpro/addon-doc-lib/types';
import { nxpIsRoutePageGroup } from './is-page-group';

/**
 * Returns `pages` sorted by `section`-then-`title`, recursively descending
 * into page groups. Sections listed in `excludeSections` keep their original
 * order. Mirrors `tuiSortPages`.
 */
export function nxpSortPages<T extends NxpDocRoutePage | NxpDocRoutePageGroup>(
  pages: readonly T[],
  excludeSections = new Set<string>(),
): readonly T[] {
  const sections = Array.from(new Set(pages.map((page) => page.section)));

  const sortedPages = pages.slice().sort((a, b) => {
    if (
      excludeSections.has(a.section ?? '') ||
      excludeSections.has(b.section ?? '')
    ) {
      return 0;
    }

    const aSectionIndex = sections.indexOf(a.section);
    const bSectionIndex = sections.indexOf(b.section);

    if (aSectionIndex !== bSectionIndex) {
      return aSectionIndex - bSectionIndex;
    }

    return a.title > b.title ? 1 : a.title.localeCompare(b.title);
  });

  return sortedPages.map((page) =>
    nxpIsRoutePageGroup(page)
      ? ({
          ...page,
          subPages: nxpSortPages(page.subPages, excludeSections),
        } as T)
      : page,
  );
}
