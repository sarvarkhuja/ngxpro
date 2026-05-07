import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { NXP_IS_BROWSER } from '@ngxpro/cdk';

/**
 * Coarse "now" tick. The signal updates once per minute on the browser; on
 * the server it returns a fixed value at construction time. Inject this
 * into impure pipes (e.g. RelativeTimePipe) to drive periodic re-rendering
 * without each pipe instance owning its own timer.
 */
@Injectable({ providedIn: 'root' })
export class NowService {
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _now = signal(Date.now());

  /** Reactive timestamp; updates every minute on the browser. */
  readonly now = this._now.asReadonly();

  constructor() {
    if (!this.isBrowser) return;
    const id = setInterval(() => this._now.set(Date.now()), 60_000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }
}
