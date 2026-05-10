import type { NxpRawLoaderContent } from '@ngxpro/addon-doc-lib/types';
import { nxpRawLoad } from './raw-load';

/**
 * Resolve a record of raw text loaders to a flat string-valued record.
 * Skips falsy entries (their key is omitted from the result).
 */
export async function nxpRawLoadRecord(
  example: Record<string, NxpRawLoaderContent>,
): Promise<Record<string, string>> {
  const processedContent: Record<string, string> = {};

  for (const [key, content] of Object.entries(example)) {
    if (content) {
      processedContent[key] = await nxpRawLoad(content);
    }
  }

  return processedContent;
}
