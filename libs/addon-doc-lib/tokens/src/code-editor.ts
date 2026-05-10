import { InjectionToken } from '@angular/core';
import type { NxpDocCodeEditor } from '@ngxpro/addon-doc-lib/types';

/**
 * Optional integration with an external online IDE (StackBlitz, CodeSandbox).
 * Default is `null` — the "Edit" button is hidden unless a consumer provides
 * an implementation.
 */
export const NXP_DOC_CODE_EDITOR = new InjectionToken<NxpDocCodeEditor | null>(
  'NXP_DOC_CODE_EDITOR',
  { factory: () => null },
);
