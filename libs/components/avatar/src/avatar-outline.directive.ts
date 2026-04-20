import { computed, Directive, input } from '@angular/core';

/**
 * Adds a colored ring/outline around an avatar via box-shadow.
 *
 * @example
 * <nxp-avatar alt="John Doe" nxpAvatarOutline="#3b82f6" />
 *
 * @example
 * <!-- Dynamic color from data -->
 * <nxp-avatar alt="Jane Smith" [nxpAvatarOutline]="user.color" />
 */
@Directive({
  selector: '[nxpAvatarOutline]',
  host: {
    '[style.box-shadow]': 'outlineShadow()',
  },
})
export class AvatarOutlineDirective {
  /**
   * Color for the outline ring. Accepts any valid CSS color value.
   * Defaults to blue-500 (`rgb(59 130 246)`) when empty.
   */
  readonly nxpAvatarOutline = input<string>('');

  readonly outlineShadow = computed(() => {
    const color = this.nxpAvatarOutline() || 'rgb(59 130 246)';
    return `0 0 0 2px white, 0 0 0 4px ${color}`;
  });
}
