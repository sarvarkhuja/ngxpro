/**
 * Sanitizes pasted or dropped text by removing invisible and control characters.
 */
export function nxpSanitizeText(value: string): string {
  const controlCharsRegex = /[\x00-\x1F\x7F-\x9F]/g;
  const zeroWidthCharsRegex = /[\u200B-\u200D\uFEFF]/g;

  return value.trim().replace(controlCharsRegex, '').replace(zeroWidthCharsRegex, '');
}
