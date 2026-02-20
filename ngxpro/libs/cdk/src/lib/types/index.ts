/**
 * Size scale used across components.
 */
export type NgxproSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Status variants for feedback components.
 */
export type NgxproStatus = 'info' | 'success' | 'warning' | 'error';

/**
 * Appearance variants.
 */
export type NgxproAppearance = 'primary' | 'secondary' | 'ghost' | 'destructive';

/**
 * Generic handler for polymorphic content.
 * Accepts a string, a function returning a string, or undefined.
 */
export type NgxproStringHandler<T> = string | ((context: T) => string);

/**
 * Makes specified keys of T required.
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
