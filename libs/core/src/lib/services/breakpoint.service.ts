import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NXP_WINDOW } from '@ngxpro/cdk';

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
export class BreakpointService {
  private readonly win = inject(NXP_WINDOW);
  private readonly destroyRef = inject(DestroyRef);

  /** Current breakpoint. */
  readonly breakpoint = signal<NgxproBreakpoint>(this.getCurrentBreakpoint());

  /** Whether the viewport is mobile-sized (<640px). */
  readonly isMobile = computed(() => this.breakpoint() === 'mobile');

  /** Whether the viewport is at least tablet-sized (>=640px). */
  readonly isTablet = computed(() => this.breakpoint() !== 'mobile');

  /** Whether the viewport is at least desktop-sized (>=1024px). */
  readonly isDesktop = computed(() => {
    const bp = this.breakpoint();
    return bp === 'desktop' || bp === 'desktopLarge';
  });

  constructor() {
    if (!this.win) return;

    const handler = (): void =>
      this.breakpoint.set(this.getCurrentBreakpoint());
    const cleanups: (() => void)[] = [];
    for (const width of Object.values(BREAKPOINTS)) {
      if (width === 0) continue; // skip the no-op (min-width: 0px) listener
      const mql = this.win.matchMedia(`(min-width: ${width}px)`);
      mql.addEventListener('change', handler);
      cleanups.push(() => mql.removeEventListener('change', handler));
    }
    handler();
    this.destroyRef.onDestroy(() => cleanups.forEach((fn) => fn()));
  }

  private getCurrentBreakpoint(): NgxproBreakpoint {
    const width = this.win?.innerWidth ?? 0;
    if (width >= BREAKPOINTS.desktopLarge) return 'desktopLarge';
    if (width >= BREAKPOINTS.desktop) return 'desktop';
    if (width >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  }
}
