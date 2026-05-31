import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { nxpWriteToClipboard } from '@ngxpro/cdk';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { ButtonComponent } from '@ngxpro/components/button';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';
import {
  TextMorphDirective,
  TextMorphComponent as NgxproTextMorph,
} from '@ngxpro/components/text-morph';
import { TextMorphApiComponent } from './text-morph-api.component';

interface DeployStage {
  label: string;
  elapsed: string;
  dot: string;
  text: string;
  pulse: boolean;
}

interface Verb {
  word: string;
  color: string;
}

@Component({
  selector: 'app-text-morph-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    NgxproTextMorph,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpTooltipDirective,
    TextMorphApiComponent,
    TextMorphDirective,
  ],
  template: `
    <nxp-doc-component-page
      header="Text Morph"
      package="components"
      type="component"
      path="components/text-morph"
    >
      <p class="text-base text-text-secondary mb-6">
        FLIP-powered text animation that morphs between values instead of
        snapping. Persistent glyphs glide to their new position, fresh ones fade
        in with a left-to-right stagger, and the leavers drift away — the
        container width and height tween in lockstep so nothing jumps. Ships as
        the
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[nxpTextMorph]</code
        >
        directive or the
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;nxp-text-morph&gt;</code
        >
        component.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ── Playground (bound to the API tab) ─────────────────────────── -->
        <nxp-doc-example
          heading="Playground"
          description="Edit the API table to drive this preview. Morph cycles a preset list; every knob — duration, easing, scale, locale, debug — flows straight into the directive. The status pill is wired to the (animationStart) / (animationComplete) outputs."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="flex flex-col items-center gap-7 w-full py-2">
            <div class="flex min-h-[4.5rem] items-center justify-center">
              <span
                nxpTextMorph
                [text]="text()"
                [duration]="duration()"
                [ease]="ease()"
                [scale]="scale()"
                [disabled]="disabled()"
                [respectReducedMotion]="respectReducedMotion()"
                [debug]="debug()"
                [locale]="locale()"
                (animationStart)="morphing.set(true)"
                (animationComplete)="morphing.set(false)"
                class="text-5xl font-semibold tracking-[-0.05em] text-text-primary tabular-nums"
              ></span>
            </div>

            <div class="flex items-center gap-2">
              <button
                nxpButton
                variant="secondary"
                size="sm"
                (click)="prevWord()"
              >
                Prev
              </button>
              <button
                nxpButton
                variant="primary"
                size="sm"
                (click)="nextWord()"
              >
                Morph &rarr;
              </button>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-bg-neutral-1 dark:bg-bg-neutral-2"
            >
              <span
                class="size-1.5 rounded-full transition-colors duration-300"
                [class]="
                  morphing()
                    ? 'bg-[#0a72ef] animate-pulse'
                    : 'bg-text-secondary/40'
                "
              ></span>
              <span
                nxpTextMorph
                [text]="morphing() ? 'animating' : 'idle'"
                class="text-[11px] font-mono uppercase tracking-[0.12em] text-text-secondary"
              ></span>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Deployment pipeline ───────────────────────────────────────── -->
        <nxp-doc-example
          heading="Deployment pipeline"
          description="The signature workflow metaphor — a status line that morphs Queued → Building → Uploading → Ready while the dot shifts through the Develop / Preview / Ship accent colors and the elapsed timer ticks up in the corner."
          [content]="{ HTML: deployHtml, TypeScript: deployTs }"
        >
          <div
            class="w-[20rem] max-w-full rounded-xl bg-bg-base p-5 flex flex-col gap-4 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-[11px] font-mono uppercase tracking-[0.12em] text-text-secondary"
                >Production</span
              >
              <span
                nxpTextMorph
                [text]="stage().elapsed"
                class="text-[11px] font-mono tabular-nums text-text-secondary"
              ></span>
            </div>

            <div class="flex items-center gap-2.5">
              <span
                class="size-2 rounded-full shrink-0 transition-colors duration-300"
                [class]="stage().dot + (stage().pulse ? ' animate-pulse' : '')"
              ></span>
              <span
                nxpTextMorph
                [text]="stage().label"
                [class]="'text-lg font-medium tracking-tight ' + stage().text"
              ></span>
            </div>

            <div class="flex gap-2 pt-1">
              <button
                nxpButton
                variant="primary"
                size="sm"
                [disabled]="running()"
                (click)="deploy()"
              >
                Deploy
              </button>
              <button
                nxpButton
                variant="ghost"
                size="sm"
                (click)="resetDeploy()"
              >
                Reset
              </button>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Live metrics ──────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Live metrics"
          description="Big numbers morph per-grapheme — digits and separators slide into place rather than re-rendering. Tabular figures keep the layout rock-steady while every digit animates independently. Refresh to roll new values."
          [content]="{ HTML: metricsHtml, TypeScript: metricsTs }"
        >
          <div class="flex flex-col gap-4 w-full">
            <div class="flex flex-wrap gap-4">
              <div
                class="flex-1 min-w-[12rem] rounded-xl bg-bg-base p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              >
                <p
                  class="text-[11px] font-mono uppercase tracking-[0.12em] text-text-secondary mb-2"
                >
                  Edge requests
                </p>
                <span
                  nxpTextMorph
                  [text]="requests()"
                  [duration]="500"
                  class="text-[2.5rem] leading-none font-semibold tracking-[-0.05em] tabular-nums text-text-primary"
                ></span>
              </div>

              <div
                class="flex-1 min-w-[12rem] rounded-xl bg-bg-base p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              >
                <p
                  class="text-[11px] font-mono uppercase tracking-[0.12em] text-text-secondary mb-2"
                >
                  p95 latency
                </p>
                <span
                  nxpTextMorph
                  [text]="latency()"
                  [duration]="500"
                  class="text-[2.5rem] leading-none font-semibold tracking-[-0.05em] tabular-nums text-[#0a72ef]"
                ></span>
              </div>
            </div>

            <div>
              <button
                nxpButton
                variant="secondary"
                size="sm"
                (click)="refreshMetrics()"
              >
                Refresh
              </button>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Rotating headline ─────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Rotating headline"
          description="Word-level morphing on a display headline. The trailing verb cycles on a timer and carries its own accent color — Develop blue, Preview pink, Ship red — so the line reads like the product story telling itself. Pause to hold a frame."
          [content]="{ HTML: headlineHtml, TypeScript: headlineTs }"
        >
          <div class="flex flex-col items-center gap-6 w-full py-4 text-center">
            <p
              class="text-[11px] font-mono uppercase tracking-[0.12em] text-text-secondary"
            >
              The workflow
            </p>
            <h3
              class="text-4xl sm:text-5xl font-semibold tracking-[-0.055em] text-text-primary flex items-baseline justify-center gap-3 flex-wrap"
            >
              <span>Built to</span>
              <span
                nxpTextMorph
                [text]="verb().word"
                [class]="'tracking-[-0.055em] ' + verb().color"
              ></span>
            </h3>
            <button
              nxpButton
              variant="ghost"
              size="sm"
              (click)="toggleRotate()"
            >
              {{ rotating() ? 'Pause' : 'Play' }}
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── Pricing toggle ────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Pricing toggle"
          description="Flip the billing cycle and watch the price FLIP between states. Shared digits stay put while the rest swaps — the savings note morphs in underneath. A custom 350 ms duration keeps the toggle snappy."
          [content]="{ HTML: pricingHtml, TypeScript: pricingTs }"
        >
          <div
            class="w-[18rem] max-w-full rounded-xl bg-bg-base p-6 flex flex-col items-center gap-5 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            <div
              class="inline-flex rounded-full p-0.5 bg-bg-neutral-1 dark:bg-bg-neutral-2 text-xs font-medium"
            >
              <button
                type="button"
                [class]="pillClass(billing() === 'monthly')"
                (click)="setBilling('monthly')"
              >
                Monthly
              </button>
              <button
                type="button"
                [class]="pillClass(billing() === 'yearly')"
                (click)="setBilling('yearly')"
              >
                Yearly
              </button>
            </div>

            <div class="flex items-baseline gap-1">
              <span
                nxpTextMorph
                [text]="price()"
                [duration]="350"
                class="text-5xl font-semibold tracking-[-0.055em] tabular-nums text-text-primary"
              ></span>
              <span class="text-text-secondary text-sm">/mo</span>
            </div>

            <span
              nxpTextMorph
              [text]="billingNote()"
              [duration]="350"
              class="text-xs text-text-secondary"
            ></span>
          </div>
        </nxp-doc-example>

        <!-- ── Copy command ──────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Copy command"
          description="The component nested inside a tooltip's <ng-template>, so the label morphs Copy → Copied on press — in the button and the tooltip at once. Backed by a real clipboard write that resets after a beat."
          [content]="{ HTML: copyHtml, TypeScript: copyTs }"
        >
          <div class="flex items-center gap-3 w-full max-w-md">
            <code
              class="flex-1 truncate font-mono text-sm rounded-md px-3.5 py-2.5 bg-bg-neutral-1 dark:bg-bg-neutral-2 text-text-primary shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              <span class="text-text-secondary select-none">$ </span
              >{{ copyValue }}
            </code>
            <button
              nxpButton
              variant="secondary"
              size="md"
              [nxpTooltip]="copyTooltip"
              nxpTooltipDirection="top"
              [attr.aria-label]="copyLabel()"
              (click)="copyToClipboard()"
            >
              <nxp-text-morph [text]="copyLabel()" class="font-medium" />
            </button>
          </div>

          <ng-template #copyTooltip>
            <nxp-text-morph [text]="copyLabel()" class="text-sm font-medium" />
          </ng-template>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-text-morph-api
          [(text)]="text"
          [(duration)]="duration"
          [(ease)]="ease"
          [(scale)]="scale"
          [(disabled)]="disabled"
          [(respectReducedMotion)]="respectReducedMotion"
          [(locale)]="locale"
          [(debug)]="debug"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class TextMorphDemoComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  // ── Playground state shared with the API tab via model() bindings ──────────
  readonly text = signal('Ship');
  readonly duration = signal(400);
  readonly ease = signal('cubic-bezier(0.19, 1, 0.22, 1)');
  readonly scale = signal(true);
  readonly disabled = signal(false);
  readonly respectReducedMotion = signal(true);
  readonly locale = signal('en');
  readonly debug = signal(false);
  readonly morphing = signal(false);

  private readonly words = [
    'Ship',
    'Preview',
    'Develop',
    'Deploy at the edge',
    'Instant rollbacks',
    'Ship',
  ];
  private wordIndex = 0;

  nextWord(): void {
    this.wordIndex = (this.wordIndex + 1) % this.words.length;
    this.text.set(this.words[this.wordIndex]!);
  }

  prevWord(): void {
    this.wordIndex =
      (this.wordIndex - 1 + this.words.length) % this.words.length;
    this.text.set(this.words[this.wordIndex]!);
  }

  // ── Deployment pipeline ─────────────────────────────────────────────────────
  private readonly stages: DeployStage[] = [
    {
      label: 'Ready to deploy',
      elapsed: '0.0s',
      dot: 'bg-text-secondary/40',
      text: 'text-text-secondary',
      pulse: false,
    },
    {
      label: 'Queued',
      elapsed: '0.4s',
      dot: 'bg-text-secondary/60',
      text: 'text-text-primary',
      pulse: true,
    },
    {
      label: 'Building',
      elapsed: '1.6s',
      dot: 'bg-[#0a72ef]',
      text: 'text-[#0a72ef]',
      pulse: true,
    },
    {
      label: 'Uploading',
      elapsed: '2.9s',
      dot: 'bg-[#de1d8d]',
      text: 'text-[#de1d8d]',
      pulse: true,
    },
    {
      label: 'Ready',
      elapsed: '3.4s',
      dot: 'bg-[#16a34a]',
      text: 'text-[#16a34a]',
      pulse: false,
    },
  ];
  private readonly stageIndex = signal(0);
  readonly running = signal(false);
  readonly stage = computed(() => this.stages[this.stageIndex()]!);
  private deployTimers: ReturnType<typeof setTimeout>[] = [];

  deploy(): void {
    if (this.running()) return;
    this.clearDeployTimers();
    this.running.set(true);
    this.stageIndex.set(1);
    const steps = [2, 3, 4];
    steps.forEach((target, i) => {
      this.deployTimers.push(
        setTimeout(
          () => {
            this.stageIndex.set(target);
            if (target === this.stages.length - 1) this.running.set(false);
          },
          (i + 1) * 950,
        ),
      );
    });
  }

  resetDeploy(): void {
    this.clearDeployTimers();
    this.running.set(false);
    this.stageIndex.set(0);
  }

  private clearDeployTimers(): void {
    this.deployTimers.forEach(clearTimeout);
    this.deployTimers = [];
  }

  // ── Live metrics ────────────────────────────────────────────────────────────
  private readonly requestCount = signal(1_284_402);
  private readonly latencyMs = signal(24);
  readonly requests = computed(() =>
    this.requestCount().toLocaleString('en-US'),
  );
  readonly latency = computed(() => `${this.latencyMs()} ms`);

  refreshMetrics(): void {
    this.requestCount.set(Math.floor(900_000 + Math.random() * 9_000_000));
    this.latencyMs.set(Math.floor(8 + Math.random() * 60));
  }

  // ── Rotating headline ────────────────────────────────────────────────────────
  private readonly verbs: Verb[] = [
    { word: 'develop.', color: 'text-[#0a72ef]' },
    { word: 'preview.', color: 'text-[#de1d8d]' },
    { word: 'ship.', color: 'text-[#ff5b4f]' },
    { word: 'scale.', color: 'text-text-primary' },
  ];
  private verbIndex = signal(0);
  readonly verb = computed(() => this.verbs[this.verbIndex()]!);
  readonly rotating = signal(true);
  private rotateTimer: ReturnType<typeof setInterval> | null = null;

  toggleRotate(): void {
    if (this.rotating()) {
      this.stopRotate();
      this.rotating.set(false);
    } else {
      this.rotating.set(true);
      this.startRotate();
    }
  }

  private startRotate(): void {
    this.stopRotate();
    this.rotateTimer = setInterval(() => {
      this.verbIndex.update((i) => (i + 1) % this.verbs.length);
    }, 2200);
  }

  private stopRotate(): void {
    if (this.rotateTimer !== null) {
      clearInterval(this.rotateTimer);
      this.rotateTimer = null;
    }
  }

  // ── Pricing toggle ───────────────────────────────────────────────────────────
  readonly billing = signal<'monthly' | 'yearly'>('monthly');
  readonly price = computed(() =>
    this.billing() === 'monthly' ? '$20' : '$16',
  );
  readonly billingNote = computed(() =>
    this.billing() === 'monthly'
      ? 'Billed monthly'
      : 'Billed $192 yearly · save 20%',
  );

  setBilling(value: 'monthly' | 'yearly'): void {
    this.billing.set(value);
  }

  pillClass(active: boolean): string {
    return active
      ? 'px-3 py-1 rounded-full bg-bg-base text-text-primary shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]'
      : 'px-3 py-1 rounded-full text-text-secondary hover:text-text-primary transition-colors';
  }

  // ── Copy command ─────────────────────────────────────────────────────────────
  readonly copyLabel = signal<'Copy' | 'Copied'>('Copy');
  readonly copyValue = 'npm i @ngxpro/components --legacy-peer-deps';
  private copyResetId: ReturnType<typeof setTimeout> | null = null;

  async copyToClipboard(): Promise<void> {
    const ok = await nxpWriteToClipboard(this.copyValue, this.doc);
    if (!ok) return;
    this.copyLabel.set('Copied');
    if (this.copyResetId !== null) clearTimeout(this.copyResetId);
    this.copyResetId = setTimeout(() => {
      this.copyLabel.set('Copy');
      this.copyResetId = null;
    }, 1500);
  }

  constructor() {
    afterNextRender(() => this.startRotate());
    this.destroyRef.onDestroy(() => {
      this.clearDeployTimers();
      this.stopRotate();
      if (this.copyResetId !== null) clearTimeout(this.copyResetId);
    });
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ──────────────
  readonly playgroundHtml = `<span
  nxpTextMorph
  [text]="text()"
  [duration]="duration()"
  [ease]="ease()"
  [scale]="scale()"
  [locale]="locale()"
  (animationStart)="morphing.set(true)"
  (animationComplete)="morphing.set(false)"
  class="text-5xl font-semibold tracking-[-0.05em] tabular-nums"
></span>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextMorphDirective } from '@ngxpro/components/text-morph';

