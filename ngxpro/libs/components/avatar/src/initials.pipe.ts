import { Pipe, type PipeTransform } from '@angular/core';

/**
 * Extracts up to 2 initials from a name string.
 * e.g. "Jason Statham" -> "JS", "Alice" -> "A"
 */
export function nxpInitials(text: string): string {
  return text
    .toUpperCase()
    .split(' ')
    .map(([char]) => char)
    .join('')
    .slice(0, 2);
}

@Pipe({ name: 'nxpInitials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(text: string): string {
    return nxpInitials(text);
  }
}
