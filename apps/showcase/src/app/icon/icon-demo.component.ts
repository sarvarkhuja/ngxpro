import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { IconApiComponent } from './icon-api.component';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Curated Remix Icon webfont classes shown in the library gallery. */
const LIBRARY_ICONS = [
  'ri-home-line',
  'ri-search-line',
  'ri-user-line',
  'ri-settings-3-line',
  'ri-heart-line',
  'ri-star-line',
  'ri-notification-3-line',
  'ri-bookmark-line',
  'ri-mail-line',
  'ri-calendar-line',
  'ri-folder-line',
  'ri-file-line',
  'ri-image-line',
  'ri-camera-line',
  'ri-cloud-line',
  'ri-download-line',
  'ri-upload-line',
  'ri-link',
  'ri-share-line',
  'ri-edit-line',
  'ri-lock-line',
  'ri-global-line',
  'ri-code-s-slash-line',
  'ri-delete-bin-line',
] as const;

/**
 * Icon documentation page.
 *
 * Rebuilt on the Vercel/Geist design language (see design-system.md): a
 * monochrome canvas with shadow-as-border depth, Geist Mono technical labels,
 * and the workflow accent palette used *contextually only*. Each example is a
 * small, real-world composition that exercises a different facet of the
 * component — sizing, currentColor inheritance, motion, the line/fill webfont
 * family, the raw-SVG bypass, and the pipeline/metric patterns the design
 * system is built around.
 */