@Component({
  selector: 'app-playground',
  imports: [TextMorphDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundExample {
  readonly text = signal('Ship');
  readonly duration = signal(400);
  readonly ease = signal('cubic-bezier(0.19, 1, 0.22, 1)');
  readonly scale = signal(true);
  readonly locale = signal('en');
  readonly morphing = signal(false);
}`;

  readonly deployHtml = `<div class="flex items-center gap-2.5">
  <span class="size-2 rounded-full" [class]="stage().dot"></span>
  <span nxpTextMorph [text]="stage().label" [class]="stage().text"></span>
</div>
<button nxpButton (click)="deploy()" [disabled]="running()">Deploy</button>`;

  readonly deployTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TextMorphDirective } from '@ngxpro/components/text-morph';

interface DeployStage {
  label: string;
  dot: string;
  text: string;
}

@Component({
  selector: 'app-deploy',
  imports: [TextMorphDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deploy.html',
})
export class DeployExample {
  private readonly stages: DeployStage[] = [
    { label: 'Ready to deploy', dot: 'bg-gray-400', text: 'text-gray-500' },
    { label: 'Building', dot: 'bg-[#0a72ef]', text: 'text-[#0a72ef]' },
    { label: 'Uploading', dot: 'bg-[#de1d8d]', text: 'text-[#de1d8d]' },
    { label: 'Ready', dot: 'bg-green-600', text: 'text-green-600' },
  ];
  private readonly index = signal(0);
  readonly running = signal(false);
  readonly stage = computed(() => this.stages[this.index()]!);

  deploy(): void {
    this.running.set(true);
    this.stages.forEach((_, i) =>
      setTimeout(() => {
        this.index.set(i);
        if (i === this.stages.length - 1) this.running.set(false);
      }, i * 950),
    );
  }
}`;

  readonly metricsHtml = `<span
  nxpTextMorph
  [text]="requests()"
  [duration]="500"
  class="text-4xl font-semibold tabular-nums"
></span>`;

  readonly metricsTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TextMorphDirective } from '@ngxpro/components/text-morph';

@Component({
  selector: 'app-metrics',
  imports: [TextMorphDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metrics.html',
})
export class MetricsExample {
  private readonly count = signal(1_284_402);
  readonly requests = computed(() => this.count().toLocaleString('en-US'));

  refresh(): void {
    this.count.set(Math.floor(900_000 + Math.random() * 9_000_000));
  }
}`;

  readonly headlineHtml = `<h3 class="text-5xl font-semibold tracking-[-0.055em] flex gap-3">
  <span>Built to</span>
  <span nxpTextMorph [text]="verb().word" [class]="verb().color"></span>
</h3>`;

  readonly headlineTs = `import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TextMorphDirective } from '@ngxpro/components/text-morph';

@Component({
  selector: 'app-headline',
  imports: [TextMorphDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './headline.html',
})
export class HeadlineExample {
  private readonly verbs = [
    { word: 'develop.', color: 'text-[#0a72ef]' },
    { word: 'preview.', color: 'text-[#de1d8d]' },
    { word: 'ship.', color: 'text-[#ff5b4f]' },
  ];
  private readonly index = signal(0);
  readonly verb = computed(() => this.verbs[this.index()]!);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const id = setInterval(
        () => this.index.update((i) => (i + 1) % this.verbs.length),
        2200,
      );
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }
}`;

  readonly pricingHtml = `<span
  nxpTextMorph
  [text]="price()"
  [duration]="350"
  class="text-5xl font-semibold tabular-nums"
></span>
<span nxpTextMorph [text]="billingNote()" [duration]="350"></span>`;

  readonly pricingTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TextMorphDirective } from '@ngxpro/components/text-morph';

@Component({
  selector: 'app-pricing',
  imports: [TextMorphDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing.html',
})
export class PricingExample {
  readonly billing = signal<'monthly' | 'yearly'>('monthly');
  readonly price = computed(() => (this.billing() === 'monthly' ? '$20' : '$16'));
  readonly billingNote = computed(() =>
    this.billing() === 'monthly'
      ? 'Billed monthly'
      : 'Billed $192 yearly · save 20%',
  );
}`;

  readonly copyHtml = `<button
  nxpButton
  [nxpTooltip]="copyTooltip"
  nxpTooltipDirection="top"
  (click)="copyToClipboard()"
>
  <nxp-text-morph [text]="copyLabel()" />
</button>

<ng-template #copyTooltip>
  <nxp-text-morph [text]="copyLabel()" class="text-sm" />
</ng-template>`;

  readonly copyTs = `import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { nxpWriteToClipboard } from '@ngxpro/cdk';
import { TextMorphComponent } from '@ngxpro/components/text-morph';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-copy',
  imports: [TextMorphComponent, NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './copy.html',
})
export class CopyExample {
  private readonly doc = inject(DOCUMENT);
  readonly copyLabel = signal<'Copy' | 'Copied'>('Copy');

  async copyToClipboard(): Promise<void> {
    if (!(await nxpWriteToClipboard('npm i @ngxpro/components', this.doc))) return;
    this.copyLabel.set('Copied');
    setTimeout(() => this.copyLabel.set('Copy'), 1500);
  }
}`;
}
