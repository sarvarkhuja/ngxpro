import {
  Directive,
  ElementRef,
  DestroyRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import { NXP_IS_BROWSER } from '@nxp/cdk';
import { NXP_TEXT_MORPH_OPTIONS } from './text-morph.options';
import type { TextMorphBlock, TextMorphMeasures } from './text-morph.types';

const ATTR_ROOT = 'torph-root';
const ATTR_ITEM = 'torph-item';
const ATTR_ID = 'torph-id';
const ATTR_EXITING = 'torph-exiting';
const ATTR_DEBUG = 'torph-debug';

let sharedStyleEl: HTMLStyleElement | null = null;
let sharedStyleRefCount = 0;

@Directive({
  selector: '[nxpTextMorph]',
})
export class TextMorphDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly defaults = inject(NXP_TEXT_MORPH_OPTIONS);
  private readonly destroyRef = inject(DestroyRef);

  /** The text value to display and animate to. */
  readonly text = input.required<string>();

  /** Animation duration in ms. */
  readonly duration = input<number | undefined>(undefined);

  /** CSS easing function. */
  readonly ease = input<string | undefined>(undefined);

  /** Intl locale for text segmentation. */
  readonly locale = input<Intl.LocalesArgument | undefined>(undefined);

  /** Whether to apply scale transform during animations. */
  readonly scale = input<boolean | undefined>(undefined);

  /** Whether animations are disabled. */
  readonly disabled = input<boolean | undefined>(undefined);

  /** Whether to respect prefers-reduced-motion. */
  readonly respectReducedMotion = input<boolean | undefined>(undefined);

  /** Whether to show debug outlines. */
  readonly debug = input<boolean | undefined>(undefined);

  /** Emitted when a text morph animation starts. */
  readonly animationStart = output<void>();

  /** Emitted when a text morph animation completes. */
  readonly animationComplete = output<void>();

  private currentData = '';
  private currentMeasures: TextMorphMeasures = {};
  private prevMeasures: TextMorphMeasures = {};
  private isInitialRender = true;
  private prefersReducedMotion = false;
  private mediaQuery: MediaQueryList | null = null;
  private initialized = false;
  private pendingTimeout: ReturnType<typeof setTimeout> | null = null;
  private transitionEndCleanup: (() => void) | null = null;

  private readonly handleMediaQueryChange = (event: MediaQueryListEvent) => {
    this.prefersReducedMotion = event.matches;
  };

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;

      this.setupReducedMotion();

      if (!this.isAnimationDisabled()) {
        this.addStyles();
        this.setupHostElement();
      }

      this.initialized = true;
      this.updateText(untracked(() => this.text()));
    });

    effect(() => {
      const newText = this.text();
      untracked(() => {
        if (this.initialized) {
          this.updateText(newText);
        }
      });
    });

    this.destroyRef.onDestroy(() => {
      if (this.pendingTimeout !== null) {
        clearTimeout(this.pendingTimeout);
      }
      this.transitionEndCleanup?.();
      if (this.mediaQuery) {
        this.mediaQuery.removeEventListener(
          'change',
          this.handleMediaQueryChange,
        );
      }
      const element = this.el.nativeElement;
      element.getAnimations().forEach((anim) => anim.cancel());
      element.removeAttribute(ATTR_ROOT);
      element.removeAttribute(ATTR_DEBUG);
      this.removeStyles();
    });
  }

  // -- Option resolution --

  private get resolvedDuration(): number {
    return this.duration() ?? this.defaults.duration;
  }

  private get resolvedEase(): string {
    return this.ease() ?? this.defaults.ease;
  }

  private get resolvedLocale(): Intl.LocalesArgument {
    return this.locale() ?? this.defaults.locale;
  }

  private get resolvedScale(): boolean {
    return this.scale() ?? this.defaults.scale;
  }

  private get resolvedDisabled(): boolean {
    return this.disabled() ?? this.defaults.disabled;
  }

  private get resolvedRespectReducedMotion(): boolean {
    return this.respectReducedMotion() ?? this.defaults.respectReducedMotion;
  }

  private get resolvedDebug(): boolean {
    return this.debug() ?? this.defaults.debug;
  }

  // -- Setup --

  private setupReducedMotion(): void {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      !this.resolvedRespectReducedMotion
    ) {
      return;
    }

    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.mediaQuery.matches;
    this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
  }

  private setupHostElement(): void {
    const element = this.el.nativeElement;
    element.setAttribute(ATTR_ROOT, '');
    element.style.transitionDuration = `${this.resolvedDuration}ms`;
    element.style.transitionTimingFunction = this.resolvedEase;

    if (this.resolvedDebug) {
      element.setAttribute(ATTR_DEBUG, '');
    }
  }

  private isAnimationDisabled(): boolean {
    return (
      this.resolvedDisabled ||
      (this.resolvedRespectReducedMotion && this.prefersReducedMotion)
    );
  }

  // -- Core animation --

  private updateText(newText: string): void {
    if (newText === this.currentData && !this.isInitialRender) return;
    this.currentData = newText;

    const element = this.el.nativeElement;

    if (this.isAnimationDisabled()) {
      element.textContent = newText;
      return;
    }

    if (!this.isInitialRender) {
      this.animationStart.emit();
    }

    this.createTextGroup(newText, element);
  }

  private createTextGroup(value: string, element: HTMLElement): void {
    const oldWidth = element.offsetWidth;
    const oldHeight = element.offsetHeight;

    const blocks = this.segmentText(value);

    this.prevMeasures = this.measure();
    const oldChildren = Array.from(element.children) as HTMLElement[];
    const newIds = new Set(blocks.map((b) => b.id));

    // Find exiting children (not in new set and not already exiting)
    const exiting = oldChildren.filter(
      (child) =>
        !newIds.has(child.getAttribute(ATTR_ID) as string) &&
        !child.hasAttribute(ATTR_EXITING),
    );

    // For each exiting element, find nearest persistent neighbor as anchor
    const exitingSet = new Set(exiting);
    const exitingAnchorId = new Map<HTMLElement, string | null>();

    for (let i = 0; i < oldChildren.length; i++) {
      const child = oldChildren[i]!;
      if (!exitingSet.has(child)) continue;

      let anchor: string | null = null;
      // Look forward
      for (let j = i + 1; j < oldChildren.length; j++) {
        const siblingId = oldChildren[j]!.getAttribute(ATTR_ID) as string;
        if (newIds.has(siblingId) && !exitingSet.has(oldChildren[j]!)) {
          anchor = siblingId;
          break;
        }
      }
      // Look backward if none found forward
      if (!anchor) {
        for (let j = i - 1; j >= 0; j--) {
          const siblingId = oldChildren[j]!.getAttribute(ATTR_ID) as string;
          if (newIds.has(siblingId) && !exitingSet.has(oldChildren[j]!)) {
            anchor = siblingId;
            break;
          }
        }
      }
      exitingAnchorId.set(child, anchor);
    }

    // Position exiting elements absolutely at their current position
    const parentRect = element.getBoundingClientRect();
    exiting.forEach((child) => {
      const rect = child.getBoundingClientRect();
      child.setAttribute(ATTR_EXITING, '');
      child.style.position = 'absolute';
      child.style.pointerEvents = 'none';
      child.style.left = `${rect.left - parentRect.left}px`;
      child.style.top = `${rect.top - parentRect.top}px`;
      child.style.width = `${rect.width}px`;
      child.style.height = `${rect.height}px`;
    });

    // Remove old persistent children (they'll be re-created)
    oldChildren.forEach((child) => {
      const id = child.getAttribute(ATTR_ID) as string;
      if (newIds.has(id)) child.remove();
    });

    // Create new spans for each block
    blocks.forEach((block) => {
      const span = document.createElement('span');
      span.setAttribute(ATTR_ITEM, '');
      span.setAttribute(ATTR_ID, block.id);
      span.textContent = block.text;
      element.appendChild(span);
    });

    this.currentMeasures = this.measure();
    this.animateBlocks(blocks);

    // Animate exiting elements
    exiting.forEach((child) => {
      if (this.isInitialRender) {
        child.remove();
        return;
      }

      const anchorId = exitingAnchorId.get(child);
      let dx = 0;
      let dy = 0;

      if (
        anchorId &&
        this.prevMeasures[anchorId] &&
        this.currentMeasures[anchorId]
      ) {
        const anchorPrev = this.prevMeasures[anchorId]!;
        const anchorCurr = this.currentMeasures[anchorId]!;
        dx = anchorCurr.x - anchorPrev.x;
        dy = anchorCurr.y - anchorPrev.y;
      }

      child.getAnimations().forEach((a) => a.cancel());

      // Movement animation
      child.animate(
        {
          transform: this.resolvedScale
            ? `translate(${dx}px, ${dy}px) scale(0.95)`
            : `translate(${dx}px, ${dy}px)`,
          offset: 1,
        },
        {
          duration: this.resolvedDuration,
          easing: this.resolvedEase,
          fill: 'both',
        },
      );

      // Fade out animation
      const fadeAnim = child.animate(
        { opacity: 0, offset: 1 },
        {
          duration: this.resolvedDuration * 0.25,
          easing: 'linear',
          fill: 'both',
        },
      );
      fadeAnim.onfinish = () => child.remove();
    });

    // Handle initial render
    if (this.isInitialRender) {
      this.isInitialRender = false;
      element.style.width = 'auto';
      element.style.height = 'auto';
      return;
    }

    if (oldWidth === 0 || oldHeight === 0) return;

    // Animate container size
    element.style.width = 'auto';
    element.style.height = 'auto';
    void element.offsetWidth; // force reflow

    const newWidth = element.offsetWidth;
    const newHeight = element.offsetHeight;

    element.style.width = `${oldWidth}px`;
    element.style.height = `${oldHeight}px`;
    void element.offsetWidth; // force reflow

    element.style.width = `${newWidth}px`;
    element.style.height = `${newHeight}px`;

    if (this.pendingTimeout !== null) {
      clearTimeout(this.pendingTimeout);
      this.pendingTimeout = null;
    }
    this.transitionEndCleanup?.();
    this.transitionEndCleanup = null;

    const runComplete = () => {
      element.style.width = 'auto';
      element.style.height = 'auto';
      this.pendingTimeout = null;
      this.transitionEndCleanup = null;
      this.animationComplete.emit();
    };

    // Use transitionend for accurate completion timing; fallback to setTimeout for edge cases
    let transitionCount = 0;
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (
        e.target !== element ||
        (e.propertyName !== 'width' && e.propertyName !== 'height')
      ) {
        return;
      }
      transitionCount++;
      if (transitionCount >= 2) {
        cleanup();
        runComplete();
      }
    };

    const cleanup = () => {
      element.removeEventListener('transitionend', handleTransitionEnd);
      if (this.pendingTimeout !== null) {
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
      }
      this.transitionEndCleanup = null;
    };

    this.transitionEndCleanup = cleanup;
    element.addEventListener('transitionend', handleTransitionEnd);

    // Fallback: transitionend may not fire if dimensions are identical or in edge cases
    this.pendingTimeout = setTimeout(() => {
      if (this.transitionEndCleanup !== null) {
        cleanup();
        runComplete();
      }
    }, this.resolvedDuration + 50);
  }

  // -- Measurement --

  private measure(): TextMorphMeasures {
    const children = Array.from(
      this.el.nativeElement.children,
    ) as HTMLElement[];
    const measures: TextMorphMeasures = {};

    children.forEach((child, index) => {
      if (child.hasAttribute(ATTR_EXITING)) return;
      const key = child.getAttribute(ATTR_ID) || `child-${index}`;
      measures[key] = {
        x: child.offsetLeft,
        y: child.offsetTop,
      };
    });

    return measures;
  }

  // -- FLIP animations for persistent/new blocks --

  private animateBlocks(blocks: TextMorphBlock[]): void {
    if (this.isInitialRender) return;

    const children = Array.from(
      this.el.nativeElement.children,
    ) as HTMLElement[];
    const persistentIds = new Set(
      blocks.map((b) => b.id).filter((id) => this.prevMeasures[id]),
    );

    // Precompute old position range so orphaned new blocks can enter
    const prevPositionValues = Object.values(this.prevMeasures);
    const hasOldPositions = prevPositionValues.length > 0;
    const minOldX = hasOldPositions
      ? Math.min(...prevPositionValues.map((p) => p.x))
      : 0;
    const maxOldX = hasOldPositions
      ? Math.max(...prevPositionValues.map((p) => p.x))
      : 0;

    children.forEach((child, index) => {
      if (child.hasAttribute(ATTR_EXITING)) return;

      const key = child.getAttribute(ATTR_ID) || `child-${index}`;
      const prev = this.prevMeasures[key];
      const current = this.currentMeasures[key];

      const cx = current?.x ?? 0;
      const cy = current?.y ?? 0;

      let deltaX = prev ? prev.x - cx : 0;
      let deltaY = prev ? prev.y - cy : 0;
      const isNew = !prev;
      let blockIndex = -1;

      // For new blocks, use nearest persistent neighbor's FLIP delta when available,
      // or proportionally map to the old text's position range when all blocks are new
      if (isNew) {
        blockIndex = blocks.findIndex((b) => b.id === key);
        let anchorId: string | null = null;

        for (let j = blockIndex - 1; j >= 0; j--) {
          if (persistentIds.has(blocks[j]!.id)) {
            anchorId = blocks[j]!.id;
            break;
          }
        }
        if (!anchorId) {
          for (let j = blockIndex + 1; j < blocks.length; j++) {
            if (persistentIds.has(blocks[j]!.id)) {
              anchorId = blocks[j]!.id;
              break;
            }
          }
        }

        if (anchorId) {
          const anchorPrev = this.prevMeasures[anchorId]!;
          const anchorCurr = this.currentMeasures[anchorId]!;
          deltaX = anchorPrev.x - anchorCurr.x;
          deltaY = anchorPrev.y - anchorCurr.y;
        } else if (hasOldPositions) {
          // No persistent anchor: map this block proportionally to the old
          // position range so words emerge from where the previous text was
          const fraction =
            blocks.length > 1 ? blockIndex / (blocks.length - 1) : 0.5;
          const targetX = minOldX + fraction * (maxOldX - minOldX);
          deltaX = targetX - cx;
          deltaY = 0;
        }
      }

      child.getAnimations().forEach((a) => a.cancel());

      // Position/movement animation (scale option affects new blocks for consistency with exiting)
      const scaleValue = isNew && this.resolvedScale ? 0.95 : 1;
      child.animate(
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleValue})`,
          offset: 0,
        },
        {
          duration: this.resolvedDuration,
          easing: this.resolvedEase,
          fill: 'both',
        },
      );

      // Opacity animation: persistent blocks reset to opaque immediately;
      // new blocks fade in with a per-word stagger for a natural left-to-right reveal
      if (isNew) {
        const staggerDelay =
          blockIndex * Math.min(this.resolvedDuration * 0.04, 30);
        const fadeDuration = this.resolvedDuration * 0.35;
        const fadeDelay = this.resolvedDuration * 0.1 + staggerDelay;
        child.animate(
          { opacity: 0, offset: 0 },
          {
            duration: fadeDuration,
            delay: fadeDelay,
            easing: 'linear',
            fill: 'both',
          },
        );
      } else {
        child.animate({ opacity: 1, offset: 0 }, { duration: 0, fill: 'both' });
      }
    });
  }

  // -- Text segmentation --

  private segmentText(value: string): TextMorphBlock[] {
    const byWord = value.includes(' ');

    // Intl.Segmenter may not be in all TS lib typings; use runtime check
    const IntlAny = Intl as any;
    if (
      typeof Intl !== 'undefined' &&
      typeof IntlAny.Segmenter !== 'undefined'
    ) {
      const segmenter = new IntlAny.Segmenter(this.resolvedLocale as string, {
        granularity: byWord ? 'word' : 'grapheme',
      });
      const iterator = segmenter.segment(value)[Symbol.iterator]();
      return this.blocksFromSegmenter(iterator);
    }

    return this.blocksFallback(value, byWord);
  }

  private blocksFromSegmenter(
    iterator: IterableIterator<{ segment: string; index: number }>,
  ): TextMorphBlock[] {
    const blocks: TextMorphBlock[] = [];

    for (const segment of iterator) {
      if (segment.segment === ' ') {
        blocks.push({ id: `space-${segment.index}`, text: '\u00A0' });
        continue;
      }

      const existing = blocks.find((x) => x.text === segment.segment);
      if (existing) {
        blocks.push({
          id: `${segment.segment}-${segment.index}`,
          text: segment.segment,
        });
      } else {
        blocks.push({ id: segment.segment, text: segment.segment });
      }
    }

    return blocks;
  }

  private blocksFallback(value: string, byWord: boolean): TextMorphBlock[] {
    const segments = byWord ? value.split(' ') : value.split('');
    const blocks: TextMorphBlock[] = [];

    if (byWord) {
      segments.forEach((segment, index) => {
        if (index > 0) {
          blocks.push({ id: `space-${index}`, text: '\u00A0' });
        }
        const existing = blocks.find((x) => x.text === segment);
        if (existing) {
          blocks.push({ id: `${segment}-${index}`, text: segment });
        } else {
          blocks.push({ id: segment, text: segment });
        }
      });
    } else {
      segments.forEach((segment, index) => {
        const existing = blocks.find((x) => x.text === segment);
        if (existing) {
          blocks.push({ id: `${segment}-${index}`, text: segment });
        } else {
          blocks.push({ id: segment, text: segment });
        }
      });
    }

    return blocks;
  }

  // -- Shared styles --

  private addStyles(): void {
    if (sharedStyleEl) {
      sharedStyleRefCount++;
      return;
    }

    const style = document.createElement('style');
    style.dataset['torph'] = 'true';
    style.innerHTML = `
[${ATTR_ROOT}] {
  display: inline-flex;
  position: relative;
  will-change: width, height;
  transition-property: width, height;
  white-space: nowrap;
}

[${ATTR_ITEM}] {
  display: inline-block;
  will-change: opacity, transform;
  transform: none;
  opacity: 1;
  flex-shrink: 0;
}

[${ATTR_ROOT}][${ATTR_DEBUG}] {
  outline: 2px solid magenta;
}
[${ATTR_ROOT}][${ATTR_DEBUG}] [${ATTR_ITEM}] {
  outline: 2px solid cyan;
  outline-offset: -4px;
}`;
    document.head.appendChild(style);
    sharedStyleEl = style;
    sharedStyleRefCount = 1;
  }

  private removeStyles(): void {
    sharedStyleRefCount--;
    if (sharedStyleRefCount <= 0 && sharedStyleEl) {
      sharedStyleEl.remove();
      sharedStyleEl = null;
      sharedStyleRefCount = 0;
    }
  }
}
