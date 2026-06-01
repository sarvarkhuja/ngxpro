import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  NxpTooltipDirective,
  NxpTooltipIconComponent,
  type NxpTooltipDirection,
  type NxpTooltipSize,
} from '@ngxpro/components/tooltip';
import { TooltipApiComponent } from './tooltip-api.component';

/** One Develop → Preview → Ship node in the deployment pipeline example. */
interface PipelineStage {
  readonly id: string;
  readonly label: string;
  /** Remix icon class + accent color, applied to the node glyph. */
  readonly iconClass: string;
  /** Accent text color for the mono label. */
  readonly labelClass: string;
  /** Accent dot inside the hovercard. */
  readonly dotClass: string;
  readonly title: string;
  readonly desc: string;
  readonly cmd: string;
}

/** One button in the rich-text editor toolbar example. */
interface ToolbarItem {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  /** Keycap glyphs rendered as <kbd> chips in the hovercard. */
  readonly keys: readonly string[];
}

/** One collaborator in the live-presence stack example. */
interface Presence {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly role: string;
  readonly status: string;
  readonly live: boolean;
  /** Avatar background + foreground classes. */
  readonly avatarClass: string;
}

/** One row in the truncated-text deploy table example. */
interface DeployRow {
  readonly commit: string;
  readonly branch: string;
  readonly sha: string;
  readonly status: 'Ready' | 'Building';
  readonly time: string;
}

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpTooltipDirective,
    NxpTooltipIconComponent,
    TooltipApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Tooltip"
      package="components"
      type="directive"
      path="components/tooltip"
    >
      <p class="text-base text-text-secondary mb-6 max-w-2xl">
        A portal-based tooltip that behaves like invisible infrastructure —
        opens on hover, focus, and touch, auto-flips to stay on-screen, and
        renders
        <em class="not-italic text-text-primary">polymorphic content</em>: a
        plain string, a
        <code
          class="rounded-sm bg-bg-neutral-1 px-1 py-0.5 font-mono text-[0.85em] text-text-primary"
          >TemplateRef</code
        >
        for rich hovercards, or a whole component. Sweep across neighbouring
        triggers and the panel re-opens instantly — a continuity detail borrowed
        from native OS tooltips. Backed by
        <code
          class="rounded-sm bg-bg-neutral-1 px-1 py-0.5 font-mono text-[0.85em] text-text-primary"
          >NxpTooltipDirective</code
        >
        from
        <code
          class="rounded-sm bg-bg-neutral-1 px-1 py-0.5 font-mono text-[0.85em] text-text-primary"
          >&#64;ngxpro/components/tooltip</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ── Playground (bound to the API tab) ─────────────────────────── -->
        <nxp-doc-example
          heading="Playground"
          description="Hover or focus the trigger. Every input is editable from the API tab and persists to the URL query string — share a link, land on the exact same state."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div
            class="flex min-h-44 w-full items-center justify-center rounded-lg bg-bg-base-alt [background-image:radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]"
          >
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-m bg-primary px-4 py-2 text-sm font-medium text-text-on-accent shadow-border transition-colors duration-fast hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              [nxpTooltip]="playgroundTooltip()"
              [nxpTooltipDirection]="playgroundDirection()"
              [nxpTooltipAlign]="playgroundAlign()"
              [nxpTooltipSize]="playgroundSize()"
              [nxpTooltipAppearance]="playgroundAppearance()"
              [nxpTooltipDisabled]="playgroundDisabled()"
              [nxpTooltipShowDelay]="playgroundShowDelay()"
              [nxpTooltipHideDelay]="playgroundHideDelay()"
              [nxpTooltipDescribe]="playgroundDescribe() || null"
            >
              <i
                class="ri-cursor-line text-base opacity-80"
                aria-hidden="true"
              ></i>
              Hover or focus me
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── Deployment pipeline — rich TemplateRef hovercards ─────────── -->
        <nxp-doc-example
          heading="Rich content with a TemplateRef"
          description="Pass a <ng-template> instead of a string to render a full hovercard. Each step of the Develop → Preview → Ship pipeline explains itself on hover — title, description, and the command that runs it."
          [content]="{ HTML: pipelineHtml, TypeScript: pipelineTs }"
        >
          <div class="flex min-h-44 w-full items-center justify-center py-6">
            <div class="flex items-center">
              @for (stage of pipelineStages; track stage.id; let last = $last) {
                <div class="flex flex-col items-center gap-2.5">
                  <button
                    type="button"
                    class="grid h-12 w-12 place-items-center rounded-xl bg-bg-base text-lg shadow-border transition duration-fast hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    [nxpTooltip]="stageTip"
                    nxpTooltipAppearance="light"
                    nxpTooltipSize="lg"
                    nxpTooltipDirection="top"
                  >
                    <i [class]="stage.iconClass" aria-hidden="true"></i>
                  </button>
                  <span
                    class="font-mono text-[11px] uppercase tracking-[0.08em]"
                    [class]="stage.labelClass"
                    >{{ stage.label }}</span
                  >
                </div>

                <ng-template #stageTip>
                  <div class="w-60">
                    <div class="flex items-center gap-2">
                      <span
                        class="h-2 w-2 rounded-full"
                        [class]="stage.dotClass"
                      ></span>
                      <span
                        class="font-mono text-[11px] uppercase tracking-[0.08em]"
                        [class]="stage.labelClass"
                        >{{ stage.label }}</span
                      >
                    </div>
                    <p class="mt-1.5 text-sm font-semibold text-text-primary">
                      {{ stage.title }}
                    </p>
                    <p
                      class="mt-1 text-[13px] leading-relaxed text-text-secondary"
                    >
                      {{ stage.desc }}
                    </p>
                    <div
                      class="mt-2.5 flex items-center gap-1.5 rounded-m bg-bg-neutral-1 px-2 py-1 font-mono text-[11px] text-text-secondary shadow-border-light"
                    >
                      <span class="text-text-quaternary">$</span>
                      <span class="truncate">{{ stage.cmd }}</span>
                    </div>
                  </div>
                </ng-template>

                @if (!last) {
                  <div
                    class="mx-2 h-px w-10 bg-gradient-to-r from-border-strong to-border-strong sm:w-16"
                    aria-hidden="true"
                  ></div>
                }
              }
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Keyboard-shortcut toolbar — skip-delay continuity ─────────── -->
        <nxp-doc-example
          heading="Keyboard shortcuts"
          description="A toolbar where each control names itself and shows its shortcut as <kbd> chips. Sweep across the buttons quickly — the tooltip re-opens with no delay and no animation, the way native OS tooltips feel continuous."
          [content]="{ HTML: toolbarHtml, TypeScript: toolbarTs }"
        >
          <div class="flex min-h-44 w-full items-center justify-center py-6">
            <div
              class="inline-flex items-center gap-1 rounded-lg bg-bg-base p-1 shadow-card"
            >
              @for (item of toolbarFormat; track item.id) {
                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-m text-base text-text-secondary transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  [nxpTooltip]="shortcutTip"
                  nxpTooltipAppearance="light"
                  nxpTooltipDirection="bottom"
                >
                  <i [class]="item.icon" aria-hidden="true"></i>
                </button>
                <ng-template #shortcutTip>
                  <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-[13px] font-medium text-text-primary">{{
                      item.label
                    }}</span>
                    <span class="flex items-center gap-0.5">
                      @for (key of item.keys; track $index) {
                        <kbd
                          class="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-normal bg-bg-neutral-1 px-1 font-mono text-[11px] font-medium text-text-secondary"
                          >{{ key }}</kbd
                        >
                      }
                    </span>
                  </div>
                </ng-template>
              }

              <span
                class="mx-1 h-5 w-px bg-border-normal"
                aria-hidden="true"
              ></span>

              @for (item of toolbarHistory; track item.id) {
                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-m text-base text-text-secondary transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  [nxpTooltip]="historyTip"
                  nxpTooltipAppearance="light"
                  nxpTooltipDirection="bottom"
                >
                  <i [class]="item.icon" aria-hidden="true"></i>
                </button>
                <ng-template #historyTip>
                  <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-[13px] font-medium text-text-primary">{{
                      item.label
                    }}</span>
                    <span class="flex items-center gap-0.5">
                      @for (key of item.keys; track $index) {
                        <kbd
                          class="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-normal bg-bg-neutral-1 px-1 font-mono text-[11px] font-medium text-text-secondary"
                          >{{ key }}</kbd
                        >
                      }
                    </span>
                  </div>
                </ng-template>
              }
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Live presence — identity hovercards on focusable avatars ──── -->
        <nxp-doc-example
          heading="Presence avatars"
          description="Overlapping avatars resolve to an identity card on hover or keyboard focus. Because the triggers are buttons, the tooltip is reachable by Tab — accessibility comes for free."
          [content]="{ HTML: presenceHtml, TypeScript: presenceTs }"
        >
          <div
            class="flex min-h-44 w-full flex-col items-center justify-center gap-3 py-6"
          >
            <div class="flex items-center -space-x-2">
              @for (person of presence; track person.id) {
                <button
                  type="button"
                  class="relative grid h-9 w-9 place-items-center rounded-full text-xs font-medium ring-2 ring-bg-base transition duration-fast hover:z-10 hover:-translate-y-0.5 focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  [class]="person.avatarClass"
                  [nxpTooltip]="personTip"
                  nxpTooltipAppearance="light"
                  nxpTooltipDirection="bottom"
                >
                  {{ person.initials }}
                  @if (person.live) {
                    <span
                      class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-status-positive ring-2 ring-bg-base"
                      aria-hidden="true"
                    ></span>
                  }
                </button>
                <ng-template #personTip>
                  <div class="flex w-56 items-center gap-2.5">
                    <span
                      class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-medium"
                      [class]="person.avatarClass"
                      >{{ person.initials }}</span
                    >
                    <div class="min-w-0">
                      <p class="flex items-center gap-1.5">
                        <span
                          class="truncate text-[13px] font-semibold text-text-primary"
                          >{{ person.name }}</span
                        >
                        <span
                          class="shrink-0 rounded-full bg-bg-neutral-1 px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary"
                          >{{ person.role }}</span
                        >
                      </p>
                      <p
                        class="mt-1 flex items-center gap-1.5 text-[11px] text-text-secondary"
                      >
                        <span
                          class="h-1.5 w-1.5 shrink-0 rounded-full"
                          [class]="
                            person.live
                              ? 'bg-status-positive'
                              : 'bg-text-quaternary'
                          "
                        ></span>
                        {{ person.status }}
                      </p>
                    </div>
                  </div>
                </ng-template>
              }

              <button
                type="button"
                class="grid h-9 w-9 place-items-center rounded-full bg-bg-neutral-1 text-[11px] font-medium text-text-secondary ring-2 ring-bg-base transition duration-fast hover:z-10 hover:-translate-y-0.5 focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpTooltip]="'2 more collaborators'"
                nxpTooltipDirection="bottom"
              >
                +2
              </button>
            </div>
            <p
              class="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary"
            >
              5 viewing this file
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── Truncated text — alignment + a real-world pattern ─────────── -->
        <nxp-doc-example
          heading="Reveal truncated text"
          description="The most common job a tooltip has: show what was clipped. Each commit message is truncated, then revealed in full on hover with nxpTooltipAlign='start' so the panel lines up with the text it came from."
          [content]="{ HTML: tableHtml, TypeScript: tableTs }"
        >
          <div class="w-full py-2">
            <div class="overflow-hidden rounded-lg shadow-border">
              <table class="w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr
                    class="border-b border-border-normal bg-bg-base-alt text-left font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary"
                  >
                    <th class="w-[46%] px-4 py-2.5 font-medium">Commit</th>
                    <th class="w-[24%] px-4 py-2.5 font-medium">Branch</th>
                    <th class="w-[18%] px-4 py-2.5 font-medium">Status</th>
                    <th class="w-[12%] px-4 py-2.5 text-right font-medium">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-bg-base">
                  @for (row of deploys; track row.sha) {
                    <tr class="border-b border-border-normal last:border-0">
                      <td class="px-4 py-3">
                        <span
                          class="block cursor-default truncate text-text-primary"
                          [nxpTooltip]="row.commit"
                          nxpTooltipAlign="start"
                          nxpTooltipSize="sm"
                          >{{ row.commit }}</span
                        >
                      </td>
                      <td class="px-4 py-3">
                        <span
                          class="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-bg-neutral-1 px-2 py-0.5 font-mono text-[11px] text-text-secondary"
                          [nxpTooltip]="row.branch"
                          nxpTooltipAlign="start"
                          nxpTooltipSize="sm"
                        >
                          <i
                            class="ri-git-branch-line shrink-0"
                            aria-hidden="true"
                          ></i>
                          <span class="truncate">{{ row.branch }}</span>
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <span
                          class="inline-flex items-center gap-1.5 text-[13px]"
                        >
                          <span
                            class="h-1.5 w-1.5 rounded-full"
                            [class]="
                              row.status === 'Ready'
                                ? 'bg-status-positive'
                                : 'bg-text-quaternary animate-pulse'
                            "
                          ></span>
                          <span
                            [class]="
                              row.status === 'Ready'
                                ? 'text-status-positive'
                                : 'text-text-secondary'
                            "
                            >{{ row.status }}</span
                          >
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-right font-mono text-[11px] text-text-tertiary"
                      >
                        {{ row.time }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Directions & auto-flip ────────────────────────────────────── -->
        <nxp-doc-example
          heading="Directions"
          description="Open above, below, or to either side. When a panel would overflow the viewport it auto-flips to the opposite edge — scroll the page so a button nears the top and watch 'top' become 'bottom'."
          [content]="{ HTML: directionsHtml, TypeScript: directionsTs }"
        >
          <div class="grid min-h-44 w-full place-items-center py-6">
            <div class="grid grid-cols-3 grid-rows-3 gap-2">
              <button
                type="button"
                class="col-start-2 row-start-1 inline-flex items-center justify-center rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpTooltip]="'Opens upward'"
                nxpTooltipDirection="top"
              >
                top
              </button>
              <button
                type="button"
                class="col-start-1 row-start-2 inline-flex items-center justify-center rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpTooltip]="'Opens to the left'"
                nxpTooltipDirection="left"
              >
                left
              </button>
              <div
                class="col-start-2 row-start-2 grid h-full w-full place-items-center rounded-m bg-bg-base-alt font-mono text-[10px] uppercase tracking-[0.08em] text-text-quaternary"
              >
                hover
              </div>
              <button
                type="button"
                class="col-start-3 row-start-2 inline-flex items-center justify-center rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpTooltip]="'Opens to the right'"
                nxpTooltipDirection="right"
              >
                right
              </button>
              <button
                type="button"
                class="col-start-2 row-start-3 inline-flex items-center justify-center rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpTooltip]="'Opens downward'"
                nxpTooltipDirection="bottom"
              >
                bottom
              </button>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Sizes & appearances ───────────────────────────────────────── -->
        <nxp-doc-example
          heading="Sizes & appearances"
          description="Three sizes (sm / md / lg) scale text and padding together. Two appearances — dark (default, an inverse surface) and light (a bordered surface) — both flip correctly in dark mode."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div
            class="flex min-h-44 w-full flex-col items-center justify-center gap-6 py-6"
          >
            <div class="flex flex-col items-center gap-2">
              <span
                class="font-mono text-[10px] uppercase tracking-[0.08em] text-text-quaternary"
                >size</span
              >
              <div class="flex flex-wrap items-center justify-center gap-3">
                @for (size of sizes; track size) {
                  <button
                    type="button"
                    class="inline-flex items-center rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    [nxpTooltip]="'Size ' + size"
                    [nxpTooltipSize]="size"
                  >
                    {{ size }}
                  </button>
                }
              </div>
            </div>

            <div class="flex flex-col items-center gap-2">
              <span
                class="font-mono text-[10px] uppercase tracking-[0.08em] text-text-quaternary"
                >appearance</span
              >
              <div class="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  [nxpTooltip]="'Inverse surface — the default'"
                  nxpTooltipAppearance="dark"
                >
                  <span class="h-3 w-3 rounded-full bg-primary"></span>
                  dark
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-m border border-border-normal bg-bg-base px-4 py-2 text-sm font-medium text-text-primary shadow-border-light transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  [nxpTooltip]="'Bordered surface for richer content'"
                  nxpTooltipAppearance="light"
                >
                  <span
                    class="h-3 w-3 rounded-full bg-bg-base shadow-border"
                  ></span>
                  light
                </button>
              </div>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Inline help icons (nxp-tooltip-icon) ──────────────────────── -->
        <nxp-doc-example
          heading="Inline help icons"
          description="nxp-tooltip-icon drops a self-describing info glyph next to a label — it carries role='img' and aria-label='Help', and forwards every tooltip input. Ideal for clarifying form fields without cluttering the layout."
          [content]="{ HTML: iconHtml, TypeScript: iconTs }"
        >
          <div class="flex min-h-44 w-full items-center justify-center py-6">
            <div
              class="w-full max-w-sm space-y-4 rounded-xl bg-bg-base p-5 shadow-card"
            >
              <p
                class="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary"
              >
                Project settings
              </p>

              <label class="block">
                <span
                  class="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-text-primary"
                >
                  Production branch
                  <nxp-tooltip-icon
                    [nxpTooltip]="
                      'Commits to this branch deploy straight to production.'
                    "
                    nxpTooltipDirection="right"
                    nxpTooltipAppearance="light"
                  />
                </span>
                <span
                  class="block rounded-m border border-border-normal bg-bg-base-alt px-3 py-2 font-mono text-[13px] text-text-secondary"
                  >main</span
                >
              </label>

              <label class="block">
                <span
                  class="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-text-primary"
                >
                  Build command
                  <nxp-tooltip-icon
                    [nxpTooltip]="
                      'Runs in the build container before the output is uploaded. Leave empty to use the framework preset.'
                    "
                    nxpTooltipDirection="right"
                    nxpTooltipAppearance="light"
                    nxpTooltipSize="lg"
                  />
                </span>
                <span
                  class="block rounded-m border border-border-normal bg-bg-base-alt px-3 py-2 font-mono text-[13px] text-text-secondary"
                  >nx build showcase</span
                >
              </label>
            </div>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-tooltip-api
          [(nxpTooltip)]="playgroundTooltip"
          [(nxpTooltipDirection)]="playgroundDirection"
          [(nxpTooltipAlign)]="playgroundAlign"
          [(nxpTooltipAppearance)]="playgroundAppearance"
          [(nxpTooltipSize)]="playgroundSize"
          [(nxpTooltipShowDelay)]="playgroundShowDelay"
          [(nxpTooltipHideDelay)]="playgroundHideDelay"
          [(nxpTooltipDisabled)]="playgroundDisabled"
          [(nxpTooltipDescribe)]="playgroundDescribe"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class TooltipDemoComponent {
  readonly sizes: NxpTooltipSize[] = ['sm', 'md', 'lg'];

  // ── Shared playground state — bound two-way into <app-tooltip-api> ────────
  readonly playgroundTooltip = signal<string>('Tooltip content goes here');
  readonly playgroundDirection = signal<NxpTooltipDirection>('top');
  readonly playgroundAlign = signal<'start' | 'center' | 'end'>('center');
  readonly playgroundSize = signal<NxpTooltipSize>('md');
  readonly playgroundAppearance = signal<string>('dark');
  readonly playgroundDisabled = signal(false);
  readonly playgroundShowDelay = signal(300);
  readonly playgroundHideDelay = signal(100);
  readonly playgroundDescribe = signal<string>('');

  // ── Example data ─────────────────────────────────────────────────────────
  readonly pipelineStages: PipelineStage[] = [
    {
      id: 'develop',
      label: 'Develop',
      iconClass: 'ri-git-branch-line text-accent-develop',
      labelClass: 'text-accent-develop',
      dotClass: 'bg-accent-develop',
      title: 'Work in a branch',
      desc: 'Every push triggers an isolated build with the cache restored from your last deploy.',
      cmd: 'git push origin feat/login',
    },
    {
      id: 'preview',
      label: 'Preview',
      iconClass: 'ri-eye-line text-accent-preview',
      labelClass: 'text-accent-preview',
      dotClass: 'bg-accent-preview',
      title: 'Preview every commit',
      desc: 'A unique URL per deploy, ready to share with your team for review and comments.',
      cmd: 'vercel deploy --prebuilt',
    },
    {
      id: 'ship',
      label: 'Ship',
      iconClass: 'ri-rocket-2-line text-accent-ship',
      labelClass: 'text-accent-ship',
      dotClass: 'bg-accent-ship',
      title: 'Promote to production',
      desc: 'An atomic, zero-downtime rollout — and a one-click instant rollback if you need it.',
      cmd: 'vercel promote',
    },
  ];

  readonly toolbarFormat: ToolbarItem[] = [
    { id: 'bold', icon: 'ri-bold', label: 'Bold', keys: ['⌘', 'B'] },
    { id: 'italic', icon: 'ri-italic', label: 'Italic', keys: ['⌘', 'I'] },
    {
      id: 'strike',
      icon: 'ri-strikethrough',
      label: 'Strikethrough',
      keys: ['⌘', '⇧', 'X'],
    },
    { id: 'link', icon: 'ri-link', label: 'Insert link', keys: ['⌘', 'K'] },
    {
      id: 'code',
      icon: 'ri-code-s-slash-line',
      label: 'Inline code',
      keys: ['⌘', 'E'],
    },
    {
      id: 'quote',
      icon: 'ri-double-quotes-l',
      label: 'Block quote',
      keys: ['⌘', '⇧', '9'],
    },
  ];

  readonly toolbarHistory: ToolbarItem[] = [
    {
      id: 'undo',
      icon: 'ri-arrow-go-back-line',
      label: 'Undo',
      keys: ['⌘', 'Z'],
    },
    {
      id: 'redo',
      icon: 'ri-arrow-go-forward-line',
      label: 'Redo',
      keys: ['⌘', '⇧', 'Z'],
    },
  ];

  readonly presence: Presence[] = [
    {
      id: 'sm',
      initials: 'SM',
      name: 'Sarvar Murodov',
      role: 'Owner',
      status: 'Editing tooltip.directive.ts',
      live: true,
      avatarClass: 'bg-primary text-text-on-accent',
    },
    {
      id: 'ak',
      initials: 'AK',
      name: 'Aki Tanaka',
      role: 'Maintainer',
      status: 'Viewing · line 42',
      live: true,
      avatarClass: 'bg-bg-neutral-2 text-text-secondary',
    },
    {
      id: 'jl',
      initials: 'JL',
      name: 'Jordan Lee',
      role: 'Reviewer',
      status: 'Idle · last seen 3m ago',
      live: false,
      avatarClass: 'bg-bg-neutral-2 text-text-secondary',
    },
  ];

  readonly deploys: DeployRow[] = [
    {
      commit:
        'feat(tooltip): render bare TemplateRef content without an explicit context',
      branch: 'feat/rich-tooltips',
      sha: '69bfc03',
      status: 'Building',
      time: 'just now',
    },
    {
      commit:
        'fix(tooltip): auto-flip the panel when the trigger sits near the viewport edge',
      branch: 'fix/tooltip-overflow',
      sha: 'a45bfe5',
      status: 'Ready',
      time: '2m ago',
    },
    {
      commit:
        'refactor(pipeline): extract Develop → Preview → Ship nodes into reusable stages',
      branch: 'main',
      sha: 'c326df5',
      status: 'Ready',
      time: '1h ago',
    },
  ];

  // ── Example source snippets shown inside <nxp-doc-example> tabs ───────────
  readonly playgroundHtml = `<button
  type="button"
  [nxpTooltip]="tooltip()"
  [nxpTooltipDirection]="direction()"
  [nxpTooltipAlign]="align()"
  [nxpTooltipSize]="size()"
  [nxpTooltipAppearance]="appearance()"
  [nxpTooltipShowDelay]="showDelay()"
  [nxpTooltipHideDelay]="hideDelay()"
  [nxpTooltipDisabled]="disabled()"
>
  Hover or focus me
</button>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpTooltipDirective,
  type NxpTooltipDirection,
  type NxpTooltipSize,
} from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-playground',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-playground.html',
})
export class TooltipPlaygroundExample {
  readonly tooltip = signal('Tooltip content goes here');
  readonly direction = signal<NxpTooltipDirection>('top');
  readonly align = signal<'start' | 'center' | 'end'>('center');
  readonly size = signal<NxpTooltipSize>('md');
  readonly appearance = signal('dark');
  readonly showDelay = signal(300);
  readonly hideDelay = signal(100);
  readonly disabled = signal(false);
}`;

  readonly pipelineHtml = `<!-- A TemplateRef is rendered inside the panel — no context needed -->
<button [nxpTooltip]="develop" nxpTooltipAppearance="light" nxpTooltipSize="lg">
  <i class="ri-git-branch-line"></i>
</button>

<ng-template #develop>
  <div class="w-60">
    <span class="font-mono text-[11px] uppercase text-accent-develop">Develop</span>
    <p class="mt-1.5 text-sm font-semibold">Work in a branch</p>
    <p class="mt-1 text-[13px] text-text-secondary">
      Every push triggers an isolated build.
    </p>
    <code class="mt-2.5 block rounded-m bg-bg-neutral-1 px-2 py-1">
      $ git push origin feat/login
    </code>
  </div>
</ng-template>`;

  readonly pipelineTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

// [nxpTooltip] accepts a string, a TemplateRef, or an NxpDynamicComponent.
// Passing the template ref renders rich markup inside the tooltip panel.
@Component({
  selector: 'app-tooltip-pipeline',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-pipeline.html',
})
export class TooltipPipelineExample {}`;

  readonly toolbarHtml = `@for (item of items; track item.id) {
  <button [nxpTooltip]="tip" nxpTooltipAppearance="light" nxpTooltipDirection="bottom">
    <i [class]="item.icon"></i>
  </button>
  <ng-template #tip>
    <div class="flex items-center gap-3">
      <span class="text-[13px] font-medium">{{ item.label }}</span>
      @for (key of item.keys; track $index) {
        <kbd class="rounded border px-1 font-mono text-[11px]">{{ key }}</kbd>
      }
    </div>
  </ng-template>
}`;

  readonly toolbarTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

interface ToolbarItem {
  id: string;
  icon: string;
  label: string;
  keys: string[];
}

@Component({
  selector: 'app-tooltip-toolbar',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-toolbar.html',
})
export class TooltipToolbarExample {
  // Sweep across adjacent triggers within ~300ms and each tooltip re-opens
  // instantly, with no enter animation — handled by NxpTooltipGroupService.
  readonly items: ToolbarItem[] = [
    { id: 'bold', icon: 'ri-bold', label: 'Bold', keys: ['⌘', 'B'] },
    { id: 'italic', icon: 'ri-italic', label: 'Italic', keys: ['⌘', 'I'] },
    { id: 'link', icon: 'ri-link', label: 'Insert link', keys: ['⌘', 'K'] },
  ];
}`;

  readonly presenceHtml = `<div class="flex -space-x-2">
  @for (person of people; track person.id) {
    <!-- A <button> trigger is focusable, so the card is reachable by Tab -->
    <button
      class="rounded-full ring-2 ring-bg-base"
      [class]="person.avatarClass"
      [nxpTooltip]="card"
      nxpTooltipAppearance="light"
      nxpTooltipDirection="bottom"
    >
      {{ person.initials }}
    </button>
    <ng-template #card>
      <div class="flex w-56 items-center gap-2.5">
        <span class="rounded-full" [class]="person.avatarClass">
          {{ person.initials }}
        </span>
        <div>
          <p class="text-[13px] font-semibold">{{ person.name }}</p>
          <p class="text-[11px] text-text-secondary">{{ person.status }}</p>
        </div>
      </div>
    </ng-template>
  }
</div>`;

  readonly presenceTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

interface Presence {
  id: string;
  initials: string;
  name: string;
  status: string;
  avatarClass: string;
}

@Component({
  selector: 'app-tooltip-presence',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-presence.html',
})
export class TooltipPresenceExample {
  readonly people: Presence[] = [
    {
      id: 'sm',
      initials: 'SM',
      name: 'Sarvar Murodov',
      status: 'Editing tooltip.directive.ts',
      avatarClass: 'bg-primary text-text-on-accent',
    },
  ];
}`;

  readonly tableHtml = `<!-- Truncate the cell, reveal the full value on hover, aligned to its start -->
@for (row of deploys; track row.sha) {
  <td>
    <span
      class="block truncate"
      [nxpTooltip]="row.commit"
      nxpTooltipAlign="start"
      nxpTooltipSize="sm"
    >
      {{ row.commit }}
    </span>
  </td>
}`;

  readonly tableTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-table',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-table.html',
})
export class TooltipTableExample {
  readonly deploys = [
    {
      commit: 'feat(tooltip): render bare TemplateRef content without a context',
      branch: 'feat/rich-tooltips',
      sha: '69bfc03',
    },
  ];
}`;

  readonly directionsHtml = `<button [nxpTooltip]="'Opens upward'" nxpTooltipDirection="top">top</button>
<button [nxpTooltip]="'Opens to the left'" nxpTooltipDirection="left">left</button>
<button [nxpTooltip]="'Opens to the right'" nxpTooltipDirection="right">right</button>
<button [nxpTooltip]="'Opens downward'" nxpTooltipDirection="bottom">bottom</button>`;

  readonly directionsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

// Direction is a preference: the panel auto-flips to the opposite edge
// whenever it would overflow the viewport.
@Component({
  selector: 'app-tooltip-directions',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-directions.html',
})
export class TooltipDirectionsExample {}`;

  readonly sizesHtml = `<!-- size -->
@for (size of sizes; track size) {
  <button [nxpTooltip]="'Size ' + size" [nxpTooltipSize]="size">{{ size }}</button>
}

<!-- appearance -->
<button [nxpTooltip]="'Inverse surface'" nxpTooltipAppearance="dark">dark</button>
<button [nxpTooltip]="'Bordered surface'" nxpTooltipAppearance="light">light</button>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpTooltipDirective,
  type NxpTooltipSize,
} from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-sizes',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-sizes.html',
})
export class TooltipSizesExample {
  readonly sizes: NxpTooltipSize[] = ['sm', 'md', 'lg'];
}`;

  readonly iconHtml = `<label>
  Production branch
  <nxp-tooltip-icon
    [nxpTooltip]="'Commits to this branch deploy straight to production.'"
    nxpTooltipDirection="right"
    nxpTooltipAppearance="light"
  />
</label>`;

  readonly iconTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipIconComponent } from '@ngxpro/components/tooltip';

// nxp-tooltip-icon applies NxpTooltipDirective to itself via hostDirectives,
// so it forwards every [nxpTooltip*] input and ships with role="img" +
// aria-label="Help" for screen readers.
@Component({
  selector: 'app-tooltip-icon-example',
  imports: [NxpTooltipIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-icon-example.html',
})
export class TooltipIconExample {}`;
}
