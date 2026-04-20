import { Directive, OnDestroy, OnInit, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { nxpInjectElement } from '../utils/inject-element';

/**
 * NxpObscured — detects when element is scrolled out of visible area.
 * Emits via `nxpObscured$` (true = element obscured).
 */
@Directive({ selector: '[nxpObscured]', exportAs: 'nxpObscured' })
export class NxpObscured implements OnInit, OnDestroy {
  private readonly el = nxpInjectElement();

  readonly nxpObscuredEnabled = signal(false);
  readonly nxpObscured$ = new BehaviorSubject<boolean>(false);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!this.nxpObscuredEnabled()) return;
        const entry = entries[0];
        if (entry && !entry.isIntersecting) {
          this.nxpObscured$.next(true);
        }
      },
      { threshold: 0 },
    );
    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