@Component({
  selector: 'app-icon-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpIconComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Icon"
      package="cdk"
      type="component"
      path="cdk/icon"
    >
      <p class="text-base text-text-secondary mb-6 max-w-2xl leading-relaxed">
        <code
          class="font-mono text-sm bg-bg-neutral-1 text-text-primary px-1.5 py-0.5 rounded-sm"
          >nxp-icon</code
        >
        renders Remix Icons inline with full Tailwind theming. It accepts three
        kinds of input — a
        <code
          class="font-mono text-sm bg-bg-neutral-1 text-text-primary px-1.5 py-0.5 rounded-sm"
          >ri-*-line</code
        >
        /
        <code
          class="font-mono text-sm bg-bg-neutral-1 text-text-primary px-1.5 py-0.5 rounded-sm"
          >ri-*-fill</code
        >
        webfont class, a name resolvable by
        <code
          class="font-mono text-sm bg-bg-neutral-1 text-text-primary px-1.5 py-0.5 rounded-sm"
          >NXP_ICON_RESOLVER</code
        >, or a raw
        <code
          class="font-mono text-sm bg-bg-neutral-1 text-text-primary px-1.5 py-0.5 rounded-sm"
          >&lt;svg&gt;</code
        >
        string. Every glyph inherits
        <code
          class="font-mono text-sm bg-bg-neutral-1 text-text-primary px-1.5 py-0.5 rounded-sm"
          >currentColor</code
        >, so it themes for free.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ───────────────────────── Playground ───────────────────────── -->
        <nxp-doc-example
          heading="Playground"
          [fullsize]="true"
          description="Driven live by the API tab — edit the icon name, size, or class to recompose the stage below."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-full">
            <div
              class="relative flex min-h-56 items-center justify-center overflow-hidden rounded-xl bg-bg-base shadow-border"
              style="background-image: radial-gradient(var(--nxp-border-normal) 1px, transparent 1px); background-size: 16px 16px;"
            >
              <span
                class="pointer-events-none absolute left-3 top-3 size-3 border-l border-t border-border-strong"
              ></span>
              <span
                class="pointer-events-none absolute right-3 top-3 size-3 border-r border-t border-border-strong"
              ></span>
              <span
                class="pointer-events-none absolute bottom-3 left-3 size-3 border-b border-l border-border-strong"
              ></span>
              <span
                class="pointer-events-none absolute bottom-3 right-3 size-3 border-b border-r border-border-strong"
              ></span>
              <nxp-icon [icon]="icon()" [size]="size()" [class]="iconClass()" />
            </div>
            <div class="mt-3 flex justify-center">
              <span
                class="inline-flex items-center gap-2 rounded-full bg-bg-neutral-1 px-3 py-1 font-mono text-xs text-text-tertiary"
              >
                <span class="size-1.5 rounded-full bg-accent-develop"></span>
                {{ icon() }} · {{ size() || 'md' }}
              </span>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ───────────────────────── Library ──────────────────────────── -->
        <nxp-doc-example
          heading="Icon Library"
          [fullsize]="true"
          description="No registry required — drop in any ri-*-line / ri-*-fill class from remixicon.com. Hover a tile to lift it."
          [content]="{ HTML: libraryHtml, TypeScript: libraryTs }"
        >
          <div class="w-full">
            <div
              class="mb-4 flex items-center justify-between border-b border-border-normal pb-3"
            >
              <span
                class="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-text-quaternary"
                >Remix · webfont</span
              >
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-badge-blue-bg px-2.5 py-0.5 text-xs font-medium text-badge-blue-text"
              >
                {{ libraryIcons.length }} glyphs
              </span>
            </div>
            <div
              class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
            >
              @for (name of libraryIcons; track name) {
                <div
                  class="group flex aspect-square flex-col items-center justify-center gap-2 rounded-lg bg-bg-base shadow-border transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card"
                >
                  <nxp-icon
                    [icon]="name"
                    size="lg"
                    class="text-text-tertiary transition-colors duration-normal group-hover:text-text-primary"
                  />
                  <span
                    class="max-w-full truncate px-1 font-mono text-[0.6rem] text-text-quaternary transition-colors duration-normal group-hover:text-text-secondary"
                    >{{ name }}</span
                  >
                </div>
              }
            </div>
          </div>
        </nxp-doc-example>

        <!-- ───────────────────────── Line & Fill ──────────────────────── -->
        <nxp-doc-example
          heading="Line & Fill"
          [fullsize]="true"
          description="Most Remix glyphs ship as a pair — an outline default and a solid variant for the active/selected state."
          [content]="{ HTML: lineFillHtml, TypeScript: lineFillTs }"
        >
          <div
            class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
          >
            @for (pair of iconPairs; track pair.name) {
              <div
                class="flex items-center justify-between rounded-lg bg-bg-base px-4 py-3 shadow-border"
              >
                <span class="font-mono text-xs text-text-tertiary">{{
                  pair.name
                }}</span>
                <div class="flex items-center gap-3">
                  <nxp-icon
                    [icon]="pair.line"
                    size="md"
                    class="text-text-quaternary"
                  />
                  <span class="h-4 w-px bg-border-normal"></span>
                  <nxp-icon
                    [icon]="pair.fill"
                    size="md"
                    class="text-text-primary"
                  />
                </div>
              </div>
            }
          </div>
        </nxp-doc-example>

        <!-- ───────────────────────── Size Scale ───────────────────────── -->
        <nxp-doc-example
          heading="Size Scale"
          [fullsize]="true"
          description='Six tokens map to a fixed pixel ramp via the "size" input — all aligned to a shared baseline.'
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="w-full">
            <div
              class="flex flex-wrap items-end gap-x-10 gap-y-6 border-b border-border-normal pb-6"
            >
              @for (s of sizeScale; track s.token) {
                <div class="flex flex-col items-center gap-3">
                  <nxp-icon
                    icon="ri-home-line"
                    [size]="s.token"
                    class="text-text-primary"
                  />
                  <div class="flex flex-col items-center gap-0.5">
                    <span
                      class="font-mono text-xs font-medium text-text-primary"
                      >{{ s.token }}</span
                    >
                    <span class="font-mono text-[0.65rem] text-text-quaternary"
                      >{{ s.px }}px</span
                    >
                  </div>
                </div>
              }
            </div>
            <p
              class="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-text-quaternary"
            >
              baseline-aligned · scales with font-size
            </p>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────── currentColor ───────────────────────── -->
        <nxp-doc-example
          heading="currentColor & Accents"
          [fullsize]="true"
          description="Icons take their fill from the inherited text color. Stay monochrome by default; reach for the accent and status palettes only to signal meaning."
          [content]="{ HTML: colorHtml, TypeScript: colorTs }"
        >
          <div class="w-full space-y-6">
            <!-- Inheritance row -->
            <div class="space-y-2">
              @for (c of inheritColors; track c.cls) {
                <div [class]="'flex items-center gap-3 ' + c.cls">
                  <nxp-icon icon="ri-arrow-right-line" size="sm" />
                  <span class="text-sm font-medium">{{ c.label }}</span>
                  <span class="font-mono text-xs opacity-70"
                    >inherits currentColor</span
                  >
                </div>
              }
            </div>
            <!-- Functional status chips -->
            <div
              class="flex flex-wrap gap-2 border-t border-border-normal pt-5"
            >
              @for (chip of statusChips; track chip.label) {
                <span
                  [class]="
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ' +
                    chip.bg +
                    ' ' +
                    chip.cls
                  "
                >
                  <nxp-icon [icon]="chip.icon" size="xs" />
                  {{ chip.label }}
                </span>
              }
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────── Workflow Pipeline ──────────────────── -->
        <nxp-doc-example
          heading="Workflow Pipeline"
          [fullsize]="true"
          description="The design system's signature pattern — Develop → Preview → Ship — with the workflow accents applied to their pipeline stage and nowhere else."
          [content]="{ HTML: pipelineHtml, TypeScript: pipelineTs }"
        >
          <div class="flex w-full items-center gap-3 overflow-x-auto py-2">
            @for (step of pipeline; track step.label; let last = $last) {
              <div
                class="flex min-w-40 flex-1 flex-col gap-3 rounded-xl bg-bg-base p-5 shadow-card"
              >
                <span
                  [class]="
                    'inline-flex size-10 items-center justify-center rounded-lg ' +
                    step.bg
                  "
                >
                  <nxp-icon [icon]="step.icon" size="lg" [class]="step.text" />
                </span>
                <div class="space-y-1">
                  <span
                    [class]="
                      'block font-mono text-[0.65rem] font-medium uppercase tracking-wider ' +
                      step.text
                    "
                    >{{ step.label }}</span
                  >
                  <span
                    class="block text-base font-semibold text-text-primary"
                    >{{ step.title }}</span
                  >
                  <span class="block text-xs text-text-secondary">{{
                    step.desc
                  }}</span>
                </div>
              </div>
              @if (!last) {
                <nxp-icon
                  icon="ri-arrow-right-line"
                  size="md"
                  class="shrink-0 text-text-quaternary"
                />
              }
            }
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────── Motion ─────────────────────────── -->
        <nxp-doc-example
          heading="Motion"
          [fullsize]="true"
          description="Because the glyph is a real element, Tailwind animation and group-hover transforms compose directly. Hover a card to play it."
          [content]="{ HTML: motionHtml, TypeScript: motionTs }"
        >
          <div
            class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
          >
            @for (m of motions; track m.label) {
              <div
                class="group flex aspect-square flex-col items-center justify-center gap-3 rounded-lg bg-bg-base shadow-border transition-shadow duration-normal hover:shadow-card"
              >
                <nxp-icon
                  [icon]="m.icon"
                  size="lg"
                  [class]="'text-text-primary ' + m.anim"
                />
                <span
                  class="px-1 text-center font-mono text-[0.6rem] leading-tight text-text-quaternary"
                  >{{ m.label }}</span
                >
              </div>
            }
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────── Usage in Context ───────────────────── -->
        <nxp-doc-example
          heading="In Context"
          [fullsize]="true"
          description="Icons earn their keep beside text — in inputs, buttons, status badges, and list rows."
          [content]="{ HTML: contextHtml, TypeScript: contextTs }"
        >
          <div class="w-full max-w-xl space-y-5">
            <!-- Search field -->
            <div
              class="flex items-center gap-2 rounded-m bg-bg-base px-3 py-2 shadow-border"
            >
              <nxp-icon
                icon="ri-search-line"
                size="sm"
                class="text-text-quaternary"
              />
              <span class="flex-1 text-sm text-text-quaternary"
                >Search components…</span
              >
              <span
                class="rounded-sm bg-bg-neutral-1 px-1.5 py-0.5 font-mono text-[0.65rem] text-text-tertiary"
                >⌘K</span
              >
            </div>

            <!-- Buttons -->
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-m bg-primary px-3.5 py-2 text-sm font-medium text-text-on-accent transition-colors duration-normal hover:bg-primary-hover"
              >
                <nxp-icon icon="ri-add-line" size="sm" />
                New project
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-m bg-bg-base px-3.5 py-2 text-sm font-medium text-text-primary shadow-border transition-shadow duration-normal hover:shadow-card"
              >
                <nxp-icon icon="ri-download-line" size="sm" />
                Export
              </button>
              <button
                type="button"
                class="group inline-flex items-center gap-1.5 rounded-m px-3.5 py-2 text-sm font-medium text-text-action"
              >
                Continue
                <nxp-icon
                  icon="ri-arrow-right-line"
                  size="sm"
                  class="transition-transform duration-normal group-hover:translate-x-0.5"
                />
              </button>
            </div>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-status-positive-pale px-2.5 py-1 text-xs font-medium text-status-positive"
              >
                <nxp-icon icon="ri-check-line" size="xs" />
                Deployed
              </span>
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-status-warning-pale px-2.5 py-1 text-xs font-medium text-status-warning"
              >
                <nxp-icon
                  icon="ri-loader-4-line"
                  size="xs"
                  class="animate-spin"
                />
                Building
              </span>
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-status-negative-pale px-2.5 py-1 text-xs font-medium text-status-negative"
              >
                <nxp-icon icon="ri-close-line" size="xs" />
                Failed
              </span>
            </div>

            <!-- Settings list -->
            <ul class="overflow-hidden rounded-lg bg-bg-base shadow-border">
              @for (row of listRows; track row.label; let last = $last) {
                <li
                  [class]="
                    'group flex items-center justify-between px-4 py-3 transition-colors duration-normal hover:bg-bg-neutral-1 ' +
                    (last ? '' : 'border-b border-border-normal')
                  "
                >
                  <div class="flex items-center gap-3">
                    <span
                      class="inline-flex size-8 items-center justify-center rounded-m bg-bg-neutral-1"
                    >
                      <nxp-icon
                        [icon]="row.icon"
                        size="sm"
                        class="text-text-secondary"
                      />
                    </span>
                    <span class="text-sm font-medium text-text-primary">{{
                      row.label
                    }}</span>
                  </div>
                  <nxp-icon
                    icon="ri-arrow-right-s-line"
                    size="sm"
                    class="text-text-quaternary transition-transform duration-normal group-hover:translate-x-0.5"
                  />
                </li>
              }
            </ul>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────── Metric Cards ───────────────────────── -->
        <nxp-doc-example
          heading="Metric Cards"
          [fullsize]="true"
          description="The Vercel metric card — a compressed Geist number, an icon badge, and a single accent for the trend."
          [content]="{ HTML: metricHtml, TypeScript: metricTs }"
        >
          <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            @for (metric of metrics; track metric.label) {
              <div
                class="flex flex-col gap-4 rounded-xl bg-bg-base p-5 shadow-card"
              >
                <div class="flex items-start justify-between">
                  <span
                    class="inline-flex size-9 items-center justify-center rounded-lg bg-bg-neutral-1"
                  >
                    <nxp-icon
                      [icon]="metric.icon"
                      size="md"
                      class="text-text-secondary"
                    />
                  </span>
                  <span
                    [class]="
                      'inline-flex items-center gap-0.5 text-xs font-medium ' +
                      metric.accent
                    "
                  >
                    <nxp-icon icon="ri-arrow-right-up-line" size="xs" />
                    {{ metric.trend }}
                  </span>
                </div>
                <div class="space-y-0.5">
                  <span
                    class="block text-3xl font-semibold tracking-section text-text-primary"
                    >{{ metric.value }}</span
                  >
                  <span class="block text-xs text-text-secondary">{{
                    metric.label
                  }}</span>
                </div>
              </div>
            }
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────── Raw SVG Bypass ─────────────────────── -->
        <nxp-doc-example
          heading="Raw SVG Bypass"
          [fullsize]="true"
          description='Pass a raw SVG string straight through — detected by the leading "<svg" tag, no registration needed. It still inherits currentColor.'
          [content]="{ HTML: rawSvgHtml, TypeScript: rawSvgTs }"
        >
          <div class="flex w-full flex-wrap items-center gap-3">
            @for (tint of rawTints; track tint.cls) {
              <div
                class="flex flex-col items-center gap-2 rounded-lg bg-bg-base px-6 py-5 shadow-border"
              >
                <nxp-icon [icon]="rawSvg" size="xl" [class]="tint.cls" />
                <span class="font-mono text-[0.6rem] text-text-quaternary">{{
                  tint.label
                }}</span>
              </div>
            }
            <p class="max-w-44 text-sm text-text-secondary">
              One custom path, recolored three ways — zero registry entries.
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-icon-api [(icon)]="icon" [(size)]="size" [(class)]="iconClass" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class IconDemoComponent {
  // ── Playground state shared with the API tab ───────────────────────────────
  readonly icon = signal<string>('ri-rocket-2-line');
  readonly size = signal<IconSize | undefined>('xl');
  readonly iconClass = signal<string>('text-text-primary');

  // ── Demo data ──────────────────────────────────────────────────────────────
  readonly libraryIcons = [...LIBRARY_ICONS];

  readonly iconPairs = [
    { name: 'heart', line: 'ri-heart-line', fill: 'ri-heart-fill' },
    { name: 'star', line: 'ri-star-line', fill: 'ri-star-fill' },
    { name: 'home', line: 'ri-home-line', fill: 'ri-home-fill' },
    { name: 'user', line: 'ri-user-line', fill: 'ri-user-fill' },
    {
      name: 'notification',
      line: 'ri-notification-line',
      fill: 'ri-notification-fill',
    },
    { name: 'bookmark', line: 'ri-bookmark-line', fill: 'ri-bookmark-fill' },
    { name: 'folder', line: 'ri-folder-line', fill: 'ri-folder-fill' },
    { name: 'thumb-up', line: 'ri-thumb-up-line', fill: 'ri-thumb-up-fill' },
  ];

  readonly sizeScale: { token: IconSize; px: number }[] = [
    { token: 'xs', px: 12 },
    { token: 'sm', px: 16 },
    { token: 'md', px: 20 },
    { token: 'lg', px: 24 },
    { token: 'xl', px: 32 },
    { token: '2xl', px: 40 },
  ];

  readonly inheritColors = [
    { label: 'Primary text', cls: 'text-text-primary' },
    { label: 'Secondary text', cls: 'text-text-secondary' },
    { label: 'Tertiary text', cls: 'text-text-tertiary' },
    { label: 'Action / link', cls: 'text-text-action' },
  ];

  readonly statusChips = [
    {
      icon: 'ri-check-line',
      label: 'Positive',
      cls: 'text-status-positive',
      bg: 'bg-status-positive-pale',
    },
    {
      icon: 'ri-close-line',
      label: 'Negative',
      cls: 'text-status-negative',
      bg: 'bg-status-negative-pale',
    },
    {
      icon: 'ri-error-warning-line',
      label: 'Warning',
      cls: 'text-status-warning',
      bg: 'bg-status-warning-pale',
    },
    {
      icon: 'ri-information-line',
      label: 'Info',
      cls: 'text-status-info',
      bg: 'bg-status-info-pale',
    },
  ];

  readonly pipeline = [
    {
      label: 'Develop',
      title: 'Write code',
      desc: 'Branch, commit, push.',
      icon: 'ri-code-s-slash-line',
      text: 'text-accent-develop',
      bg: 'bg-accent-develop/10',
    },
    {
      label: 'Preview',
      title: 'Inspect',
      desc: 'Every PR gets a URL.',
      icon: 'ri-eye-line',
      text: 'text-accent-preview',
      bg: 'bg-accent-preview/10',
    },
    {
      label: 'Ship',
      title: 'Deploy',
      desc: 'Promote to production.',
      icon: 'ri-rocket-2-line',
      text: 'text-accent-ship',
      bg: 'bg-accent-ship/10',
    },
  ];

  readonly motions = [
    { label: 'animate-spin', icon: 'ri-loader-4-line', anim: 'animate-spin' },
    {
      label: 'animate-pulse',
      icon: 'ri-heart-fill',
      anim: 'animate-pulse text-status-negative',
    },
    {
      label: 'animate-bounce',
      icon: 'ri-arrow-down-line',
      anim: 'animate-bounce',
    },
    {
      label: 'hover:translate',
      icon: 'ri-arrow-right-line',
      anim: 'transition-transform duration-normal group-hover:translate-x-1.5',
    },
    {
      label: 'hover:rotate',
      icon: 'ri-settings-3-line',
      anim: 'transition-transform duration-slow group-hover:rotate-90',
    },
    {
      label: 'hover:scale',
      icon: 'ri-rocket-2-line',
      anim: 'transition-transform duration-normal group-hover:-translate-y-1 group-hover:scale-110',
    },
  ];

  readonly listRows = [
    { icon: 'ri-user-line', label: 'Account' },
    { icon: 'ri-notification-3-line', label: 'Notifications' },
    { icon: 'ri-shield-line', label: 'Security' },
    { icon: 'ri-global-line', label: 'Language & region' },
  ];

  readonly metrics = [
    {
      value: '1.2M',
      label: 'Requests / day',
      icon: 'ri-pulse-line',
      trend: '+12.4%',
      accent: 'text-accent-develop',
    },
    {
      value: '99.99%',
      label: 'Uptime',
      icon: 'ri-shield-check-line',
      trend: 'SLA met',
      accent: 'text-status-positive',
    },
    {
      value: '8ms',
      label: 'p50 latency',
      icon: 'ri-flashlight-line',
      trend: '−3ms',
      accent: 'text-text-secondary',
    },
    {
      value: '24k',
      label: 'Deploys',
      icon: 'ri-rocket-2-line',
      trend: '+8.1%',
      accent: 'text-accent-ship',
    },
  ];

  readonly rawTints = [
    { label: 'develop', cls: 'text-accent-develop' },
    { label: 'preview', cls: 'text-accent-preview' },
    { label: 'ship', cls: 'text-accent-ship' },
  ];

  // Spark / diamond — detected as raw SVG by the leading '<' character.
  readonly rawSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l2.9 7.1L22 11l-7.1 2.9L12 21l-2.9-7.1L2 11l7.1-2.9z"/></svg>';

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<div
  class="relative flex min-h-56 items-center justify-center overflow-hidden rounded-xl bg-bg-base shadow-border"
  style="background-image: radial-gradient(var(--nxp-border-normal) 1px, transparent 1px); background-size: 16px 16px;"
>
  <nxp-icon [icon]="icon()" [size]="size()" [class]="iconClass()" />
</div>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

@Component({
  selector: 'app-playground',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundIconExample {
  readonly icon = signal<string>('ri-rocket-2-line');
  readonly size = signal<IconSize | undefined>('xl');
  readonly iconClass = signal<string>('text-text-primary');
}`;

  readonly libraryHtml = `<div class="grid grid-cols-4 gap-2 md:grid-cols-8">
  @for (name of libraryIcons; track name) {
    <div class="group flex aspect-square flex-col items-center justify-center gap-2 rounded-lg bg-bg-base shadow-border hover:-translate-y-0.5 hover:shadow-card">
      <nxp-icon [icon]="name" size="lg" class="text-text-tertiary group-hover:text-text-primary" />
      <span class="font-mono text-[0.6rem] text-text-quaternary">{{ name }}</span>
    </div>
  }
</div>`;

  readonly libraryTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-icon-library',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-library.html',
})
export class IconLibraryExample {
  // Any ri-*-line / ri-*-fill class from remixicon.com works as-is.
  readonly libraryIcons = ['ri-home-line', 'ri-search-line', 'ri-user-line'];
}`;

  readonly lineFillHtml = `@for (pair of iconPairs; track pair.name) {
  <div class="flex items-center justify-between rounded-lg bg-bg-base px-4 py-3 shadow-border">
    <span class="font-mono text-xs text-text-tertiary">{{ pair.name }}</span>
    <div class="flex items-center gap-3">
      <nxp-icon [icon]="pair.line" size="md" class="text-text-quaternary" />
      <span class="h-4 w-px bg-border-normal"></span>
      <nxp-icon [icon]="pair.fill" size="md" class="text-text-primary" />
    </div>
  </div>
}`;

  readonly lineFillTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-line-fill',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './line-fill.html',
})
export class LineFillIconExample {
  readonly iconPairs = [
    { name: 'heart', line: 'ri-heart-line', fill: 'ri-heart-fill' },
    { name: 'star', line: 'ri-star-line', fill: 'ri-star-fill' },
  ];
}`;

  readonly sizesHtml = `<div class="flex flex-wrap items-end gap-10">
  <nxp-icon icon="ri-home-line" size="xs" />
  <nxp-icon icon="ri-home-line" size="sm" />
  <nxp-icon icon="ri-home-line" size="md" />
  <nxp-icon icon="ri-home-line" size="lg" />
  <nxp-icon icon="ri-home-line" size="xl" />
  <nxp-icon icon="ri-home-line" size="2xl" />
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

// xs=12 · sm=16 · md=20 · lg=24 · xl=32 · 2xl=40 (px)
@Component({
  selector: 'app-sizes',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesIconExample {}`;

  readonly colorHtml = `<!-- Glyphs inherit the parent's currentColor -->
<div class="flex items-center gap-3 text-text-action">
  <nxp-icon icon="ri-arrow-right-line" size="sm" />
  <span class="text-sm font-medium">Action / link</span>
</div>

<!-- Status palette signals meaning -->
<span class="inline-flex items-center gap-1.5 rounded-full bg-status-positive-pale px-3 py-1 text-status-positive">
  <nxp-icon icon="ri-check-line" size="xs" />
  Positive
</span>`;

  readonly colorTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-icon-color',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-color.html',
})
export class IconColorExample {
  readonly statusChips = [
    { icon: 'ri-check-line', label: 'Positive', cls: 'text-status-positive', bg: 'bg-status-positive-pale' },
  ];
}`;

  readonly pipelineHtml = `@for (step of pipeline; track step.label; let last = $last) {
  <div class="flex min-w-40 flex-1 flex-col gap-3 rounded-xl bg-bg-base p-5 shadow-card">
    <span class="inline-flex size-10 items-center justify-center rounded-lg {{ step.bg }}">
      <nxp-icon [icon]="step.icon" size="lg" [class]="step.text" />
    </span>
    <span class="font-mono text-[0.65rem] uppercase tracking-wider {{ step.text }}">{{ step.label }}</span>
    <span class="text-base font-semibold text-text-primary">{{ step.title }}</span>
  </div>
  @if (!last) {
    <nxp-icon icon="ri-arrow-right-line" size="md" class="text-text-quaternary" />
  }
}`;

  readonly pipelineTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

// Workflow accents are used ONLY in their pipeline stage (design-system.md §4).
@Component({
  selector: 'app-pipeline',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pipeline.html',
})
export class PipelineIconExample {
  readonly pipeline = [
    { label: 'Develop', title: 'Write code', icon: 'ri-code-s-slash-line', text: 'text-accent-develop', bg: 'bg-accent-develop/10' },
    { label: 'Preview', title: 'Inspect', icon: 'ri-eye-line', text: 'text-accent-preview', bg: 'bg-accent-preview/10' },
    { label: 'Ship', title: 'Deploy', icon: 'ri-rocket-2-line', text: 'text-accent-ship', bg: 'bg-accent-ship/10' },
  ];
}`;

  readonly motionHtml = `@for (m of motions; track m.label) {
  <div class="group flex aspect-square flex-col items-center justify-center gap-3 rounded-lg bg-bg-base shadow-border hover:shadow-card">
    <nxp-icon [icon]="m.icon" size="lg" [class]="'text-text-primary ' + m.anim" />
    <span class="font-mono text-[0.6rem] text-text-quaternary">{{ m.label }}</span>
  </div>
}`;

  readonly motionTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-icon-motion',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-motion.html',
})
export class IconMotionExample {
  readonly motions = [
    { label: 'animate-spin', icon: 'ri-loader-4-line', anim: 'animate-spin' },
    { label: 'hover:rotate', icon: 'ri-settings-3-line', anim: 'transition-transform group-hover:rotate-90' },
  ];
}`;

  readonly contextHtml = `<!-- Search field -->
<div class="flex items-center gap-2 rounded-m bg-bg-base px-3 py-2 shadow-border">
  <nxp-icon icon="ri-search-line" size="sm" class="text-text-quaternary" />
  <span class="flex-1 text-sm text-text-quaternary">Search components…</span>
</div>

<!-- Primary button -->
<button class="inline-flex items-center gap-1.5 rounded-m bg-primary px-3.5 py-2 text-text-on-accent">
  <nxp-icon icon="ri-add-line" size="sm" />
  New project
</button>

<!-- Status badge -->
<span class="inline-flex items-center gap-1.5 rounded-full bg-status-warning-pale px-2.5 py-1 text-status-warning">
  <nxp-icon icon="ri-loader-4-line" size="xs" class="animate-spin" />
  Building
</span>`;

  readonly contextTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-usage-in-context',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usage-in-context.html',
})
export class UsageInContextIconExample {
  readonly listRows = [
    { icon: 'ri-user-line', label: 'Account' },
    { icon: 'ri-shield-line', label: 'Security' },
  ];
}`;

  readonly metricHtml = `@for (metric of metrics; track metric.label) {
  <div class="flex flex-col gap-4 rounded-xl bg-bg-base p-5 shadow-card">
    <div class="flex items-start justify-between">
      <span class="inline-flex size-9 items-center justify-center rounded-lg bg-bg-neutral-1">
        <nxp-icon [icon]="metric.icon" size="md" class="text-text-secondary" />
      </span>
      <span class="inline-flex items-center gap-0.5 text-xs font-medium {{ metric.accent }}">
        <nxp-icon icon="ri-arrow-right-up-line" size="xs" />
        {{ metric.trend }}
      </span>
    </div>
    <span class="text-3xl font-semibold tracking-section text-text-primary">{{ metric.value }}</span>
    <span class="text-xs text-text-secondary">{{ metric.label }}</span>
  </div>
}`;

  readonly metricTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-metric-cards',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-cards.html',
})
export class MetricCardsIconExample {
  readonly metrics = [
    { value: '1.2M', label: 'Requests / day', icon: 'ri-pulse-line', trend: '+12.4%', accent: 'text-accent-develop' },
    { value: '8ms', label: 'p50 latency', icon: 'ri-flashlight-line', trend: '−3ms', accent: 'text-text-secondary' },
  ];
}`;

  readonly rawSvgHtml = `<nxp-icon [icon]="rawSvg" size="xl" class="text-accent-develop" />
<nxp-icon [icon]="rawSvg" size="xl" class="text-accent-preview" />
<nxp-icon [icon]="rawSvg" size="xl" class="text-accent-ship" />`;

  readonly rawSvgTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-raw-svg',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './raw-svg.html',
})
export class RawSvgIconExample {
  // Spark shape — detected as raw SVG by the leading '<' character.
  // fill="currentColor" lets it inherit the Tailwind text color.
  readonly rawSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l2.9 7.1L22 11l-7.1 2.9L12 21l-2.9-7.1L2 11l7.1-2.9z"/></svg>';
}`;
}
