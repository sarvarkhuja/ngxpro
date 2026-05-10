/**
 * Out-of-scope-for-v1 markdown processor. The Taiga implementation depends on
 * `markdown-it`; here we keep the symbol but ship a no-op default that simply
 * returns the input wrapped in an array. Consumers can override the
 * `NXP_DOC_EXAMPLE_MARKDOWN_CODE_PROCESSOR` token if they want real parsing.
 */
export function nxpTryParseMarkdownCodeBlock(text = ''): string[] {
  return text ? [text] : [];
}
