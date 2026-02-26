import { fromEvent, type Observable } from 'rxjs';

/**
 * Typed wrapper around fromEvent with proper event map overloads.
 * Provides full type safety for DOM event listeners.
 */
export function nxpTypedFromEvent<E extends keyof WindowEventMap>(
  target: Window,
  event: E,
  options?: AddEventListenerOptions,
): Observable<WindowEventMap[E]>;
export function nxpTypedFromEvent<E extends keyof DocumentEventMap>(
  target: Document,
  event: E,
  options?: AddEventListenerOptions,
): Observable<DocumentEventMap[E]>;
export function nxpTypedFromEvent<T extends Element, E extends keyof HTMLElementEventMap>(
  target: T,
  event: E,
  options?: AddEventListenerOptions,
): Observable<HTMLElementEventMap[E]>;
export function nxpTypedFromEvent(
  target: EventTarget,
  event: string,
  options: AddEventListenerOptions = {},
): Observable<Event> {
  return fromEvent(target, event, options) as Observable<Event>;
}
