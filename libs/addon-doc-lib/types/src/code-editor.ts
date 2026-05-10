import { TemplateRef } from '@angular/core';

/**
 * Optional online IDE integration (e.g. StackBlitz). Out of scope for v1 —
 * the token defaults to `null` and consumers wire up their own implementation
 * if they need the "Edit on …" button to appear.
 */
export interface NxpDocCodeEditor {
  /** Optional template/string shown inside the edit button. */
  readonly content?: TemplateRef<unknown> | string;
  /** Display name used in the default fallback button (e.g. `Edit on StackBlitz`). */
  readonly name: string;
  /**
   * Open the example identified by `component`/`id` in an external editor with
   * the supplied files.
   */
  edit(
    component: string,
    id: string,
    files: Record<string, string>,
  ): Promise<void>;
}
