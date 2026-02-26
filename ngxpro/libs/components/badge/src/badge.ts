import { NxpBadgeDirective } from './badge.directive';

/**
 * Convenience array for importing all Badge-related declarations.
 *
 * @example
 * ```typescript
 * import { NxpBadge } from '@nxp/components/badge';
 *
 * @Component({
 *   imports: [...NxpBadge],
 * })
 * ```
 */
export const NxpBadge = [NxpBadgeDirective] as const;
