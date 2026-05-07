/**
 * Sanitizes pasted or dropped text by removing invisible and control characters.
 */
export function nxpSanitizeText(value: string): string {
  // eslint-disable-next-line no-control-regex
  const controlCharsRegex = /[\x00-\x1f\x7f-\x9f]/g;
  const zeroWidthCharsRegex = /[\u200B-\u200D\uFEFF]/g;

  return value
    .trim()
    .replace(controlCharsRegex, '')
    .replace(zeroWidthCharsRegex, '');
}
