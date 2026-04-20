const CHAR_ZERO_WIDTH_SPACE = '\u200B';
const CHAR_NO_BREAK_SPACE = '\u00A0';

/**
 * Expands a selection Range to encompass the full word at the current position.
 */
export function nxpGetWordRange(currentRange: Range): Range {
  const range = currentRange.cloneRange();
  const { startContainer, startOffset, endContainer, endOffset } = range;
  const { ownerDocument } = startContainer;
  if (!ownerDocument) return range;

  const treeWalker = ownerDocument.createTreeWalker(ownerDocument.body, NodeFilter.SHOW_TEXT);
  treeWalker.currentNode = startContainer;

  do {
    const container = treeWalker.currentNode;
    const textContent = container.textContent || '';
    const content =
      container === startContainer
        ? textContent.slice(0, Math.max(0, startOffset + 1))
        : textContent;
    const offset =
      Math.max(
        content.lastIndexOf(' '),
        content.lastIndexOf('\n'),
        content.lastIndexOf(CHAR_NO_BREAK_SPACE),
        content.lastIndexOf(CHAR_ZERO_WIDTH_SPACE),
      ) + 1;
    range.setStart(container, 0);
    if (offset) {
      range.setStart(container, offset);
      break;
    }
  } while (treeWalker.previousNode());

  treeWalker.currentNode = endContainer;

  do {
    const container = treeWalker.currentNode;
    const textContent = container.textContent || '';
    const content =
      container === endContainer ? textContent.slice(endOffset + 1) : textContent;
    const offset = [
      content.indexOf(' '),
      content.lastIndexOf('\n'),
      content.indexOf(CHAR_NO_BREAK_SPACE),
      content.indexOf(CHAR_ZERO_WIDTH_SPACE),
    ].reduce((r, i) => (r === -1 || i === -1 ? Math.max(r, i) : Math.min(r, i)), -1);
    range.setEnd(container, textContent.length);
    if (offset !== -1) {
      range.setEnd(container, offset + textContent.length - content.length);
      break;
    }
  } while (treeWalker.nextNode());

  return range;
}
