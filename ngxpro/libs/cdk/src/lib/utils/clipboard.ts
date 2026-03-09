/**
 * Gets text from clipboard event data. Cross-browser compatible.
 */
export function nxpGetClipboardDataText(
  event: ClipboardEvent,
  format: string = 'text/plain',
): string {
  return event.clipboardData?.getData(format) ?? event.clipboardData?.getData('text/plain') ?? '';
}
