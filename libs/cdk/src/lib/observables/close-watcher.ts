import { Observable } from 'rxjs';

/**
 * Creates an Observable that emits when the CloseWatcher API fires a cancel event.
 * Falls back gracefully if CloseWatcher is not available in the current environment.
 */
interface CloseWatcherLike {
  destroy(): void;
  onclose?: () => void;
  oncancel?: (event: Event) => void;
}

function nxpNoopDestroy(): void {
  // intentional no-op: CloseWatcher API unavailable in this environment
  return undefined;
}

function createCloseWatcher(): CloseWatcherLike {
  try {
    return new (globalThis as unknown as { CloseWatcher: new () => CloseWatcherLike }).CloseWatcher();
  } catch {
    return { destroy: nxpNoopDestroy };
  }
}

export function nxpCloseWatcher(): Observable<void> {
  return new Observable((subscriber) => {
    let watcher: CloseWatcherLike;

    const setup = (): void => {
      watcher = createCloseWatcher();
      watcher.onclose = () => setup();
      watcher.oncancel = (event: Event) => {
        event.preventDefault();
        subscriber.next();
      };
    };

    setup();

    return () => watcher?.destroy();
  });
}
