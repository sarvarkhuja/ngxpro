import type { NxpRawLoaderContent } from '@ngxpro/addon-doc-lib/types';

/**
 * Resolve a raw text loader (Promise from a `?raw` import or a literal string)
 * to its plain string contents.
 */
export async function nxpRawLoad(
  content: NxpRawLoaderContent,
): Promise<string> {
  return Promise.resolve(content).then((x) =>
    typeof x === 'object' && 'default' in x ? String(x.default) : x,
  );
}
