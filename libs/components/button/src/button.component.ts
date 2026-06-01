import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx } from '@ngxpro/cdk';

/**
 * Button — Vercel/Geist aligned.
 * - Weight 500 (UI/interactive) per the three-weight system
 * - Radius 6px (rounded-m), never pill (pill is for badges/tags)
 * - Tertiary uses shadow-as-border instead of CSS border
 * - Focus ring: 2px Vercel blue, offset 2 (focusRing pattern)
 * - Tracking: normal at 14px and below, per the design system principle
 *   "tracking progressively relaxes as size decreases ... normal at 14px"
 */
const buttonVariants = tv({
  slots: {
    base: [
      'group relative inline-flex items-center justify-center whitespace-nowrap font-medium cursor-pointer',
      'transition-[background-color,color,box-shadow,transform,opacity] duration-fast ease-out',
      'active:scale-[0.98]',
      'outline-none outline-offset-2',
      'focus-visible:outline-2 focus-visible:outline-border-focus',
      'disabled:pointer-events-none disabled:opacity-50',
    ],
    icon: [
      'shrink-0',
      '[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-fast group-hover:[&_svg]:stroke-[2]',
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
          'shadow-border',
          'hover:bg-secondary-hover',
          'active:bg-secondary-pressed',
        ],
      },
      tertiary: {
        base: [
          'bg-bg-base text-text-primary',
          'shadow-border-light',
          'hover:bg-bg-neutral-1',
          'active:bg-bg-neutral-2',
        ],
      },
      ghost: {
        base: [
          'bg-transparent text-text-secondary',
          'hover:bg-bg-neutral-1 hover:text-text-primary',
          'active:bg-bg-neutral-2',
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
        base: 'h-7 px-3 text-[12px] gap-1 rounded-m',
        icon: 'size-3.5',
        spinner: 'size-3.5',
      },
      md: {
        base: 'h-8 px-3.5 text-[13px] gap-1.5 rounded-m',
        icon: 'size-4',
        spinner: 'size-4',
      },
      lg: {
        base: 'h-10 px-4 text-[14px] gap-2 rounded-m',
        icon: 'size-4',
        spinner: 'size-4',
      },
      'icon-sm': {
        base: 'size-7 p-0 rounded-m',
        icon: 'size-3.5',
        spinner: 'size-3.5',
      },
      icon: {
        base: 'size-8 p-0 rounded-m',
        icon: 'size-4',
        spinner: 'size-4',
      },
      'icon-lg': {
        base: 'size-10 p-0 rounded-m',
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
    { size: 'md', iconLeft: true, class: { base: 'pl-[8px]' } },
    { size: 'lg', iconLeft: true, class: { base: 'pl-[10px]' } },
    // Reduced padding when trailing icon is present
    { size: 'sm', iconRight: true, class: { base: 'pr-[6px]' } },
    { size: 'md', iconRight: true, class: { base: 'pr-[8px]' } },
    { size: 'lg', iconRight: true, class: { base: 'pr-[10px]' } },
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
  template: `
    <!--
      A single <ng-content/> is mandatory: Angular routes default-slot
      projection to the LAST catch-all <ng-content>, so duplicating it across
      @if branches drops the content whenever the "losing" branch is active
      (e.g. icon-only buttons). The content row stays mounted while loading —
      hidden under the spinner — which preserves the button width for free.
    -->
    @if (iconStart() && !isIconOnly()) {
      <span
        [class]="iconClasses()"
        [innerHTML]="iconStartHtml()"
        [style.opacity]="loading() ? 0 : null"
      ></span>
    }

    <span [class]="contentClasses()" [style.opacity]="loading() ? 0 : null">
      <ng-content />
    </span>

    @if (iconEnd() && !isIconOnly()) {
      <span
        [class]="iconClasses()"
        [innerHTML]="iconEndHtml()"
        [style.opacity]="loading() ? 0 : null"
      ></span>
    }

    @if (loading()) {
      <!-- Figure-8 spinner overlay -->
      <span class="absolute inset-0 flex items-center justify-center">
        <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
            stroke="currentColor"
            stroke-width="1.125"
            stroke-linecap="round"
            pathLength="100"
            style="stroke-dasharray: 15 85; animation: nxp-spinner-move 2s linear infinite, nxp-spinner-dash 4s linear infinite"
          />
        </svg>
      </span>
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

  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Icon markup trusted for `[innerHTML]`. Inline SVG passed to `iconStart` /
   * `iconEnd` would otherwise be stripped by Angular's HTML sanitizer (SVG
   * elements are not in the HTML allowlist), leaving the slot empty — so we
   * bypass it here, mirroring how `NxpIconComponent` renders raw SVG.
   */
  protected readonly iconStartHtml = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.iconStart()),
  );

  protected readonly iconEndHtml = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.iconEnd()),
  );

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

  /**
   * Classes for the single projected-content span. Icon-only buttons animate a
   * projected SVG's stroke on hover (1.5 → 2); text buttons need no extra class.
   */
  protected readonly contentClasses = computed(() =>
    this.isIconOnly()
      ? '[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-fast group-hover:[&_svg]:stroke-[2]'
      : '',
  );
}

export { buttonVariants };
