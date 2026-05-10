import { InjectionToken } from '@angular/core';
import { identity } from 'rxjs';
import { nxpTryParseMarkdownCodeBlock } from '@ngxpro/addon-doc-lib/utils';

/**
 * Hook for transforming example content (e.g. masking secrets) before it is
 * rendered. Default is identity. Mirrors `TUI_DOC_EXAMPLE_CONTENT_PROCESSOR`.
 */
export const NXP_DOC_EXAMPLE_CONTENT_PROCESSOR = new InjectionToken<
  (input: Record<string, string>) => Record<string, string>
>('NXP_DOC_EXAMPLE_CONTENT_PROCESSOR', { factory: () => identity });

/**
 * Hook for parsing markdown code blocks inside `<nxp-doc-code>`. Default is a
 * no-op pass-through (the dependency on `markdown-it` is intentionally
 * deferred — see CLAUDE.md "Out of scope" notes). Consumers can override with
 * a real implementation.
 */
export const NXP_DOC_EXAMPLE_MARKDOWN_CODE_PROCESSOR = new InjectionToken<
  (input: string) => readonly string[]
>('NXP_DOC_EXAMPLE_MARKDOWN_CODE_PROCESSOR', {
  factory: () => nxpTryParseMarkdownCodeBlock,
});
