/**
 * Checks if the given node is an HTMLElement.
 */
export function isElement(node: Node | null): node is HTMLElement {
  return node?.nodeType === Node.ELEMENT_NODE;
}

/**
 * Checks if an element is currently focused.
 */
export function isFocused(element: Element): boolean {
  return element === element.ownerDocument.activeElement;
}

/**
 * Returns the active element, piercing shadow DOM boundaries.
 */
export function getActiveElement(root: Document | ShadowRoot = document): Element | null {
  const active = root.activeElement;
  if (active?.shadowRoot) {
    return getActiveElement(active.shadowRoot);
  }
  return active;
}

/**
 * Checks if an element is visible in the viewport.
 */
export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
