import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 *
 * @example
 * cx('px-2 py-1', condition && 'bg-blue-500', 'px-4')
 * // => 'py-1 bg-blue-500 px-4' (px-4 wins over px-2)
 */
export function cx(...args: ClassValue[]): string {
  return twMerge(clsx(...args));
}
