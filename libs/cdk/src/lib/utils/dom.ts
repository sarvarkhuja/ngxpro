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
 * Returns the active element, piercing shadow DOM boundaries. Pass the root
 * explicitly when calling outside a browser context (SSR).
 */
export function getActiveElement(root?: Document | ShadowRoot): Element | null {
  const r = root ?? (typeof document === 'undefined' ? null : document);
  if (!r) return null;
  const active = r.activeElement;
  if (active?.shadowRoot) {
    return getActiveElement(active.shadowRoot);
  }
  return active;
}

/**
 * Checks if an element is visible in the viewport. Returns `false` outside
 * the browser.
 */
export function isElementInViewport(element: Element): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
