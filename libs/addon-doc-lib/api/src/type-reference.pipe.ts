import { inject, Pipe, type PipeTransform } from '@angular/core';
import {
  NXP_DOC_TYPE_REFERENCE_HANDLER,
  NXP_DOC_TYPE_REFERENCE_PARSER,
} from '@ngxpro/addon-doc-lib/tokens';

/**
 * Splits a TypeScript type expression into renderable fragments and resolves
 * each to an optional documentation URL via `NXP_DOC_TYPE_REFERENCE_HANDLER`.
 * Fragments with a non-null `reference` render as anchor links in the API
 * table; the rest render as plain text.
 */
@Pipe({ name: 'nxpTypeReference' })
export class NxpTypeReferencePipe implements PipeTransform {
  private readonly parser = inject(NXP_DOC_TYPE_REFERENCE_PARSER);
  private readonly linkHandler = inject(NXP_DOC_TYPE_REFERENCE_HANDLER);

  public transform(original: string): ReadonlyArray<{
    type: string;
    extracted: string;
    reference: string | null;
  }> {
    return this.parser(original)
      .map(({ type, extracted }) => ({
        type,
        extracted,
        reference: this.linkHandler?.(extracted) ?? null,
      }))
      .sort((a, b) => b.reference?.localeCompare(a.reference ?? '') ?? -1);
  }
}
