import { Injectable, inject } from '@angular/core';
import { Observable, share } from 'rxjs';
import { NXP_DOCUMENT } from '../tokens';
import { nxpTypedFromEvent } from '../observables/typed-from-event';

type EventMap = {
  pointerdown: PointerEvent;
  mouseover: MouseEvent;
  mouseout: MouseEvent;
  keydown: KeyboardEvent;
  contextmenu: MouseEvent;
};

/**
 * Root-level singleton that multicasts a single document-scoped listener per
 * event type. Replaces the per-instance `nxpTypedFromEvent(document, ...)`
 * pattern in dropdown directives — with N dropdowns on a page that pattern
 * registered N listeners; this registers exactly one per event type.
 *
 * Capture-phase variants are exposed separately because mixing capture with
 * non-capture in a single multicast would change semantics.
 */
@Injectable({ providedIn: 'root' })
export class NxpDocumentEvents {
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly bubble = new Map<string, Observable<Event>>();
  private readonly capture = new Map<string, Observable<Event>>();

  pointerdown(): Observable<PointerEvent> {
    return this.get('pointerdown', false) as Observable<PointerEvent>;
  }

  mouseover(): Observable<MouseEvent> {
    return this.get('mouseover', false) as Observable<MouseEvent>;
  }

  mouseout(): Observable<MouseEvent> {
    return this.get('mouseout', false) as Observable<MouseEvent>;
  }

  keydown(): Observable<KeyboardEvent> {
    return this.get('keydown', false) as Observable<KeyboardEvent>;
  }

  contextmenuCapture(): Observable<MouseEvent> {
    return this.get('contextmenu', true) as Observable<MouseEvent>;
  }

  /** Generic accessor for callers that need a less-common event. */
  on<K extends keyof EventMap>(
    type: K,
    options?: { capture?: boolean },
  ): Observable<EventMap[K]> {
    return this.get(type, options?.capture ?? false) as Observable<EventMap[K]>;
  }

  private get(type: string, capture: boolean): Observable<Event> {
    const cache = capture ? this.capture : this.bubble;
    const cached = cache.get(type);
    if (cached) return cached;
    const stream = nxpTypedFromEvent(
      this.doc,
      type as keyof DocumentEventMap,
      capture ? { capture: true } : undefined,
    ).pipe(share());
    cache.set(type, stream as Observable<Event>);
    return stream as Observable<Event>;
  }
}
