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

/**
 * A predicate function for a given type.
 * Equivalent to Taiga UI's `TuiBooleanHandler<T>`.
 *
 * @example
 * const isWeekend: BooleanHandler<Date> = (d) => d.getDay() === 0 || d.getDay() === 6;
 */
export type BooleanHandler<T> = (item: T) => boolean;

/**
 * A pure mapping function from input(s) to an output type.
 * Equivalent to Taiga UI's `TuiMapper<TArgs, TResult>`.
 *
 * @example
 * const toLabel: Mapper<[Date], string> = (d) => d.toLocaleDateString();
 */
export type Mapper<TArgs extends readonly unknown[], TResult> = (
  ...args: TArgs
) => TResult;

/**
 * A boolean predicate handler for a given value type.
 */
export type NxpBooleanHandler<T> = (value: T) => boolean;

/**
 * A generic implicit context object (used with *ngTemplateOutlet).
 */
export type NxpContext<T> = { readonly $implicit: T };

/**
 * A 2D point represented as [x, y] tuple.
 */
export type NxpPoint = [x: number, y: number];

/**
 * Vertical direction for dropdowns and overlays.
 */
export type NxpVerticalDirection = 'bottom' | 'top';
