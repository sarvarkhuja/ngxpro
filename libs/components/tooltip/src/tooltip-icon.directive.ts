import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NxpTooltipDirective } from './tooltip.directive';
import { NXP_TOOLTIP_OPTIONS } from './tooltip.options';

/**
 * Convenience component that renders a small icon and applies the tooltip
 * directive to itself. Mirrors Taiga UI's `tui-icon[tuiTooltip]` pattern.
 *
 * The icon is taken from `NXP_TOOLTIP_OPTIONS.icon`. Override per-usage via
 * the `nxpTooltip*` inputs inherited from `NxpTooltipDirective`.
 *
 * @example
 * <nxp-tooltip-icon [nxpTooltip]="'More info'" />
 *
 * @example
 * <nxp-tooltip-icon [nxpTooltip]="'Help'" nxpTooltipDirection="right" />
 */
@Component({
  selector: 'nxp-tooltip-icon',
  standalone: true,
  hostDirectives: [
    {
      directive: NxpTooltipDirective,
      inputs: [
        'nxpTooltip',
        'nxpTooltipDirection',
        'nxpTooltipAlign',
        'nxpTooltipAppearance',
        'nxpTooltipShowDelay',
        'nxpTooltipHideDelay',
        'nxpTooltipSize',
        'nxpTooltipDisabled',
        'nxpTooltipDescribe',
      ],
    },
  ],
  template: `
    @if (iconIsRaw()) {
      <span
        class="inline-flex items-center justify-center"
        [innerHTML]="icon()"
        aria-hidden="true"
      ></span>
    } @else {
      <i
        [class]="iconClass()"
        class="inline-flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-hidden="true"
      ></i>
    }
  `,
  host: {
    class:
      'inline-flex items-center justify-center w-4 h-4 cursor-help shrink-0',
    role: 'img',
    'aria-label': 'Help',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTooltipIconComponent {
  private readonly options = inject(NXP_TOOLTIP_OPTIONS);

  protected readonly icon = computed(() => this.options.icon);
  protected readonly iconIsRaw = computed(() =>
    this.options.icon.startsWith('<'),
  );
  protected readonly iconClass = computed(
    () => this.options.icon || 'ri-information-line',
  );
}
