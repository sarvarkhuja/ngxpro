import { Pipe, type PipeTransform, TemplateRef } from '@angular/core';
import { nxpInspect } from '@ngxpro/addon-doc-lib/utils';

/**
 * Pretty-prints a JS value for display inside `<nxp-doc-api>` enum cells.
 * Mirrors `TuiInspectPipe`. `TemplateRef` instances render as the literal
 * string `'TemplateRef'`.
 */
@Pipe({ name: 'nxpInspect' })
export class NxpInspectPipe implements PipeTransform {
  public transform(value: unknown, depth = 2): string {
    return value instanceof TemplateRef
      ? 'TemplateRef'
      : nxpInspect(value, depth);
  }
}
