import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Animation speed multiplier. 1 = normal, 0 = instant (no animations). */
export const NXP_ANIMATIONS_SPEED = new InjectionToken<number>('NXP_ANIMATIONS_SPEED', {
  factory: () => 1,
});

/** Whether reduced motion is preferred (from prefers-reduced-motion media query). */
export const NXP_REDUCED_MOTION = new InjectionToken<boolean>('NXP_REDUCED_MOTION', {
  factory: () => {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (!isBrowser) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
});

/** Whether the platform is considered mobile (viewport < 640px OR touch device). */
export const NXP_IS_MOBILE = new InjectionToken<boolean>('NXP_IS_MOBILE', {
  factory: () => {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    if (!isBrowser) return false;
    return window.innerWidth < 640 || 'ontouchstart' in window;
  },
});
