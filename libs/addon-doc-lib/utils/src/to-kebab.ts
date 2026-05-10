import { Pipe, type PipeTransform } from '@angular/core';

/**
 * Converts an arbitrary string (camelCase, PascalCase, "Some Words") to
 * kebab-case. Used for fragment ids and URL slugs. Mirrors `tuiToKebab`.
 */
export function nxpToKebab(str: string): string {
  return str
    .replaceAll(' ', '-')
    .replaceAll(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      ($: string, ofs: number) => `${ofs ? '-' : ''}${$.toLowerCase()}`,
    );
}

/** Pipe form of `nxpToKebab` for use in templates: `{{ value | nxpKebab }}`. */
@Pipe({ name: 'nxpKebab' })
export class NxpDocKebabPipe implements PipeTransform {
  public readonly transform = nxpToKebab;
}
