import { ElementRef, inject } from '@angular/core';

/**
 * Injects the host element of the current directive/component.
 * Shorthand for inject(ElementRef).nativeElement.
 */
export function nxpInjectElement<T = HTMLElement>(): T {
  return inject(ElementRef<T>).nativeElement;
}
