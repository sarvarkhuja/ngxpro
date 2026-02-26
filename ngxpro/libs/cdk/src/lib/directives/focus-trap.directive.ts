import { DOCUMENT } from '@angular/common';
import { Directive, inject, type OnDestroy } from '@angular/core';
import { nxpInjectElement } from '../utils/inject-element';

// ---------------------------------------------------------------------------
// Inline focus helpers (no @angular/cdk dependency)
// ---------------------------------------------------------------------------

/**
 * Returns the currently focused element, piercing shadow DOM roots.
 */
function nxpGetFocused(doc: Document): Element | null {
  if (!doc.activeElement?.shadowRoot) {
    return doc.activeElement;
  }

  let element: Element | null = doc.activeElement.shadowRoot.activeElement;

  while (element?.shadowRoot) {
    element = element.shadowRoot.activeElement;
  }

  return element;
}

/**
 * Returns true when `current` contains `node` or comes before it in document order.
 */
function nxpContainsOrAfter(current: Node, node: Node): boolean {
  // eslint-disable-next-line no-bitwise
  try {
    return (
      current.contains(node) ||
      !!(node.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_PRECEDING)
    );
  } catch {
    return false;
  }
}

/**
 * Checks whether an element can receive keyboard focus.
 */
function nxpIsFocusable(element: Element): boolean {
  if (element.matches(':disabled') || element.getAttribute('tabIndex') === '-1') {
    return false;
  }

  if (
    (element instanceof HTMLElement && element.isContentEditable) ||
    element.getAttribute('tabIndex') === '0'
  ) {
    return true;
  }

  switch (element.tagName) {
    case 'A':
    case 'LINK':
      return element.hasAttribute('href');
    case 'AUDIO':
    case 'VIDEO':
      return element.hasAttribute('controls');
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;
    case 'INPUT':
      return element.getAttribute('type') !== 'hidden';
    default:
      return false;
  }
}

/**
 * Finds the closest focusable element starting from `initial` inside `root`.
 * Walks the tree forward (or backward when `previous` is true).
 */
function nxpGetClosestFocusable(
  initial: Element,
  root: Node,
  previous = false,
): HTMLElement | null {
  if (!root.ownerDocument) {
    return null;
  }

  const treeWalker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
  );

  treeWalker.currentNode = initial;

  let current: Element = initial;

  do {
    if (treeWalker.currentNode instanceof HTMLElement) {
      current = treeWalker.currentNode;
    }

    if (current instanceof HTMLElement && nxpIsFocusable(current)) {
      return current;
    }
  } while (previous ? treeWalker.previousNode() : treeWalker.nextNode());

  return null;
}

// ---------------------------------------------------------------------------

/**
 * NxpFocusTrap — traps keyboard focus within the host element.
 *
 * - On init, saves the currently focused element and focuses the host.
 * - Intercepts `window:focusin` events to keep focus inside the host.
 * - On destroy, restores focus to the previously focused element.
 *
 * Port of Taiga UI `TuiFocusTrap`.
 */
@Directive({
  selector: '[nxpFocusTrap]',
  host: {
    tabIndex: '0',
    '(window:focusin)': 'initialized && onFocusIn($any($event.target))',
    '(pointerdown)': '$any($event.currentTarget)?.removeAttribute("tabindex")',
  },
})
export class NxpFocusTrap implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly el = nxpInjectElement();
  private activeElement: Element | null = null;
  protected initialized = false;

  constructor() {
    /**
     * Defer initialization to a microtask so that:
     * 1. The current change detection cycle can complete without ExpressionChanged errors.
     * 2. Any concurrently-destroying focus traps can clean up first.
     */
    Promise.resolve().then(() => {
      this.initialized = true;
      this.activeElement = nxpGetFocused(this.doc);
      this.el.focus();
    });
  }

  public ngOnDestroy(): void {
    this.initialized = false;

    if (this.activeElement instanceof HTMLElement) {
      this.activeElement.focus();
    }
  }

  protected onFocusIn(node: Node): void {
    const { firstElementChild } = this.el;

    if (!nxpContainsOrAfter(this.el, node) && firstElementChild) {
      nxpGetClosestFocusable(firstElementChild, this.el)?.focus();
    }
  }
}
