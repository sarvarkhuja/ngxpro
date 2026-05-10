import { InjectionToken, type TemplateRef } from '@angular/core';

/**
 * Optional list of action templates rendered alongside the copy button on
 * `<nxp-doc-code>`. Each template receives the current code string via
 * `let-code="$implicit"`.
 *
 * Out of scope for v1: ships an empty default. Consumers wire up their own
 * StackBlitz / open-in-IDE actions via `provideOptions(...)`.
 */
export const NXP_DOC_CODE_ACTIONS = new InjectionToken<
  ReadonlyArray<TemplateRef<{ $implicit: string }> | string>
>('NXP_DOC_CODE_ACTIONS', { factory: () => [] });
