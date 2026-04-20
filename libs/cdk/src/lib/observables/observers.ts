import { Observable } from 'rxjs';

/**
 * Creates an Observable from a resize observer on the given element.
 */
export function fromResizeObserver(element: Element): Observable<ResizeObserverEntry[]> {
  return new Observable<ResizeObserverEntry[]>((subscriber) => {
    const observer = new ResizeObserver((entries) => subscriber.next(entries));
    observer.observe(element);
    return () => observer.disconnect();
  });
}

/**
 * Creates an Observable from an intersection observer on the given element.
 */
export function fromIntersectionObserver(
  element: Element,
  options?: IntersectionObserverInit,
): Observable<IntersectionObserverEntry[]> {
  return new Observable<IntersectionObserverEntry[]>((subscriber) => {
    const observer = new IntersectionObserver(
      (entries) => subscriber.next(entries),
      options,
    );
    observer.observe(element);
    return () => observer.disconnect();
  });
}
