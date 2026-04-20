import { nxpCreateOptions } from '@nxp/cdk';

export const NXP_BADGE_COLORS = {
  gray: '#a3a3a3',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
} as const;

export type NxpBadgeColor = keyof typeof NXP_BADGE_COLORS;
export type NxpBadgeVariant = 'solid' | 'dot';
export type NxpBadgeSize = 'sm' | 'md' | 'lg';

export interface NxpBadgeOptions {
  readonly variant: NxpBadgeVariant;
  readonly size: NxpBadgeSize;
  readonly color: NxpBadgeColor;
}

export const [NXP_BADGE_OPTIONS, nxpBadgeOptionsProvider] =
  nxpCreateOptions<NxpBadgeOptions>({ variant: 'solid', size: 'md', color: 'gray' });
