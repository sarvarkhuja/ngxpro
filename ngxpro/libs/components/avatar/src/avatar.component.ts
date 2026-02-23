import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx } from '@nxp/cdk';

const avatarVariants = tv({
  slots: {
    base: [
      // base
      'relative inline-flex items-center justify-center overflow-hidden',
      // text
      'font-medium uppercase text-white select-none',
      // transition
      'transition-all duration-150',
    ],
    image: ['h-full w-full object-cover'],
    fallback: [
      'flex h-full w-full min-h-0 min-w-0 items-center justify-center',
      // fallback must have its own background so initials are visible (Taiga: host has background, removed when img present)
      'font-medium uppercase text-white select-none',
    ],
    badge: [
      'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-950',
    ],
  },
  variants: {
    size: {
      xs: {
        base: 'h-6 w-6 text-xs',
        fallback: 'text-xs',
        badge: 'h-1.5 w-1.5',
      },
      s: {
        base: 'h-8 w-8 text-xs',
        fallback: 'text-xs',
        badge: 'h-2 w-2',
      },
      m: {
        base: 'h-10 w-10 text-sm',
        fallback: 'text-sm',
        badge: 'h-2.5 w-2.5',
      },
      l: {
        base: 'h-12 w-12 text-base',
        fallback: 'text-base',
        badge: 'h-3 w-3',
      },
      xl: {
        base: 'h-16 w-16 text-lg',
        fallback: 'text-lg',
        badge: 'h-3.5 w-3.5',
      },
    },
    round: {
      true: {
        base: 'rounded-full',
        fallback: 'rounded-full',
      },
      false: {
        base: 'rounded-lg',
        fallback: 'rounded-lg',
      },
    },
    appearance: {
      primary: {
        base: 'bg-blue-500 dark:bg-blue-600',
        fallback: 'bg-blue-500 dark:bg-blue-600',
      },
      negative: {
        base: 'bg-red-500 dark:bg-red-600',
        fallback: 'bg-red-500 dark:bg-red-600',
      },
      neutral: {
        base: 'bg-gray-500 dark:bg-gray-600',
        fallback: 'bg-gray-500 dark:bg-gray-600',
      },
      '': {
        base: 'bg-blue-500 dark:bg-blue-600',
        fallback: 'bg-blue-500 dark:bg-blue-600',
      },
    },
  },
  defaultVariants: {
    size: 'm',
    round: true,
    appearance: '',
  },
});

export type AvatarSize = NonNullable<
  VariantProps<typeof avatarVariants>['size']
>;
export type AvatarAppearance = 'primary' | 'negative' | 'neutral' | '';

/**
 * Avatar component for displaying user images or initials (Taiga architecture + Tremor styling).
 *
 * Features:
 * - Image display with automatic fallback to initials
 * - Multiple size variants (xs, s, m, l, xl)
 * - Round or square shapes
 * - Appearance variants (primary, negative, neutral)
 * - Optional badge indicator
 * - Dark mode support
 *
 * @example
 * <!-- Basic usage with image -->
 * <nxp-avatar src="/path/to/image.jpg" alt="John Doe" />
 *
 * @example
 * <!-- With initials fallback -->
 * <nxp-avatar alt="John Doe" />
 *
 * @example
 * <!-- With size and appearance -->
 * <nxp-avatar
 *   src="/path/to/image.jpg"
 *   alt="Jane Smith"
 *   size="xl"
 *   appearance="negative"
 *   [round]="false"
 * />
 *
 * @example
 * <!-- With badge indicator -->
 * <nxp-avatar
 *   src="/path/to/image.jpg"
 *   alt="Alice Johnson"
 *   badge="bg-green-500"
 * />
 */
@Component({
  selector: 'nxp-avatar',
  imports: [NgClass],
  template: `
    @if (src() && !fallback()) {
      <img
        [src]="src()"
        [alt]="alt()"
        [class]="imageClasses()"
        (error)="handleImageError()"
        (load)="handleImageLoad()"
      />
    }
    @if (!src() || fallback()) {
      <div [class]="fallbackClasses()">
        {{ initials() }}
      </div>
    }
    @if (badge()) {
      <span [class]="badgeClasses()" [ngClass]="badge()"></span>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  /** Image source URL. */
  readonly src = input<string>('');

  /** Alt text for the image. */
  readonly alt = input<string>('Avatar');

  /** Size of the avatar. */
  readonly size = input<AvatarSize>('m');

  /** Whether the avatar should be circular. */
  readonly round = input<boolean>(true);

  /** Visual appearance variant. */
  readonly appearance = input<AvatarAppearance>('');

  /** Badge indicator CSS classes (e.g., 'bg-green-500'). */
  readonly badge = input<string>('');

  /** Additional CSS classes for the container. */
  readonly class = input<string>('');

  /** Signal to track image load failure. */
  readonly fallback = signal(false);

  /** Computed initials from alt text. */
  readonly initials = computed(() => {
    const name = this.alt();
    if (!name) return '?';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  private readonly variants = computed(() =>
    avatarVariants({
      size: this.size(),
      round: this.round(),
      appearance: this.appearance(),
    }),
  );

  readonly hostClasses = computed(() =>
    cx(this.variants().base(), this.class()),
  );

  readonly imageClasses = computed(() => this.variants().image());

  readonly fallbackClasses = computed(() => this.variants().fallback());

  readonly badgeClasses = computed(() => this.variants().badge());

  handleImageError(): void {
    this.fallback.set(true);
  }

  handleImageLoad(): void {
    this.fallback.set(false);
  }
}

export { avatarVariants };
