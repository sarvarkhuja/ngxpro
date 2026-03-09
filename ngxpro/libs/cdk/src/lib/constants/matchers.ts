import type { NxpStringHandler } from '../tokens/items-handlers';

/**
 * Matcher function type for combo-box filtering.
 * Given an item, a search string, and a stringify function, returns whether the item matches.
 */
export type NxpStringMatcher<T> = (
  item: T,
  matchValue: string,
  stringify: NxpStringHandler<T | string>,
) => boolean;

/**
 * Strict matcher — matches when the stringified item exactly equals the search value
 * (case-insensitive). Used for value confirmation in combo-box inputs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NXP_STRICT_MATCHER: NxpStringMatcher<any> = (
  item,
  search,
  stringify,
): boolean => stringify(item).toLowerCase() === search.toLowerCase();

/**
 * Default matcher — matches when the stringified item contains the search value
 * (case-insensitive). Used for incremental filtering in combo-box inputs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NXP_DEFAULT_MATCHER: NxpStringMatcher<any> = (
  item,
  search,
  stringify,
): boolean => stringify(item).toLowerCase().includes(search.toLowerCase());
