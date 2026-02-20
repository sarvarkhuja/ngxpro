import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx } from '@ngxpro/cdk';

const buttonVariants = tv({
  slots: {
    base: [
      // base
      'relative inline-flex items-center justify-center whitespace-nowrap rounded-md border font-medium',
      // transition
      'transition-colors duration-150',
      // focus
      'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
      // disabled
      'disabled:pointer-events-none disabled:opacity-50',
    ],
    icon: [
      'shrink-0',
    ],
    spinner: [
      'animate-spin shrink-0',
    ],
  },
  variants: {
    variant: {
      primary: {
        base: [
          'border-transparent',
          'bg-blue-500 text-white',
          'hover:bg-blue-600 dark:hover:bg-blue-400',
          'dark:bg-blue-500 dark:text-white',
        ],
      },
      secondary: {
        base: [
          'border-gray-300 dark:border-gray-700',
          'bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50',
          'hover:bg-gray-50 dark:hover:bg-gray-900',
        ],
      },
      outline: {
        base: [
          'border-gray-300 dark:border-gray-700',
          'bg-transparent text-gray-900 dark:text-gray-50',
          'hover:bg-gray-50 dark:hover:bg-gray-900',
        ],
      },
      ghost: {
        base: [
          'border-transparent',
          'text-gray-900 dark:text-gray-50',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ],
      },
      destructive: {
        base: [
          'border-transparent',
          'bg-red-600 text-white',
          'hover:bg-red-700 dark:hover:bg-red-500',
        ],
      },
    },
    size: {
      xs: {
        base: 'h-6 px-2 text-xs gap-1',
        icon: 'h-3 w-3',
        spinner: 'h-3 w-3',
      },
      sm: {
        base: 'h-8 px-3 text-sm gap-1.5',
        icon: 'h-4 w-4',
        spinner: 'h-4 w-4',
      },
      md: {
        base: 'h-10 px-4 text-sm gap-2',
        icon: 'h-4 w-4',
        spinner: 'h-4 w-4',
      },
      lg: {
        base: 'h-12 px-6 text-base gap-2',
        icon: 'h-5 w-5',
        spinner: 'h-5 w-5',
      },
      xl: {
        base: 'h-14 px-8 text-base gap-2.5',
        icon: 'h-6 w-6',
        spinner: 'h-6 w-6',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

/**
 * Button component with variants, icons, and loading state (Taiga architecture + Tremor styling).
 *
 * Features:
 * - Multiple visual variants (primary, secondary, outline, ghost, destructive)
 * - Size variants (xs, sm, md, lg, xl)
 * - Leading and trailing icons
 * - Loading state with spinner
 * - Dark mode support
 * - Full accessibility support
 *
 * @example
 * <!-- Basic usage -->
 * <button ngxproButton>Primary</button>
 *
 * @example
 * <!-- With variant and size -->
 * <button ngxproButton variant="secondary" size="sm">Secondary</button>
 *
 * @example
 * <!-- With icons -->
 * <button ngxproButton iconStart="plus">Add Item</button>
 * <button ngxproButton iconEnd="arrow-right">Next</button>
 *
 * @example
 * <!-- Loading state -->
 * <button ngxproButton [loading]="isLoading">Submit</button>
 *
 * @example
 * <!-- Destructive action -->
 * <button ngxproButton variant="destructive" iconStart="trash">Delete</button>
 */
@Component({
  selector: 'button[ngxproButton], a[ngxproButton]',
  standalone: true,
  template: `
    <!-- Loading spinner (replaces iconStart when loading) -->
    @if (loading()) {
      <svg
        [class]="spinnerClasses()"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    }

    <!-- Icon start (hidden when loading) -->
    @if (iconStart() && !loading()) {
      <span
        [class]="iconClasses()"
        [innerHTML]="iconStart()"
      ></span>
    }

    <!-- Button content -->
    <ng-content />

    <!-- Icon end -->
    @if (iconEnd()) {
      <span
        [class]="iconClasses()"
        [innerHTML]="iconEnd()"
      ></span>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'loading() ? true : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /** Visual variant. */
  readonly variant = input<ButtonVariant>('primary');

  /** Size of the button. */
  readonly size = input<ButtonSize>('md');

  /** Icon to display at the start of the button (HTML string or icon name). */
  readonly iconStart = input<string>('');

  /** Icon to display at the end of the button (HTML string or icon name). */
  readonly iconEnd = input<string>('');

  /** Whether the button is in a loading state. */
  readonly loading = input<boolean>(false);

  /** Additional CSS classes. */
  readonly class = input<string>('');

  private readonly variants = computed(() =>
    buttonVariants({ variant: this.variant(), size: this.size() })
  );

  readonly hostClasses = computed(() =>
    cx(this.variants().base(), this.class())
  );

  readonly iconClasses = computed(() => this.variants().icon());

  readonly spinnerClasses = computed(() => this.variants().spinner());
}

export { buttonVariants };
