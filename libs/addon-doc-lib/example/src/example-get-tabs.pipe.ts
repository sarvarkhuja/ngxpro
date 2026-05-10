import { Pipe, type PipeTransform } from '@angular/core';

/**
 * Builds the ordered tab list for `<nxp-doc-example>`: the default "Preview"
 * label first, then every non-empty file name in `content`.
 */
@Pipe({ name: 'nxpDocExampleGetTabs' })
export class NxpDocExampleGetTabsPipe implements PipeTransform {
  public transform(
    content: Record<string, string>,
    defaultTab: string,
  ): string[] {
    return [defaultTab, ...Object.keys(content).filter((tab) => content[tab])];
  }
}
