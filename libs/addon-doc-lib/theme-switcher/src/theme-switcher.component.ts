import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { cx } from '@ngxpro/cdk';
import { NxpSwitchComponent } from '@ngxpro/components/switch';
import { ThemeService } from '@ngxpro/core';

/**
 * Header-mounted dark/light toggle backed by `ThemeService`. Replaces Taiga's
 * `<tui-doc-theme-switcher>` which selected between named themes via local
 * storage; ngxpro's theme story is binary (light vs dark) so this is a
 * single switch.
 *
 * Renders a small label + `<nxp-switch>`. The label can be projected as
 * `<ng-content>` for custom copy.
 *
 * @example
 * <nxp-doc-theme-switcher>Theme</nxp-doc-theme-switcher>
 *
 * @example
 * <nxp-doc-theme-switcher labelClass="text-text-secondary">
 *   Dark mode
 * </nxp-doc-theme-switcher>
 */
@Component({
  selector: 'nxp-doc-theme-switcher',
  imports: [NxpSwitchComponent],
  template: `
    <span [class]="labelClasses()">
      <ng-content />
    </span>
    <nxp-switch
      size="s"
      [checked]="theme.isDark()"
      (checkedChange)="onCheckedChange($event)"
    />
  `,
  host: {
    class: 'inline-flex items-center gap-2 select-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocThemeSwitcherComponent {
  /** Optional Tailwind classes layered onto the label slot. */
  readonly labelClass = input<string>('');

  protected readonly theme = inject(ThemeService);

  protected readonly labelClasses = computed(() =>
    cx('text-sm text-text-primary', this.labelClass()),
  );

  protected onCheckedChange(next: boolean): void {
    if (next === this.theme.isDark()) return;
    this.theme.setTheme(next ? 'dark' : 'light');
  }
}
