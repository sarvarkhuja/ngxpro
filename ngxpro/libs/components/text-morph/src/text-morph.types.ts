export interface NgxproTextMorphOptions {
  /** Animation duration in milliseconds. */
  duration: number;
  /** CSS easing function. */
  ease: string;
  /** Intl locale for text segmentation. */
  locale: Intl.LocalesArgument;
  /** Whether to apply scale transform during enter/exit animations. */
  scale: boolean;
  /** Whether animations are disabled. */
  disabled: boolean;
  /** Whether to respect prefers-reduced-motion. */
  respectReducedMotion: boolean;
  /** Whether to enable debug mode with visual outlines. */
  debug: boolean;
}

export const NXP_TEXT_MORPH_DEFAULT_OPTIONS: NgxproTextMorphOptions = {
  duration: 400,
  ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
  locale: 'en',
  scale: true,
  disabled: false,
  respectReducedMotion: true,
  debug: false,
};

export type TextMorphBlock = {
  id: string;
  text: string;
};

export type TextMorphMeasures = Record<string, { x: number; y: number }>;
