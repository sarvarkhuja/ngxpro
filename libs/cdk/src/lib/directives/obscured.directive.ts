import { DestroyRef, Directive, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NXP_IS_BROWSER } from '../tokens';
import { nxpInjectElement } from '../utils/inject-element';

/**
 * NxpObscured — detects when element is scrolled out of visible area.
 * Emits via `nxpObscured$` (true = element obscured). SSR-safe.
 */
@Directive({ selector: '[nxpObscured]', exportAs: 'nxpObscured' })
export class NxpObscured {
  private readonly el = nxpInjectElement();
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);

  readonly nxpObscuredEnabled = signal(false);
  readonly nxpObscured$ = new BehaviorSubject<boolean>(false);

  constructor() {
    if (!this.isBrowser) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!this.nxpObscuredEnabled()) return;
        const entry = entries[0];
        if (entry && !entry.isIntersecting) {
          this.nxpObscured$.next(true);
        }
      },
      { threshold: 0 },
    );
    observer.observe(this.el);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
