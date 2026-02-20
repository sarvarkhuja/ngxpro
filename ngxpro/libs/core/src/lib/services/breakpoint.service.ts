import { Injectable, signal, inject, OnDestroy } from '@angular/core';
import { NGXPRO_WINDOW } from '@ngxpro/cdk';

export type NgxproBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'desktopLarge';

const BREAKPOINTS: Record<NgxproBreakpoint, number> = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  desktopLarge: 1280,
};

/**
 * Signal-based breakpoint service using matchMedia.
 * Follows Tailwind's default breakpoint values (sm: 640, lg: 1024, xl: 1280).
 */
@Injectable({ providedIn: 'root' })
export class BreakpointService implements OnDestroy {
  private readonly win = inject(NGXPRO_WINDOW);
  private readonly queries: { mql: MediaQueryList; handler: () => void }[] = [];

  /** Current breakpoint. */
  readonly breakpoint = signal<NgxproBreakpoint>(this.getCurrentBreakpoint());

  /** Whether the viewport is mobile-sized (<640px). */
  readonly isMobile = signal(false);

  /** Whether the viewport is at least tablet-sized (>=640px). */
  readonly isTablet = signal(false);

  /** Whether the viewport is at least desktop-sized (>=1024px). */
  readonly isDesktop = signal(false);

  constructor() {
    this.setupListeners();
  }

  ngOnDestroy(): void {
    for (const { mql, handler } of this.queries) {
      mql.removeEventListener('change', handler);
    }
  }

  private setupListeners(): void {
    const handler = (): void => {
      const bp = this.getCurrentBreakpoint();
      this.breakpoint.set(bp);
      this.isMobile.set(bp === 'mobile');
      this.isTablet.set(bp === 'tablet' || bp === 'desktop' || bp === 'desktopLarge');
      this.isDesktop.set(bp === 'desktop' || bp === 'desktopLarge');
    };

    for (const [, width] of Object.entries(BREAKPOINTS)) {
      const mql = this.win.matchMedia(`(min-width: ${width}px)`);
      mql.addEventListener('change', handler);
      this.queries.push({ mql, handler });
    }

    handler();
  }

  private getCurrentBreakpoint(): NgxproBreakpoint {
    const width = this.win.innerWidth;
    if (width >= BREAKPOINTS.desktopLarge) return 'desktopLarge';
    if (width >= BREAKPOINTS.desktop) return 'desktop';
    if (width >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  }
}
