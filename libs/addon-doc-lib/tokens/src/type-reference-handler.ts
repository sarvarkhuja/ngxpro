import { InjectionToken } from '@angular/core';
import {
  type NxpDocTypeReferenceParsed,
  nxpTypeReferenceParser,
} from '@ngxpro/addon-doc-lib/utils';

/**
 * Function that maps an extracted bare type name (e.g. `Observable`) to a
 * documentation URL, or `null` to render plain text. Default returns `null`
 * for everything.
 */
export const NXP_DOC_TYPE_REFERENCE_HANDLER = new InjectionToken<
  ((type: string) => string | null) | null
>('NXP_DOC_TYPE_REFERENCE_HANDLER', { factory: () => null });

/**
 * Function that breaks an arbitrary TS type expression into per-fragment
 * pieces consumed by the API table. Defaults to `nxpTypeReferenceParser`.
 */
export const NXP_DOC_TYPE_REFERENCE_PARSER = new InjectionToken<
  (input: string) => NxpDocTypeReferenceParsed
>('NXP_DOC_TYPE_REFERENCE_PARSER', { factory: () => nxpTypeReferenceParser });
