import { InjectionToken } from '@angular/core';

/**
 * Token for the document reference.
 */
export const NGXPRO_DOCUMENT = new InjectionToken<Document>('NGXPRO_DOCUMENT', {
  factory: () => document,
});

/**
 * Token for the window reference.
 */
export const NGXPRO_WINDOW = new InjectionToken<Window>('NGXPRO_WINDOW', {
  factory: () => window,
});

/**
 * Token for checking if code is running in a browser environment.
 */
export const NGXPRO_IS_BROWSER = new InjectionToken<boolean>('NGXPRO_IS_BROWSER', {
  factory: () => typeof window !== 'undefined' && typeof document !== 'undefined',
});
