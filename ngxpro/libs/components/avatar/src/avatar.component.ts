import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { tv, type VariantProps } from 'tailwind-variants';
import { cx } from '@nxp/cdk';
import { nxpInitials } from './initials.pipe';
import { NXP_AVATAR_OPTIONS } from './avatar.options';

const avatarVariants = tv({
  slots: {
    base: [
      'relative inline-flex items-center justify-center overflow-hidden',
      'font-medium uppercase text-white select-none',
      'transition-all duration-150',
    ],
    image: 'h-full w-full object-cover',
    fallback: 'flex h-full w-full items-center justify-center',
    badge:
      'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-950',
  },
  variants: {
    size: {
      xs: { base: 'h-6 w-6 text-xs', badge: 'h-1.5 w-1.5' },
      s: { base: 'h-8 w-8 text-xs', badge: 'h-2 w-2' },
      m: { base: 'h-10 w-10 text-sm', badge: 'h-2.5 w-2.5' },
      l: { base: 'h-12 w-12 text-base', badge: 'h-3 w-3' },
      xl: { base: 'h-16 w-16 text-lg', badge: 'h-3.5 w-3.5' },
    },
    round: {
      true: { base: 'rounded-full' },
      false: { base: 'rounded-lg' },
    },
    appearance: {
      primary: { base: 'bg-[var(--nxp-primary,#3b82f6)]' },
      negative: { base: 'bg-red-500 dark:bg-red-600' },
      neutral: { base: 'bg-gray-500 dark:bg-gray-600' },
    },
  },
  defaultVariants: {
    size: 'm',
    round: true,
    appearance: 'primary',
  },
});

export type AvatarSize = NonNullable<
  VariantProps<typeof avatarVariants>['size']
>;
export type AvatarAppearance = NonNullable<
  VariantProps<typeof avatarVariants>['appearance']
>;

@Component({
  selector: 'nxp-avatar',
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
      <span [class]="badgeClasses()"></span>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  private readonly options = inject(NXP_AVATAR_OPTIONS);

  readonly src = input<string>('');
  readonly alt = input<string>('Avatar');
  readonly size = input<AvatarSize>(this.options.size);
  readonly round = input<boolean>(this.options.round);
  readonly appearance = input<AvatarAppearance>(this.options.appearance);
  readonly badge = input<string>('');
  readonly class = input<string>('');

  readonly fallback = signal(false);

  readonly initials = computed(() => nxpInitials(this.alt()));

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
  readonly badgeClasses = computed(() =>
    cx(this.variants().badge(), this.badge()),
  );

  handleImageError(): void {
    this.fallback.set(true);
  }

  handleImageLoad(): void {
    this.fallback.set(false);
  }
}

export { avatarVariants };
