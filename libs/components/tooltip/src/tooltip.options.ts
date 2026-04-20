import { nxpCreateOptions } from '@nxp/cdk';

export interface NxpTooltipOptions {
  /** Icon shown on the trigger icon directive (raw SVG or icon name). */
  readonly icon: string;
  /** Visual style of the tooltip panel. */
  readonly appearance: 'dark' | 'light' | string;
  /** Preferred opening direction. */
  readonly direction: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along the cross-axis. */
  readonly align: 'start' | 'center' | 'end';
  /** Delay in ms before the tooltip appears. */
  readonly showDelay: number;
  /** Delay in ms before the tooltip hides. */
  readonly hideDelay: number;
  /** Gap in px between the tooltip panel and the host element. */
  readonly offset: number;
}

export const [NXP_TOOLTIP_OPTIONS, nxpTooltipOptionsProvider] =
  nxpCreateOptions<NxpTooltipOptions>({
    icon: '',
    appearance: 'dark',
    direction: 'top',
    align: 'center',
    showDelay: 300,
    hideDelay: 100,
    offset: 8,
  });
