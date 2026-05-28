import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';
import type { NxpChipSize } from '@ngxpro/components/chip';
import { InputChipApiComponent } from './input-chip-api.component';

interface Scenario {
  readonly key: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly placeholder: string;
  readonly separator: RegExp | string;
  readonly seed: readonly string[];
}

interface SizeRow {
  readonly value: NxpChipSize;
  readonly label: string;
  readonly placeholder: string;
}

@Component({
  selector: 'app-input-chip-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    InputChipApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpInputChipComponent,
    NxpLabelDirective,
  ],
  template: `
    <nxp-doc-component-page
      header="Input Chip"
      package="components"
      type="component"
      path="components/input-chip"
    >
      <p class="text-base text-text-secondary mb-6 tracking-tight">
        Type, paste, or drop values to commit them as removable chips. Splits
        input on a configurable separator, deduplicates on demand, and supports
        backspace-to-delete plus double-click to edit. Built on
        <code [class]="cls.code">nxp-input-chip</code> with shadow-bordered
        chrome that mirrors <code [class]="cls.code">nxp-textfield</code>.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Hero"
          description="Type and press Enter or comma, paste a CSV, or tap a suggestion. Backspace on an empty input removes the last chip."
          [content]="{ HTML: heroHtml, TypeScript: heroTs }"
        >
          <div class="w-full max-w-xl space-y-3">
            <div class="flex items-baseline justify-between">
              <label nxpLabel for="hero-tags" [class]="cls.label">
                Article tags
              </label>
              <span [class]="cls.mono">
                {{ heroCtrl.value?.length ?? 0 }} / 6
              </span>
            </div>
            <nxp-input-chip
              id="hero-tags"
              class="w-full min-w-0"
              [formControl]="heroCtrl"
              placeholder="angular, design-systems, typescript…"
            />
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span [class]="cls.caption">Suggested</span>
              @for (s of suggestions; track s) {
                @let added = isHeroSelected(s);
                <button
                  type="button"
                  (click)="toggleHeroSuggestion(s)"
                  [disabled]="added"
                  [class]="added ? cls.pillAdded : cls.pillIdle"
                >
                  @if (added) {
                    <i class="ri-check-line text-[12px]" aria-hidden="true"></i>
                  } @else {
                    <span aria-hidden="true">+</span>
                  }
                  {{ s }}
                </button>
              }
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Real-world patterns"
          description="Common chip-input use cases — switch scenarios to see how separator, placeholder, and seeded values combine in product flows."
          [content]="{ HTML: scenariosHtml, TypeScript: scenariosTs }"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
            <div
              class="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0"
            >
              @for (s of scenarios; track s.key) {
                @let active = scenarioKey() === s.key;
                <button
                  type="button"
                  (click)="selectScenario(s.key)"
                  [attr.aria-pressed]="active"
                  [class]="active ? cls.tabActive : cls.tabIdle"
                >
                  <span [class]="cls.tabKicker">{{ s.label }}</span>
                  <span
                    class="text-sm font-medium leading-tight tracking-tight"
                  >
                    {{ s.title }}
                  </span>
                </button>
              }
            </div>
            <div [class]="cls.card">
              @let s = activeScenario();
              <div class="space-y-1 mb-3">
                <p
                  class="text-sm font-semibold text-text-primary tracking-tight"
                >
                  {{ s.title }}
                </p>
                <p class="text-xs text-text-secondary">{{ s.description }}</p>
              </div>
              <nxp-input-chip
                class="w-full min-w-0"
                [formControl]="scenarioCtrl"
                [placeholder]="s.placeholder"
                [separator]="s.separator"
              />
              <div
                class="flex items-center justify-between pt-3 text-[11px] font-mono text-text-secondary"
              >
                <span>
                  separator =
                  <span class="text-text-primary">{{
                    formatSeparator(s.separator)
                  }}</span>
                </span>
                <button
                  type="button"
                  (click)="resetScenario()"
                  class="inline-flex items-center gap-1 hover:text-text-primary transition-colors"
                >
                  <i class="ri-refresh-line" aria-hidden="true"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Separator"
          description="Pass a string for a single delimiter or a RegExp for richer parsing. Comma commits per token; space splits every whitespace gap — ideal for hashtags."
          [content]="{ HTML: separatorHtml, TypeScript: separatorTs }"
        >
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label nxpLabel for="sep-comma" [class]="cls.label">
                  Comma
                </label>
                <code [class]="cls.code">[separator]="','"</code>
              </div>
              <nxp-input-chip
                id="sep-comma"
                class="w-full min-w-0"
                [formControl]="commaCtrl"
                placeholder="alpha, beta, gamma"
              />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label nxpLabel for="sep-space" [class]="cls.label">
                  Space
                </label>
                <code [class]="cls.code">[separator]="' '"</code>
              </div>
              <nxp-input-chip
                id="sep-space"
                class="w-full min-w-0"
                [formControl]="spaceCtrl"
                placeholder="one two three"
                [separator]="' '"
              />
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Set chipSize to sm, md (default), or lg to control pill density without affecting the wrapper height."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="w-full max-w-xl space-y-4">
            @for (s of sizes; track s.value) {
              <div class="space-y-1.5">
                <div class="flex items-baseline justify-between">
                  <label
                    nxpLabel
                    [attr.for]="'size-' + s.value"
                    [class]="cls.label"
                  >
                    {{ s.label }}
                  </label>
                  <code [class]="cls.code">chipSize="{{ s.value }}"</code>
                </div>
                <nxp-input-chip
                  [id]="'size-' + s.value"
                  class="w-full min-w-0"
                  [formControl]="sizeCtrls[s.value]"
                  [placeholder]="s.placeholder"
                  [chipSize]="s.value"
                />
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Deduplication & disabled"
          description='Duplicates drop silently by default. Pass [unique]="false" for shopping lists or queues where order matters more than identity. Disabled mirrors the flat input chrome.'
          [content]="{ HTML: statesHtml, TypeScript: statesTs }"
        >
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label nxpLabel for="dupes-allowed" [class]="cls.label">
                  Duplicates allowed
                </label>
                <span [class]="cls.badge">unique = false</span>
              </div>
              <nxp-input-chip
                id="dupes-allowed"
                class="w-full min-w-0"
                [formControl]="dupesCtrl"
                placeholder="Add items…"
                [unique]="false"
              />
              <p [class]="cls.mono">{{ dupesCtrl.value | json }}</p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label nxpLabel for="state-disabled" [class]="cls.label">
                  Disabled
                </label>
                <span [class]="cls.badgeMuted">read-only</span>
              </div>
              <nxp-input-chip
                id="state-disabled"
                class="w-full min-w-0"
                [formControl]="disabledCtrl"
                placeholder="Disabled"
              />
              <p class="text-[11px] text-text-secondary">
                Chips render but cannot be removed or edited.
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Playground"
          description="Live preview bound to the API tab — edit any row over there to see this input react. Values persist to the URL query string."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-full max-w-xl space-y-2">
            <label nxpLabel for="playground-tags" [class]="cls.label">
              Playground
            </label>
            <nxp-input-chip
              id="playground-tags"
              class="w-full min-w-0"
              [formControl]="playgroundCtrl"
              [placeholder]="placeholder()"
              [separator]="separator()"
              [unique]="unique()"
              [chipSize]="chipSize()"
            />
            <p [class]="cls.mono">
              value =
              <span class="text-text-primary">{{
                playgroundCtrl.value | json
              }}</span>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-input-chip-api
          [(separator)]="separator"
          [(unique)]="unique"
          [(placeholder)]="placeholder"
          [(chipSize)]="chipSize"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class InputChipDemoComponent {
  readonly heroCtrl = new FormControl<string[]>(['angular', 'design-systems']);
  readonly suggestions = [
    'typescript',
    'rxjs',
    'tailwind',
    'signals',
    'a11y',
    'vercel',
  ] as const;

  readonly scenarios: readonly Scenario[] = [
    {
      key: 'recipients',
      label: 'Mail',
      title: 'Email recipients',
      description:
        'Comma-separated addresses. Paste a CSV and the values split into individual pills.',
      placeholder: 'alice@vercel.com, bob@vercel.com…',
      separator: ',',
      seed: ['design@ngxpro.dev', 'eng@ngxpro.dev'],
    },
    {
      key: 'skills',
      label: 'HR',
      title: 'Skills & keywords',
      description:
        'Whitespace splits every token — type freely and each word becomes its own chip on Enter.',
      placeholder: 'angular rxjs signals nx',
      separator: ' ',
      seed: ['typescript', 'tailwind'],
    },
    {
      key: 'hashtags',
      label: 'Social',
      title: 'Hashtags',
      description:
        'A regex catches commas, spaces, and # signs in one shot — perfect for parsing social copy.',
      placeholder: '#launch, #ship #preview',
      separator: /[\s,#]+/,
      seed: ['ship', 'preview', 'develop'],
    },
  ];
  readonly scenarioKey = signal('recipients');
  readonly activeScenario = computed<Scenario>(
    () =>
      this.scenarios.find((s) => s.key === this.scenarioKey()) ??
      this.scenarios[0],
  );
  readonly scenarioCtrl = new FormControl<string[]>([
    ...this.scenarios[0].seed,
  ]);

  readonly commaCtrl = new FormControl<string[]>(['alpha', 'beta']);
  readonly spaceCtrl = new FormControl<string[]>(['one', 'two']);

  readonly sizes: readonly SizeRow[] = [
    { value: 'sm', label: 'Small', placeholder: 'sm chips' },
    { value: 'md', label: 'Medium (default)', placeholder: 'md chips' },
    { value: 'lg', label: 'Large', placeholder: 'lg chips' },
  ];
  readonly sizeCtrls: Record<NxpChipSize, FormControl<string[] | null>> = {
    sm: new FormControl<string[]>(['compact', 'tight']),
    md: new FormControl<string[]>(['default', 'balanced']),
    lg: new FormControl<string[]>(['comfortable', 'spacious']),
  };

  readonly dupesCtrl = new FormControl<string[]>(['apple', 'apple', 'pear']);
  readonly disabledCtrl = new FormControl<string[]>({
    value: ['locked', 'read-only'],
    disabled: true,
  });

  readonly playgroundCtrl = new FormControl<string[]>([
    'edit',
    'me',
    'in',
    'the',
    'API',
    'tab',
  ]);
  readonly separator = signal<RegExp | string>(',');
  readonly unique = signal(true);
  readonly placeholder = signal('Add tags…');
  readonly chipSize = signal<NxpChipSize>('md');

  protected readonly cls = {
    label: 'text-sm font-medium text-text-primary tracking-tight',
    caption:
      'text-[11px] font-mono uppercase tracking-wider text-text-secondary',
    mono: 'text-[11px] font-mono text-text-secondary',
    code:
      'font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#fafafa] text-text-primary ' +
      'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-white/[0.04] ' +
      'dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
    card:
      'rounded-lg bg-white dark:bg-[#0a0a0a] p-5 ' +
      'shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] ' +
      'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
    pillIdle:
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ' +
      'transition-colors text-text-primary bg-white hover:bg-[#fafafa] ' +
      'shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:bg-[#0a0a0a] ' +
      'dark:hover:bg-white/[0.04] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
    pillAdded:
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ' +
      'transition-colors text-text-secondary bg-[#fafafa] cursor-default ' +
      'dark:bg-white/[0.03]',
    tabActive:
      'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-md text-left ' +
      'whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink transition-colors ' +
      'bg-[#171717] text-white dark:bg-white dark:text-[#171717]',
    tabIdle:
      'flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-md text-left ' +
      'whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink transition-colors ' +
      'text-text-secondary hover:bg-[#fafafa] hover:text-text-primary ' +
      'dark:hover:bg-white/[0.04]',
    tabKicker: 'text-[11px] font-mono uppercase tracking-wider opacity-70',
    badge:
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ' +
      'uppercase tracking-wider bg-[#ebf5ff] text-[#0068d6] ' +
      'dark:bg-[#0068d6]/[0.14] dark:text-[#7bb6ff]',
    badgeMuted:
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ' +
      'uppercase tracking-wider bg-[#fafafa] text-text-secondary ' +
      'shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:bg-white/[0.04] ' +
      'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
  } as const;

  protected isHeroSelected(value: string): boolean {
    return this.heroCtrl.value?.includes(value) ?? false;
  }

  protected toggleHeroSuggestion(value: string): void {
    const current = this.heroCtrl.value ?? [];
    if (current.includes(value)) return;
    this.heroCtrl.setValue([...current, value]);
  }

  protected selectScenario(key: string): void {
    this.scenarioKey.set(key);
    const next = this.scenarios.find((s) => s.key === key);
    if (next) this.scenarioCtrl.setValue([...next.seed]);
  }

  protected resetScenario(): void {
    this.scenarioCtrl.setValue([...this.activeScenario().seed]);
  }

  protected formatSeparator(sep: RegExp | string): string {
    return sep instanceof RegExp ? sep.toString() : `'${sep}'`;
  }

  readonly heroHtml = `<label nxpLabel for="hero-tags">Article tags</label>
<nxp-input-chip
  id="hero-tags"
  class="w-full min-w-0"
  [formControl]="heroCtrl"
  placeholder="angular, design-systems, typescript…"
/>

@for (s of suggestions; track s) {
  <button type="button" (click)="toggleHeroSuggestion(s)">
    + {{ s }}
  </button>
}`;

  readonly heroTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';

@Component({
  selector: 'app-hero-input-chip',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpInputChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-input-chip.html',
})
export class HeroInputChipExample {
  readonly heroCtrl = new FormControl<string[]>(['angular', 'design-systems']);
  readonly suggestions = ['typescript', 'rxjs', 'tailwind', 'signals', 'a11y', 'vercel'] as const;

  toggleHeroSuggestion(value: string): void {
    const current = this.heroCtrl.value ?? [];
    if (current.includes(value)) return;
    this.heroCtrl.setValue([...current, value]);
  }
}`;

  readonly scenariosHtml = `@for (s of scenarios; track s.key) {
  <button type="button" (click)="selectScenario(s.key)">{{ s.title }}</button>
}

<nxp-input-chip
  class="w-full min-w-0"
  [formControl]="scenarioCtrl"
  [placeholder]="activeScenario().placeholder"
  [separator]="activeScenario().separator"
/>`;

  readonly scenariosTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';

interface Scenario {
  readonly key: string;
  readonly title: string;
  readonly placeholder: string;
  readonly separator: RegExp | string;
  readonly seed: readonly string[];
}

@Component({
  selector: 'app-scenarios-input-chip',
  imports: [ReactiveFormsModule, NxpInputChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scenarios-input-chip.html',
})
export class ScenariosInputChipExample {
  readonly scenarios: readonly Scenario[] = [
    { key: 'recipients', title: 'Email recipients', placeholder: 'alice@vercel.com, bob@vercel.com…', separator: ',', seed: ['design@ngxpro.dev', 'eng@ngxpro.dev'] },
    { key: 'skills', title: 'Skills & keywords', placeholder: 'angular rxjs signals nx', separator: ' ', seed: ['typescript', 'tailwind'] },
    { key: 'hashtags', title: 'Hashtags', placeholder: '#launch, #ship #preview', separator: /[\\s,#]+/, seed: ['ship', 'preview', 'develop'] },
  ];
  readonly scenarioKey = signal('recipients');
  readonly activeScenario = computed(() =>
    this.scenarios.find((s) => s.key === this.scenarioKey()) ?? this.scenarios[0],
  );
  readonly scenarioCtrl = new FormControl<string[]>([...this.scenarios[0].seed]);

  selectScenario(key: string): void {
    this.scenarioKey.set(key);
    const next = this.scenarios.find((s) => s.key === key);
    if (next) this.scenarioCtrl.setValue([...next.seed]);
  }
}`;

  readonly separatorHtml = `<label nxpLabel for="comma">Comma</label>
<nxp-input-chip id="comma" class="w-full min-w-0" [formControl]="commaCtrl" placeholder="alpha, beta, gamma" />

<label nxpLabel for="space">Space</label>
<nxp-input-chip id="space" class="w-full min-w-0" [formControl]="spaceCtrl" placeholder="one two three" [separator]="' '" />`;

  readonly separatorTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';

@Component({
  selector: 'app-separator-input-chip',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpInputChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './separator-input-chip.html',
})
export class SeparatorInputChipExample {
  readonly commaCtrl = new FormControl<string[]>(['alpha', 'beta']);
  readonly spaceCtrl = new FormControl<string[]>(['one', 'two']);
}`;

  readonly sizesHtml = `<label nxpLabel for="size-sm">Small</label>
<nxp-input-chip id="size-sm" class="w-full min-w-0" [formControl]="smCtrl" chipSize="sm" />

<label nxpLabel for="size-md">Medium (default)</label>
<nxp-input-chip id="size-md" class="w-full min-w-0" [formControl]="mdCtrl" chipSize="md" />

<label nxpLabel for="size-lg">Large</label>
<nxp-input-chip id="size-lg" class="w-full min-w-0" [formControl]="lgCtrl" chipSize="lg" />`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';

@Component({
  selector: 'app-sizes-input-chip',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpInputChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes-input-chip.html',
})
export class SizesInputChipExample {
  readonly smCtrl = new FormControl<string[]>(['compact', 'tight']);
  readonly mdCtrl = new FormControl<string[]>(['default', 'balanced']);
  readonly lgCtrl = new FormControl<string[]>(['comfortable', 'spacious']);
}`;

  readonly statesHtml = `<label nxpLabel for="dupes">Duplicates allowed</label>
<nxp-input-chip id="dupes" class="w-full min-w-0" [formControl]="dupesCtrl" placeholder="Add items…" [unique]="false" />

<label nxpLabel for="disabled">Disabled</label>
<nxp-input-chip id="disabled" class="w-full min-w-0" [formControl]="disabledCtrl" placeholder="Disabled" />`;

  readonly statesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';

@Component({
  selector: 'app-states-input-chip',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpInputChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './states-input-chip.html',
})
export class StatesInputChipExample {
  readonly dupesCtrl = new FormControl<string[]>(['apple', 'apple', 'pear']);
  readonly disabledCtrl = new FormControl<string[]>({ value: ['locked', 'read-only'], disabled: true });
}`;

  readonly playgroundHtml = `<label nxpLabel for="playground">Playground</label>
<nxp-input-chip
  id="playground"
  class="w-full min-w-0"
  [formControl]="playgroundCtrl"
  [placeholder]="placeholder()"
  [separator]="separator()"
  [unique]="unique()"
  [chipSize]="chipSize()"
/>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';
import type { NxpChipSize } from '@ngxpro/components/chip';

@Component({
  selector: 'app-playground-input-chip',
  imports: [ReactiveFormsModule, NxpLabelDirective, NxpInputChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground-input-chip.html',
})
export class PlaygroundInputChipExample {
  readonly playgroundCtrl = new FormControl<string[]>([]);
  readonly separator = signal<RegExp | string>(',');
  readonly unique = signal(true);
  readonly placeholder = signal('Add tags…');
  readonly chipSize = signal<NxpChipSize>('md');
}`;
}
