import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { cx } from '../../../utils/cx';
import { NXP_ICON_OPTIONS, type NxpIconOptions } from './icon.options';
import { NXP_ICON_RESOLVER } from './icon-resolver.token';

/** Matches Remix Icon webfont class names (e.g. ri-home-line, ri-search-fill). */
const REMIX_ICON_CLASS = /^ri-[\w-]+$/;

/**
 * Icon component for rendering Remix Icons (or any SVG) inline.
 *
 * When `icon` is a Remix class name (e.g. `ri-search-line`), the icon is
 * rendered via the Remix webfont — ensure `remixicon/fonts/remixicon.css` is
 * loaded. Other names are resolved via `NXP_ICON_RESOLVER` (e.g. from
 * `nxpIconsProvider()`) or raw SVG strings are supported.
 *
 * @example
 * <!-- Remix webfont (real class name) -->
 * <nxp-icon icon="ri-search-line" />
 *
 * @example
 * <!-- With explicit size -->
 * <nxp-icon icon="ri-home-line" size="lg" />
 *
 * @example
 * <!-- With color via Tailwind class -->
 * <nxp-icon icon="ri-heart-line" class="text-red-500" />
 *
 * @example
 * <!-- Raw SVG bypass -->
 * <nxp-icon [icon]="'<svg ...>...</svg>'" />
 */
@Component({
  selector: 'nxp-icon',
  standalone: true,
  template: `
    @if (isRemixClass()) {
      <span [class]="remixSizeClasses()">
        <i [attr.class]="icon()" aria-hidden="true"></i>
      </span>
    } @else {
      <span [innerHTML]="svgContent()" [class]="sizeClasses()"></span>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
    'aria-hidden': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpIconComponent {
  /** Icon name: Remix class (e.g. `ri-search-line`) or raw SVG string. */
  readonly icon = input<string>('');

  /** Size override. Falls back to the injected options default. */
  readonly size = input<NxpIconOptions['size'] | undefined>(undefined);

  /** Additional CSS classes (merged via cx). */
  readonly class = input<string>('');

  private readonly resolver = inject(NXP_ICON_RESOLVER);
  private readonly options = inject(NXP_ICON_OPTIONS);
  private readonly sanitizer = inject(DomSanitizer);

  /** True when icon is a Remix webfont class (ri-*). */
  readonly isRemixClass = computed(() => {
    const name = this.icon()?.trim() ?? '';
    return name.length > 0 && REMIX_ICON_CLASS.test(name);
  });

  readonly svgContent = computed((): SafeHtml => {
    const name = this.icon();
    if (!name) return '';

    let raw: string | null;
    if (name.trimStart().startsWith('<')) {
      raw = name;
    } else {
      raw = this.resolver(name);
    }

    if (!raw) return '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });

  private readonly resolvedSize = computed(
    () => this.size() ?? this.options.size,
  );

  readonly sizeClasses = computed(() => {
    const sizeMap: Record<NxpIconOptions['size'], string> = {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
      '2xl': 'size-10',
    };
    return sizeMap[this.resolvedSize()];
  });

  /** Font-size classes for Remix webfont so the glyph scales with size. */
  readonly remixSizeClasses = computed(() => {
    const sizeMap: Record<NxpIconOptions['size'], string> = {
      xs: 'text-[0.75rem] leading-none',
      sm: 'text-[1rem] leading-none',
      md: 'text-[1.25rem] leading-none',
      lg: 'text-[1.5rem] leading-none',
      xl: 'text-[2rem] leading-none',
      '2xl': 'text-[2.5rem] leading-none',
    };
    return sizeMap[this.resolvedSize()];
  });

  readonly hostClasses = computed(() =>
    cx(
      'inline-flex items-center justify-center shrink-0 [&>span>svg]:size-full [&>span>svg]:block [&>span>i]:block',
      this.class(),
    ),
  );
}
