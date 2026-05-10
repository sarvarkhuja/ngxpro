import type {
  NxpDocRoutePage,
  NxpDocRoutePages,
} from '@ngxpro/addon-doc-lib/types';

function assertTitle(
  page: NxpDocRoutePage,
  map: Map<string, NxpDocRoutePage>,
): void {
  if (map.has(page.title) && map.get(page.title)?.route !== page.route) {
    console.error(
      'Title for page should be unique to prevent inconsistent page names',
      page,
      '<== Collisions between ==>',
      map.get(page.title),
    );
  }
}

/**
 * Flatten a `NxpDocRoutePages` tree into a `Map<title, page>` for O(1) lookup
 * by title. Mirrors `tuiToFlatMapPages`.
 */
export function nxpToFlatMapPages(
  pages: NxpDocRoutePages,
): Map<string, NxpDocRoutePage> {
  const map = new Map<string, NxpDocRoutePage>();

  pages.forEach((page) => {
    if ('subPages' in page) {
      page.subPages.forEach((subPage) => {
        if (typeof ngDevMode !== 'undefined' && ngDevMode)
          assertTitle(subPage, map);
        map.set(subPage.title, subPage);
      });
    } else {
      if (typeof ngDevMode !== 'undefined' && ngDevMode) assertTitle(page, map);
      map.set(page.title, page);
    }
  });

  return map;
}
