import {
  Directive,
  InjectionToken,
  computed,
  inject,
  input,
} from '@angular/core';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx } from '@nxp/cdk';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const linkVariants = tv({
  base: [
    'inline-flex items-center gap-1 font-medium transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      default:
        'text-gray-900 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300',
      muted:
        'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
      brand:
        'text-action hover:text-primary-pressed',
      danger:
        'text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'brand',
    size: 'md',
  },
});

export type LinkVariant = NonNullable<VariantProps<typeof linkVariants>['variant']>;
export type LinkSize = NonNullable<VariantProps<typeof linkVariants>['size']>;

// ---------------------------------------------------------------------------
// Options token
// ---------------------------------------------------------------------------

export interface NxpLinkOptions {
  variant: LinkVariant;
  underline: boolean;
}

export const NXP_LINK_OPTIONS = new InjectionToken<NxpLinkOptions>(
  'NXP_LINK_OPTIONS',
  {
    factory: () => ({ variant: 'brand', underline: true }),
  },
);

export function nxpLinkOptionsProvider(options: Partial<NxpLinkOptions>) {
  return {
    provide: NXP_LINK_OPTIONS,
    useValue: { variant: 'brand', underline: true, ...options } satisfies NxpLinkOptions,
  };
}

// ---------------------------------------------------------------------------
// Directive
// ---------------------------------------------------------------------------

/**
 * Link directive for `<a>` and `<button>` elements.
 *
 * Applies Tailwind-based link styling via `tv()` variants. Supports four
 * color variants, three size variants, and optional underline decoration.
 * Defaults are driven by `NXP_LINK_OPTIONS` so they can be overridden at
 * the module / component level.
 *
 * @example
 * <!-- Basic anchor -->
 * <a href="/about" nxpLink>About</a>
 *
 * @example
 * <!-- Muted, small, no underline -->
 * <a href="#" nxpLink variant="muted" size="sm" [underline]="false">Terms</a>
 *
 * @example
 * <!-- Danger link as button -->
 * <button nxpLink variant="danger">Delete account</button>
 *
 * @example
 * <!-- Override default variant for a subtree -->
 * providers: [nxpLinkOptionsProvider({ variant: 'default', underline: false })]
 */
@Directive({
  selector: 'a[nxpLink], button[nxpLink]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NxpLinkDirective {
  private readonly options = inject(NXP_LINK_OPTIONS);

  /** Visual color variant. */
  readonly variant = input<LinkVariant>(this.options.variant);

  /** Text size variant. */
  readonly size = input<LinkSize>('md');

  /** Whether to show underline decoration. */
  readonly underline = input<boolean>(this.options.underline);

  /** Additional CSS classes (merged via cx). */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => {
    const base = linkVariants({ variant: this.variant(), size: this.size() });
    return cx(base, this.underline() && 'underline underline-offset-4', this.class());
  });
}
