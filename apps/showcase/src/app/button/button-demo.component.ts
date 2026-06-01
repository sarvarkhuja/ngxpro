import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  ButtonComponent as NxpButton,
  type ButtonSize,
  type ButtonVariant,
} from '@ngxpro/components/button';
import { TextMorphComponent } from '@ngxpro/components/text-morph';
import { ButtonApiComponent } from './button-api.component';

/**
 * Wrap a Lucide-style 24×24 stroke path set as an inline SVG string for the
 * button's `iconStart` / `iconEnd` slots. `currentColor` + `fill="none"` let it
 * inherit the button's text color, and the component's own `[&_svg]` rules
 * animate the stroke from 1.5 → 2 on hover.
 */
const geistIcon = (paths: string): string =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

// Accent-CTA recipes — the workflow palette applied via the [class] override,
// exactly as design-system.md prescribes (accents are contextual, never decorative).
const DEVELOP_CTA =
  'bg-accent-develop text-white hover:bg-accent-develop/90 active:bg-accent-develop/80';
const PREVIEW_CTA =
  'bg-accent-preview text-white hover:bg-accent-preview/90 active:bg-accent-preview/80';
const SHIP_CTA =
  'bg-accent-ship text-white hover:bg-accent-ship/90 active:bg-accent-ship/80';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NxpIconComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpButton,
    TextMorphComponent,
    ButtonApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Button"
      package="components"
      type="component"
      path="components/button"
    >
      <p class="text-base text-text-secondary mb-6">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpButton</code
        >
        turns any native
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;button&gt;</code
        >
        or
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;a&gt;</code
        >
        into a Vercel/Geist-styled action — five variants, three sizes plus
        square icon-only sizes, a built-in figure-8 loading spinner, and
        start/end icon slots. Styling is 100% Tailwind via
        <code>tailwind-variants</code>, and the
        <code>[class]</code>
        input merges through
        <code>cx()</code>
        so you can re-skin a single instance.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ── Interactive playground, wired to the API tab ───────────────── -->
        <nxp-doc-example
          heading="Playground"
          description="Drive every input from the API tab — variant, size, loading and disabled. Selections persist to the URL."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="flex min-h-28 items-center justify-center">
            <button
              nxpButton
              [variant]="variant()"
              [size]="size()"
              [loading]="loading()"
              [disabled]="disabled()"
              [iconStart]="isIconSize() ? '' : icons.rocket"
            >
              @if (isIconSize()) {
                <nxp-icon icon="ri-rocket-2-line" size="sm" />
              } @else {
                Deploy
              }
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── Variants ───────────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Variants"
          description="Five intents — primary for the main action, secondary/tertiary for supporting actions, ghost for low-emphasis, destructive for irreversible ones."
          [content]="{ HTML: variantsHtml }"
        >
          <div class="flex flex-wrap items-center gap-3">
            @for (v of variants; track v) {
              <button nxpButton [variant]="v" class="capitalize">
                {{ v }}
              </button>
            }
          </div>
        </nxp-doc-example>

        <!-- ── Sizes ──────────────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Sizes"
          description="Three text sizes — sm (28px), md (32px, default) and lg (40px). Tracking stays at normal per the Geist principle that compression relaxes at small sizes."
          [content]="{ HTML: sizesHtml }"
        >
          <div class="flex flex-wrap items-end gap-3">
            <button nxpButton size="sm">Small</button>
            <button nxpButton size="md">Medium</button>
            <button nxpButton size="lg">Large</button>
          </div>
        </nxp-doc-example>

        <!-- ── Icons (iconStart / iconEnd) ────────────────────────────────── -->
        <nxp-doc-example
          heading="With icons"
          description="Pass an SVG string to [iconStart] / [iconEnd]. Padding tightens automatically on the icon side, and the stroke thickens 1.5 → 2 on hover."
          [content]="{ HTML: iconsHtml, TypeScript: iconsTs }"
        >
          <div class="flex flex-wrap items-center gap-3">
            <button nxpButton variant="primary" [iconStart]="icons.plus">
              New project
            </button>
            <button nxpButton variant="secondary" [iconEnd]="icons.arrowRight">
              Continue
            </button>
            <button nxpButton variant="tertiary" [iconStart]="icons.download">
              Download
            </button>
            <button
              nxpButton
              variant="ghost"
              [iconStart]="icons.sparkles"
              [iconEnd]="icons.arrowUpRight"
            >
              Ask AI
            </button>
            <button nxpButton variant="destructive" [iconStart]="icons.trash">
              Delete
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── Icon-only ──────────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Icon-only"
          description="Square sizes (icon-sm 28px · icon 32px · icon-lg 40px) project the icon as content. Always pair with an aria-label for screen readers."
          [content]="{ HTML: iconOnlyHtml }"
        >
          <div class="flex flex-wrap items-center gap-3">
            <button
              nxpButton
              size="icon-sm"
              variant="secondary"
              aria-label="Add"
            >
              <nxp-icon icon="ri-add-line" size="xs" />
            </button>
            <button nxpButton size="icon" variant="secondary" aria-label="Add">
              <nxp-icon icon="ri-add-line" size="sm" />
            </button>
            <button
              nxpButton
              size="icon-lg"
              variant="secondary"
              aria-label="Add"
            >
              <nxp-icon icon="ri-add-line" size="md" />
            </button>

            <span class="mx-1 h-6 w-px bg-bg-neutral-2"></span>

            <button nxpButton size="icon" variant="primary" aria-label="Search">
              <nxp-icon icon="ri-search-line" size="sm" />
            </button>
            <button
              nxpButton
              size="icon"
              variant="tertiary"
              aria-label="Settings"
            >
              <nxp-icon icon="ri-settings-3-line" size="sm" />
            </button>
            <button nxpButton size="icon" variant="ghost" aria-label="More">
              <nxp-icon icon="ri-more-2-fill" size="sm" />
            </button>
            <button
              nxpButton
              size="icon"
              variant="destructive"
              aria-label="Delete"
            >
              <nxp-icon icon="ri-delete-bin-6-line" size="sm" />
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── States ─────────────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Loading & disabled"
          description="[loading] overlays the figure-8 spinner while preserving the button's width; the native disabled attribute dims to 50%."
          [content]="{ HTML: statesHtml }"
        >
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-3">
              @for (v of variants; track v) {
                <button
                  nxpButton
                  [variant]="v"
                  [loading]="true"
                  class="capitalize"
                >
                  {{ v }}
                </button>
              }
            </div>
            <div class="flex flex-wrap items-center gap-3">
              @for (v of variants; track v) {
                <button nxpButton [variant]="v" disabled class="capitalize">
                  {{ v }}
                </button>
              }
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── As anchor ──────────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="As a link"
          description="The same directive works on <a nxpButton>, so it stays a real anchor — routerLink, href and target all work, with no role hacks."
          [content]="{ HTML: anchorHtml }"
        >
          <div class="flex flex-wrap items-center gap-3">
            <a
              nxpButton
              variant="primary"
              routerLink="/"
              [iconStart]="icons.arrowRight"
            >
              Back home
            </a>
            <a
              nxpButton
              variant="secondary"
              href="https://nx.dev"
              target="_blank"
              rel="noreferrer"
              [iconEnd]="icons.arrowUpRight"
            >
              Nx docs
            </a>
            <a nxpButton variant="ghost" routerLink="/badge">Badge page</a>
          </div>
        </nxp-doc-example>

        <!-- ── HERO: Deploy pipeline (Develop → Preview → Ship) ───────────── -->
        <nxp-doc-example
          heading="Deploy pipeline"
          description="Vercel's signature workflow. The accent palette (develop blue, preview pink, ship red) is applied to CTAs via the [class] override — contextual, never decorative. Click through the stages."
          [content]="{ HTML: deployHtml, TypeScript: deployTs }"
        >
          <div class="w-full">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <!-- Develop -->
              <div class="rounded-lg bg-bg-base p-5 shadow-card">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-accent-develop"></span>
                  <span
                    class="font-mono text-[11px] font-medium uppercase tracking-wide text-accent-develop"
                  >
                    Develop
                  </span>
                  @if (deployStage() > 0) {
                    <nxp-icon
                      icon="ri-check-line"
                      size="sm"
                      class="ml-auto text-accent-develop"
                    />
                  }
                </div>
                <h4
                  class="mt-3 text-[15px] font-semibold tracking-card text-text-primary"
                >
                  Build the branch
                </h4>
                <p class="mt-1 text-[13px] leading-relaxed text-text-secondary">
                  Compile and run checks on
                  <code class="text-text-primary">feat/api</code>.
                </p>
                <button
                  nxpButton
                  size="sm"
                  [class]="'mt-4 w-full ' + DEVELOP_CTA"
                  [iconStart]="icons.gitBranch"
                  [disabled]="deployStage() !== 0"
                  (click)="advanceDeploy(1)"
                >
                  Run build
                </button>
              </div>

              <!-- Preview -->
              <div class="rounded-lg bg-bg-base p-5 shadow-card">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-accent-preview"></span>
                  <span
                    class="font-mono text-[11px] font-medium uppercase tracking-wide text-accent-preview"
                  >
                    Preview
                  </span>
                  @if (deployStage() > 1) {
                    <nxp-icon
                      icon="ri-check-line"
                      size="sm"
                      class="ml-auto text-accent-preview"
                    />
                  }
                </div>
                <h4
                  class="mt-3 text-[15px] font-semibold tracking-card text-text-primary"
                >
                  Open a preview
                </h4>
                <p class="mt-1 text-[13px] leading-relaxed text-text-secondary">
                  Share a deployment URL for review.
                </p>
                <button
                  nxpButton
                  size="sm"
                  [class]="'mt-4 w-full ' + PREVIEW_CTA"
                  [iconStart]="icons.eye"
                  [disabled]="deployStage() !== 1"
                  (click)="advanceDeploy(2)"
                >
                  Open preview
                </button>
              </div>

              <!-- Ship -->
              <div class="rounded-lg bg-bg-base p-5 shadow-card">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-accent-ship"></span>
                  <span
                    class="font-mono text-[11px] font-medium uppercase tracking-wide text-accent-ship"
                  >
                    Ship
                  </span>
                  @if (deployStage() > 2) {
                    <nxp-icon
                      icon="ri-check-line"
                      size="sm"
                      class="ml-auto text-accent-ship"
                    />
                  }
                </div>
                <h4
                  class="mt-3 text-[15px] font-semibold tracking-card text-text-primary"
                >
                  Ship to production
                </h4>
                <p class="mt-1 text-[13px] leading-relaxed text-text-secondary">
                  Promote the preview to your domain.
                </p>
                <button
                  nxpButton
                  size="sm"
                  [class]="'mt-4 w-full ' + SHIP_CTA"
                  [iconStart]="icons.rocket"
                  [disabled]="deployStage() !== 2"
                  (click)="advanceDeploy(3)"
                >
                  Ship it
                </button>
              </div>
            </div>

            <div class="mt-4 flex items-center gap-3">
              <p class="text-[13px] text-text-tertiary">
                @switch (deployStage()) {
                  @case (0) {
                    Ready to build.
                  }
                  @case (1) {
                    Built — open a preview.
                  }
                  @case (2) {
                    Preview is live — ship when ready.
                  }
                  @default {
                    Shipped to production.
                  }
                }
              </p>
              @if (deployStage() > 0) {
                <button
                  nxpButton
                  variant="ghost"
                  size="sm"
                  class="ml-auto"
                  [iconStart]="icons.reset"
                  (click)="advanceDeploy(0)"
                >
                  Reset
                </button>
              }
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Pricing card ───────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Pricing card"
          description="Buttons inside the full shadow-as-border card stack (the inner #fafafa ring gives the Vercel inner glow). Primary CTA + ghost secondary, both full-width."
          [content]="{ HTML: pricingHtml }"
        >
          <div
            class="mx-auto w-full max-w-sm rounded-xl bg-bg-base p-6 shadow-card-lg"
          >
            <div class="flex items-center justify-between">
              <h4
                class="text-[15px] font-semibold tracking-card text-text-primary"
              >
                Pro
              </h4>
              <span
                class="rounded-full bg-badge-blue-bg px-2.5 py-0.5 text-[11px] font-medium text-badge-blue-text"
              >
                Popular
              </span>
            </div>
            <div class="mt-3 flex items-baseline gap-1">
              <span
                class="text-4xl font-semibold tracking-hero text-text-primary"
              >
                $20
              </span>
              <span class="text-[13px] text-text-tertiary">/month</span>
            </div>
            <div class="my-5 h-px bg-bg-neutral-2"></div>
            <ul class="space-y-2.5 text-[13px] text-text-secondary">
              <li class="flex items-center gap-2">
                <nxp-icon
                  icon="ri-check-line"
                  size="xs"
                  class="text-text-primary"
                />
                Unlimited projects
              </li>
              <li class="flex items-center gap-2">
                <nxp-icon
                  icon="ri-check-line"
                  size="xs"
                  class="text-text-primary"
                />
                100 GB bandwidth
              </li>
              <li class="flex items-center gap-2">
                <nxp-icon
                  icon="ri-check-line"
                  size="xs"
                  class="text-text-primary"
                />
                Advanced analytics
              </li>
            </ul>
            <div class="mt-6 space-y-2">
              <button
                nxpButton
                variant="primary"
                size="lg"
                class="w-full"
                [iconEnd]="icons.arrowRight"
              >
                Start deploying
              </button>
              <button nxpButton variant="ghost" size="lg" class="w-full">
                Contact sales
              </button>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Command bar / toolbar ──────────────────────────────────────── -->
        <nxp-doc-example
          heading="Command bar"
          description="A ⌘K surface above a ghost toolbar — text + icon ghost buttons, a divider, then an icon-only ghost group. The dense, editorial developer-tool register."
          [content]="{ HTML: commandHtml }"
        >
          <div
            class="mx-auto w-full max-w-md overflow-hidden rounded-xl bg-bg-base shadow-card-lg"
          >
            <div
              class="flex items-center gap-2 border-b border-bg-neutral-2 px-4 py-3"
            >
              <nxp-icon
                icon="ri-search-line"
                size="sm"
                class="text-text-quaternary"
              />
              <span class="text-[13px] text-text-quaternary">
                Search or jump to…
              </span>
              <kbd
                class="ml-auto rounded bg-bg-neutral-1 px-1.5 py-0.5 font-mono text-[11px] text-text-tertiary"
              >
                ⌘K
              </kbd>
            </div>
            <div class="flex items-center gap-1 px-3 py-2.5">
              <button
                nxpButton
                variant="ghost"
                size="sm"
                [iconStart]="icons.plus"
              >
                New
              </button>
              <button
                nxpButton
                variant="ghost"
                size="sm"
                [iconStart]="icons.rocket"
              >
                Deploy
              </button>
              <span class="mx-1 h-5 w-px bg-bg-neutral-2"></span>
              <button
                nxpButton
                variant="ghost"
                size="icon-sm"
                aria-label="Undo"
              >
                <nxp-icon icon="ri-arrow-go-back-line" size="sm" />
              </button>
              <button
                nxpButton
                variant="ghost"
                size="icon-sm"
                aria-label="Redo"
              >
                <nxp-icon icon="ri-arrow-go-forward-line" size="sm" />
              </button>
              <button
                nxpButton
                variant="ghost"
                size="icon-sm"
                class="ml-auto"
                aria-label="More"
              >
                <nxp-icon icon="ri-more-2-fill" size="sm" />
              </button>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── Animated labels (TextMorph) ────────────────────────────────── -->
        <nxp-doc-example
          heading="Animated labels"
          description="Compose nxp-text-morph inside the label for FLIP-based text transitions. Click each button to cycle its states."
          [content]="{ HTML: morphHtml, TypeScript: morphTs }"
        >
          <div class="flex flex-wrap items-center gap-4">
            <button nxpButton variant="primary" (click)="cycleSubmit()">
              <nxp-text-morph [text]="submitLabel()" />
            </button>
            <button
              nxpButton
              [variant]="
                followLabel() === 'Following' ? 'secondary' : 'tertiary'
              "
              [iconStart]="
                followLabel() === 'Following' ? icons.check : icons.plus
              "
              (click)="toggleFollow()"
            >
              <nxp-text-morph [text]="followLabel()" />
            </button>
            <button
              nxpButton
              [variant]="
                deleteLabel() === 'Delete' ? 'destructive' : 'secondary'
              "
              (click)="cycleDelete()"
            >
              <nxp-text-morph [text]="deleteLabel()" />
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── Async flow ─────────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Async action"
          description="A realistic save flow: idle → loading spinner → success (check + morphed label) → auto-reset. Built from [loading], [iconStart] and nxp-text-morph."
          [content]="{ HTML: asyncHtml, TypeScript: asyncTs }"
        >
          <div class="flex flex-wrap items-center gap-4">
            <button
              nxpButton
              variant="primary"
              [loading]="asyncState() === 'loading'"
              [disabled]="asyncState() === 'done'"
              [iconStart]="asyncState() === 'done' ? icons.check : ''"
              (click)="runAsync()"
            >
              <nxp-text-morph [text]="asyncLabel()" />
            </button>
            <p class="text-[13px] text-text-tertiary">
              Click to simulate saving — the button parks at “Saved”, then
              resets.
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── Dark-mode panel ────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Dark surface"
          description="Every token flips under the .dark class — this panel forces dark mode locally, so the buttons adapt regardless of the page theme."
          [content]="{ HTML: darkHtml }"
        >
          <div class="dark rounded-xl bg-bg-base p-6 shadow-card">
            <p
              class="mb-4 font-mono text-[11px] uppercase tracking-wide text-text-tertiary"
            >
              Dark surface
            </p>
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-3">
                @for (v of variants; track v) {
                  <button nxpButton [variant]="v" class="capitalize">
                    {{ v }}
                  </button>
                }
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <button nxpButton variant="primary" [iconStart]="icons.rocket">
                  Deploy
                </button>
                <button
                  nxpButton
                  variant="secondary"
                  [iconEnd]="icons.arrowRight"
                >
                  Continue
                </button>
                <button nxpButton variant="primary" [loading]="true">
                  Loading
                </button>
                <button nxpButton variant="ghost" disabled>Disabled</button>
              </div>
            </div>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-button-api
          [(variant)]="variant"
          [(size)]="size"
          [(loading)]="loading"
          [(disabled)]="disabled"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class ButtonDemoComponent {
  // ── Inline SVG icon set for the iconStart / iconEnd slots ──────────────────
  protected readonly icons = {
    plus: geistIcon('<path d="M12 5v14"/><path d="M5 12h14"/>'),
    arrowRight: geistIcon('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
    arrowUpRight: geistIcon('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'),
    download: geistIcon(
      '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    ),
    trash: geistIcon(
      '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="m6 7 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
    ),
    sparkles: geistIcon(
      '<path d="M12 3c.3 3.6 2.4 5.7 6 6-3.6.3-5.7 2.4-6 6-.3-3.6-2.4-5.7-6-6 3.6-.3 5.7-2.4 6-6Z"/>',
    ),
    check: geistIcon('<path d="M20 6 9 17l-5-5"/>'),
    gitBranch: geistIcon(
      '<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    ),
    eye: geistIcon(
      '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    ),
    rocket: geistIcon(
      '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    ),
    reset: geistIcon(
      '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    ),
  };

  // Accent-CTA class recipes referenced from the template.
  protected readonly DEVELOP_CTA = DEVELOP_CTA;
  protected readonly PREVIEW_CTA = PREVIEW_CTA;
  protected readonly SHIP_CTA = SHIP_CTA;

  // ── Playground state — shared with the API tab via two-way bindings ────────
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('md');
  readonly loading = signal(false);
  readonly disabled = signal(false);

  readonly isIconSize = computed(() => this.size().startsWith('icon'));

  readonly variants: ButtonVariant[] = [
    'primary',
    'secondary',
    'tertiary',
    'ghost',
    'destructive',
  ];

  // ── Deploy pipeline state (0 ready · 1 built · 2 previewed · 3 shipped) ────
  readonly deployStage = signal(0);
  advanceDeploy(stage: number): void {
    this.deployStage.set(stage);
  }

  // ── TextMorph label demos ──────────────────────────────────────────────────
  readonly submitLabel = signal('Submit');
  readonly followLabel = signal('Follow');
  readonly deleteLabel = signal('Delete');

  cycleSubmit(): void {
    this.submitLabel.update((v) =>
      v === 'Submit'
        ? 'Submitting…'
        : v === 'Submitting…'
          ? 'Submitted!'
          : 'Submit',
    );
  }

  toggleFollow(): void {
    this.followLabel.update((v) =>
      v === 'Following' ? 'Follow' : 'Following',
    );
  }

  cycleDelete(): void {
    this.deleteLabel.update((v) =>
      v === 'Delete'
        ? 'Are you sure?'
        : v === 'Are you sure?'
          ? 'Deleted!'
          : 'Delete',
    );
  }

  // ── Async action demo ──────────────────────────────────────────────────────
  readonly asyncState = signal<'idle' | 'loading' | 'done'>('idle');
  readonly asyncLabel = computed(
    () =>
      ({ idle: 'Save changes', loading: 'Saving…', done: 'Saved' })[
        this.asyncState()
      ],
  );

  runAsync(): void {
    if (this.asyncState() !== 'idle') return;
    this.asyncState.set('loading');
    setTimeout(() => {
      this.asyncState.set('done');
      setTimeout(() => this.asyncState.set('idle'), 1400);
    }, 1500);
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ─────────────
  readonly playgroundHtml = `<button
  nxpButton
  [variant]="variant()"
  [size]="size()"
  [loading]="loading()"
  [disabled]="disabled()"
  [iconStart]="isIconSize() ? '' : rocketSvg"
>
  @if (isIconSize()) {
    <nxp-icon icon="ri-rocket-2-line" size="sm" />
  } @else {
    Deploy
  }
</button>`;

  readonly playgroundTs = `import { Component, computed, signal } from '@angular/core';
import { ButtonComponent } from '@ngxpro/components/button';
import type { ButtonSize, ButtonVariant } from '@ngxpro/components/button';

@Component({
  selector: 'app-playground',
  imports: [ButtonComponent],
  templateUrl: './playground.html',
})
export class PlaygroundButtonExample {
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('md');
  readonly loading = signal(false);
  readonly disabled = signal(false);
  readonly isIconSize = computed(() => this.size().startsWith('icon'));
}`;

  readonly variantsHtml = `<button nxpButton variant="primary">Primary</button>
<button nxpButton variant="secondary">Secondary</button>
<button nxpButton variant="tertiary">Tertiary</button>
<button nxpButton variant="ghost">Ghost</button>
<button nxpButton variant="destructive">Destructive</button>`;

  readonly sizesHtml = `<button nxpButton size="sm">Small</button>
<button nxpButton size="md">Medium</button>
<button nxpButton size="lg">Large</button>`;

  readonly iconsHtml = `<button nxpButton variant="primary" [iconStart]="icons.plus">New project</button>
<button nxpButton variant="secondary" [iconEnd]="icons.arrowRight">Continue</button>
<button nxpButton variant="tertiary" [iconStart]="icons.download">Download</button>
<button nxpButton variant="ghost" [iconStart]="icons.sparkles" [iconEnd]="icons.arrowUpRight">Ask AI</button>
<button nxpButton variant="destructive" [iconStart]="icons.trash">Delete</button>`;

  readonly iconsTs = `// iconStart / iconEnd take an HTML string, rendered via innerHTML.
// Use currentColor + fill="none" so the glyph inherits the button color.
const svg = (paths: string) =>
  \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\${paths}</svg>\`;

readonly icons = {
  plus: svg('<path d="M12 5v14"/><path d="M5 12h14"/>'),
  arrowRight: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  download: svg('<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>'),
  // …
};`;

  readonly iconOnlyHtml = `<!-- Icon goes in the content slot; iconStart/iconEnd are ignored for icon sizes -->
<button nxpButton size="icon-sm" variant="secondary" aria-label="Add">
  <nxp-icon icon="ri-add-line" size="xs" />
</button>
<button nxpButton size="icon" variant="secondary" aria-label="Add">
  <nxp-icon icon="ri-add-line" size="sm" />
</button>
<button nxpButton size="icon-lg" variant="secondary" aria-label="Add">
  <nxp-icon icon="ri-add-line" size="md" />
</button>`;

  readonly statesHtml = `<!-- Loading: spinner overlay, width preserved -->
<button nxpButton variant="primary" [loading]="true">Primary</button>

<!-- Disabled: native attribute -->
<button nxpButton variant="primary" disabled>Primary</button>`;

  readonly anchorHtml = `<a nxpButton variant="primary" routerLink="/" [iconStart]="icons.arrowRight">Back home</a>
<a nxpButton variant="secondary" href="https://nx.dev" target="_blank" rel="noreferrer"
   [iconEnd]="icons.arrowUpRight">Nx docs</a>
<a nxpButton variant="ghost" routerLink="/badge">Badge page</a>`;

  readonly deployHtml = `<!-- Accent CTAs via the [class] override — the variant stays 'primary',
     the workflow color wins through cx()/twMerge. -->
<button
  nxpButton
  size="sm"
  class="w-full bg-accent-develop text-white hover:bg-accent-develop/90 active:bg-accent-develop/80"
  [iconStart]="icons.gitBranch"
  [disabled]="deployStage() !== 0"
  (click)="advanceDeploy(1)"
>
  Run build
</button>
<!-- …repeat with accent-preview and accent-ship for the next two stages -->`;

  readonly deployTs = `readonly deployStage = signal(0); // 0 ready · 1 built · 2 previewed · 3 shipped

advanceDeploy(stage: number): void {
  this.deployStage.set(stage);
}`;

  readonly pricingHtml = `<div class="w-full max-w-sm rounded-xl bg-bg-base p-6 shadow-card-lg">
  <!-- …price, features… -->
  <div class="mt-6 space-y-2">
    <button nxpButton variant="primary" size="lg" class="w-full" [iconEnd]="icons.arrowRight">
      Start deploying
    </button>
    <button nxpButton variant="ghost" size="lg" class="w-full">Contact sales</button>
  </div>
</div>`;

  readonly commandHtml = `<div class="flex items-center gap-1 px-3 py-2.5">
  <button nxpButton variant="ghost" size="sm" [iconStart]="icons.plus">New</button>
  <button nxpButton variant="ghost" size="sm" [iconStart]="icons.rocket">Deploy</button>
  <span class="mx-1 h-5 w-px bg-bg-neutral-2"></span>
  <button nxpButton variant="ghost" size="icon-sm" aria-label="Undo">
    <nxp-icon icon="ri-arrow-go-back-line" size="sm" />
  </button>
  <button nxpButton variant="ghost" size="icon-sm" aria-label="Redo">
    <nxp-icon icon="ri-arrow-go-forward-line" size="sm" />
  </button>
</div>`;

  readonly morphHtml = `<button nxpButton variant="primary" (click)="cycleSubmit()">
  <nxp-text-morph [text]="submitLabel()" />
</button>

<button
  nxpButton
  [variant]="followLabel() === 'Following' ? 'secondary' : 'tertiary'"
  [iconStart]="followLabel() === 'Following' ? icons.check : icons.plus"
  (click)="toggleFollow()"
>
  <nxp-text-morph [text]="followLabel()" />
</button>`;

  readonly morphTs = `readonly submitLabel = signal('Submit');

cycleSubmit(): void {
  this.submitLabel.update((v) =>
    v === 'Submit' ? 'Submitting…' : v === 'Submitting…' ? 'Submitted!' : 'Submit',
  );
}`;

  readonly asyncHtml = `<button
  nxpButton
  variant="primary"
  [loading]="asyncState() === 'loading'"
  [disabled]="asyncState() === 'done'"
  [iconStart]="asyncState() === 'done' ? icons.check : ''"
  (click)="runAsync()"
>
  <nxp-text-morph [text]="asyncLabel()" />
</button>`;

  readonly asyncTs = `readonly asyncState = signal<'idle' | 'loading' | 'done'>('idle');
readonly asyncLabel = computed(
  () => ({ idle: 'Save changes', loading: 'Saving…', done: 'Saved' })[this.asyncState()],
);

runAsync(): void {
  if (this.asyncState() !== 'idle') return;
  this.asyncState.set('loading');
  setTimeout(() => {
    this.asyncState.set('done');
    setTimeout(() => this.asyncState.set('idle'), 1400);
  }, 1500);
}`;

  readonly darkHtml = `<!-- Force dark tokens locally; buttons adapt regardless of page theme -->
<div class="dark rounded-xl bg-bg-base p-6 shadow-card">
  <button nxpButton variant="primary" [iconStart]="icons.rocket">Deploy</button>
  <button nxpButton variant="secondary" [iconEnd]="icons.arrowRight">Continue</button>
  <button nxpButton variant="primary" [loading]="true">Loading</button>
  <button nxpButton variant="ghost" disabled>Disabled</button>
</div>`;
}
