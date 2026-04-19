import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx } from '@nxp/cdk';

const buttonVariants = tv({
  slots: {
    base: [
      // base
      'group relative inline-flex items-center justify-center whitespace-nowrap font-medium cursor-pointer',
      // transition — snappy 80ms matching fluidfunctionalizm
      'transition-all duration-[80ms]',
      // focus
      'outline-none focus-visible:ring-1 focus-visible:ring-[#6B97FF]',
      // disabled
      'disabled:pointer-events-none disabled:opacity-50',
    ],
    icon: [
      'shrink-0',
      // stroke-width animation: 1.5 → 2 on hover
      '[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-[80ms] group-hover:[&_svg]:stroke-[2]',
    ],
    spinner: ['shrink-0'],
    content: [''],
  },
  variants: {
    variant: {
      primary: {
        base: [
          'bg-primary text-text-on-accent',
          'hover:bg-primary-hover',
          'active:bg-primary-pressed',
        ],
      },
      secondary: {
        base: [
          'bg-secondary text-text-primary',
          'hover:bg-secondary-hover',
          'active:bg-secondary-pressed',
        ],
      },
      tertiary: {
        base: [
          'border border-border-normal bg-transparent text-text-primary',
          'hover:bg-bg-neutral-1 hover:border-border-hover',
          'active:bg-bg-neutral-2',
        ],
      },
      ghost: {
        base: [
          'bg-transparent text-text-secondary',
          'hover:bg-bg-neutral-1 hover:text-text-primary',
          'active:bg-muted/60',
        ],
      },
      destructive: {
        base: [
          'bg-status-negative text-white',
          'hover:bg-status-negative/90',
          'active:bg-status-negative/80',
        ],
      },
    },
    size: {
      sm: {
        base: 'h-7 px-3 text-[12px] gap-1 rounded-md',
        icon: 'size-3.5',
        spinner: 'size-3.5',
      },
      md: {
        base: 'h-8 px-4 text-[13px] gap-1.5 rounded-md',
        icon: 'size-4',
        spinner: 'size-4',
      },
      lg: {
        base: 'h-9 px-5 text-[14px] gap-1.5 rounded-md',
        icon: 'size-4',
        spinner: 'size-4',
      },
      'icon-sm': {
        base: 'size-8 p-0 rounded-md',
        icon: 'size-3.5',
        spinner: 'size-3.5',
      },
      icon: {
        base: 'size-9 p-0 rounded-md',
        icon: 'size-4',
        spinner: 'size-4',
      },
      'icon-lg': {
        base: 'size-10 p-0 rounded-md',
        icon: 'size-5',
        spinner: 'size-5',
      },
    },
    iconLeft: {
      true: '',
    },
    iconRight: {
      true: '',
    },
  },
  compoundVariants: [
    // Reduced padding when leading icon is present
    { size: 'sm', iconLeft: true, class: { base: 'pl-[6px]' } },
    { size: 'md', iconLeft: true, class: { base: 'pl-[10px]' } },
    { size: 'lg', iconLeft: true, class: { base: 'pl-[14px]' } },
    // Reduced padding when trailing icon is present
    { size: 'sm', iconRight: true, class: { base: 'pr-[6px]' } },
    { size: 'md', iconRight: true, class: { base: 'pr-[10px]' } },
    { size: 'lg', iconRight: true, class: { base: 'pr-[14px]' } },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>['size']
>;

@Component({
  selector: 'nxp-button, nxp-a-button, button[nxpButton], a[nxpButton]',
  standalone: true,
  template: `
    @if (loading()) {
      <!-- Invisible content preserves layout dimensions -->
      <span class="flex items-center justify-center gap-[inherit] opacity-0">
        @if (iconStart() && !isIconOnly()) {
          <span [class]="iconClasses()" [innerHTML]="iconStart()"></span>
        }
        <ng-content />
        @if (iconEnd() && !isIconOnly()) {
          <span [class]="iconClasses()" [innerHTML]="iconEnd()"></span>
        }
      </span>
      <!-- Figure-8 spinner overlay -->
      <span class="absolute inset-0 flex items-center justify-center">
        <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
            stroke="currentColor"
            stroke-width="1.125"
            stroke-linecap="round"
            pathLength="100"
            style="stroke-dasharray: 15 85; animation: nxp-spinner-move 2s linear infinite, nxp-spinner-dash 4s ease-in-out infinite"
          />
        </svg>
      </span>
    } @else {
      @if (iconStart() && !isIconOnly()) {
        <span [class]="iconClasses()" [innerHTML]="iconStart()"></span>
      }

      @if (isIconOnly()) {
        <span
          class="[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-[80ms] group-hover:[&_svg]:stroke-[2]"
        >
          <ng-content />
        </span>
      } @else {
        <span>
          <ng-content />
        </span>
      }

      @if (iconEnd() && !isIconOnly()) {
        <span [class]="iconClasses()" [innerHTML]="iconEnd()"></span>
      }
    }
  `,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'loading() ? true : null',
    '[attr.aria-busy]': 'loading() ? true : null',
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

  readonly isIconOnly = computed(() => {
    const s = this.size();
    return s === 'icon' || s === 'icon-sm' || s === 'icon-lg';
  });

  private readonly variants = computed(() =>
    buttonVariants({
      variant: this.variant(),
      size: this.size(),
      iconLeft: !this.isIconOnly() && !!this.iconStart(),
      iconRight: !this.isIconOnly() && !!this.iconEnd(),
    }),
  );

  readonly hostClasses = computed(() =>
    cx(this.variants().base(), this.class()),
  );

  readonly iconClasses = computed(() => this.variants().icon());

  readonly spinnerClasses = computed(() => this.variants().spinner());
}

export { buttonVariants };
