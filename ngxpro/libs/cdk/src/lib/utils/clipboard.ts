/**
 * Gets text from clipboard event data. Cross-browser compatible.
 */
export function nxpGetClipboardDataText(
  event: ClipboardEvent,
  format: string = 'text/plain',
): string {
  return event.clipboardData?.getData(format) ?? event.clipboardData?.getData('text/plain') ?? '';
}

/**
 * Writes text to the clipboard. Tries the async Clipboard API first,
 * falls back to a hidden textarea + execCommand('copy') on unsupported
 * browsers. SSR-safe: returns false if no document is available.
 */
export async function nxpWriteToClipboard(
  text: string,
  doc?: Document,
): Promise<boolean> {
  const resolvedDoc =
    doc ?? (typeof document !== 'undefined' ? document : undefined);
  if (!resolvedDoc) {
    return false;
  }

  // Prefer the async Clipboard API when available.
  try {
    const nav: Navigator | undefined =
      typeof navigator !== 'undefined' ? navigator : undefined;
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to legacy fallback.
  }

  // Legacy fallback: hidden textarea + execCommand('copy').
  try {
    const textarea = resolvedDoc.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    resolvedDoc.body.appendChild(textarea);
    textarea.select();
    const ok = resolvedDoc.execCommand('copy');
    resolvedDoc.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
