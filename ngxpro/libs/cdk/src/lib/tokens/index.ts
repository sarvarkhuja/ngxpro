import { InjectionToken } from '@angular/core';

/**
 * Token for the document reference.
 */
export const NXP_DOCUMENT = new InjectionToken<Document>('NXP_DOCUMENT', {
  factory: () => document,
});

/**
 * Token for the window reference.
 */
export const NXP_WINDOW = new InjectionToken<Window>('NXP_WINDOW', {
  factory: () => window,
});

/**
 * Token for checking if code is running in a browser environment.
 */
export const NXP_IS_BROWSER = new InjectionToken<boolean>('NXP_IS_BROWSER', {
  factory: () =>
    typeof window !== 'undefined' && typeof document !== 'undefined',
});
