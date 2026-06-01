import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  type WritableSignal,
} from '@angular/core';
import {
  NxpDropdown,
  type NxpDropdownAlign,
  type NxpDropdownWidth,
} from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DropdownApiComponent } from './dropdown-api.component';

type DropdownDirection = 'top' | 'bottom' | null;
type EnvId = 'development' | 'preview' | 'production';

interface DropdownNotification {
  readonly id: number;
  readonly actor: string;
  readonly action: string;
  readonly time: string;
  readonly icon: string;
  readonly read: boolean;
}

/**
 * Dropdown showcase. The panel chrome (surface, radius, shadow-card, scale-in
 * animation) is supplied by `nxp-dropdown` itself — every example below only
 * projects content, styled with the Vercel/Geist semantic tokens
 * (`text-text-*`, `bg-bg-*`, `shadow-border`, the workflow accent palette).
 *
 * Together the examples exercise the full directive surface: click + keyboard
 * nav, hover, right-click context, text-selection anchoring, fixed-width
 * (trigger-matched) panels, inner-scroll `maxHeight`, and the positioning
 * playground wired two-way to the API tab.
 */
@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...NxpDropdown,
    NxpIconComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DropdownApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Dropdown"
      package="cdk"
      type="directive"
      path="cdk/dropdown"
    >
      <p class="max-w-2xl text-base leading-relaxed text-text-secondary">
        A portal-based overlay that anchors any content to any element. One
        directive,
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >[nxpDropdown]</code
        >, composes with triggers for click, hover, right-click context, and
        text selection — plus rich positioning, fixed-width panels, and keyboard
        navigation. Backed by
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >NxpDropdown</code
        >
        from
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >&#64;ngxpro/cdk</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ─────────────────────────  Account menu  ───────────────────────── -->
        <nxp-doc-example
          heading="Account menu"
          description="The canonical click-to-open menu. Click the trigger to toggle; arrow keys move focus through items; Escape closes. Items carry icons, ⌘ shortcuts, and a destructive action — all on semantic tokens."
          [content]="{ HTML: accountHtml, TypeScript: accountTs }"
        >
          <div
            class="flex min-h-44 w-full flex-col items-center justify-center gap-4"
          >
            <button
              type="button"
              aria-haspopup="menu"
              class="group inline-flex items-center gap-2 rounded-full bg-bg-base p-1 pr-3 text-sm font-medium text-text-primary shadow-border transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              [nxpDropdown]="accountMenu"
              nxpDropdownAuto
              [nxpDropdownAlign]="'end'"
              [nxpDropdownOffset]="8"
            >
              <span
                class="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-text-on-accent"
                >MK</span
              >
              Mara
              <nxp-icon
                icon="ri-arrow-down-s-line"
                size="sm"
                class="text-text-tertiary transition-transform duration-fast [.nxp-dropdown-open_&]:rotate-180"
              />
            </button>

            <p class="h-4 text-xs text-text-tertiary">
              @if (lastAction(); as action) {
                <span
                  class="inline-flex items-center gap-1 text-text-secondary"
                >
                  <nxp-icon
                    icon="ri-check-line"
                    size="xs"
                    class="text-accent-develop"
                  />
                  {{ action }}
                </span>
              }
            </p>
          </div>

          <ng-template #accountMenu let-close>
            <div class="w-64 p-1.5">
              <div class="flex items-center gap-3 px-2 py-2">
                <span
                  class="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-text-on-accent"
                  >MK</span
                >
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-text-primary">
                    Mara Kovač
                  </p>
                  <p class="truncate text-xs text-text-tertiary">
                    mara&#64;acme.dev
                  </p>
                </div>
                <span
                  class="rounded-full bg-badge-blue-bg px-2 py-0.5 text-[11px] font-medium text-badge-blue-text"
                  >Pro</span
                >
              </div>

              <div class="my-1 h-px bg-border-normal"></div>

              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Opened Dashboard'); close()"
              >
                <nxp-icon
                  icon="ri-dashboard-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Dashboard
                <kbd class="ml-auto font-mono text-[11px] text-text-quaternary"
                  >⌘D</kbd
                >
              </button>

              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Opened Settings'); close()"
              >
                <nxp-icon
                  icon="ri-settings-3-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Settings
                <kbd class="ml-auto font-mono text-[11px] text-text-quaternary"
                  >⌘S</kbd
                >
              </button>

              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Opened command menu'); close()"
              >
                <nxp-icon
                  icon="ri-command-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Command menu
                <kbd class="ml-auto font-mono text-[11px] text-text-quaternary"
                  >⌘K</kbd
                >
              </button>

              <div class="my-1 h-px bg-border-normal"></div>

              <button
                type="button"
                class="flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-status-negative outline-none transition-colors duration-fast hover:bg-status-negative-pale focus-visible:bg-status-negative-pale"
                (click)="run('Signed out'); close()"
              >
                <nxp-icon icon="ri-logout-box-r-line" size="sm" />
                Sign out
                <kbd
                  class="ml-auto font-mono text-[11px] text-status-negative/60"
                  >⇧⌘Q</kbd
                >
              </button>
            </div>
          </ng-template>
        </nxp-doc-example>

        <!-- ────────────────────  Promote to Production  ──────────────────── -->
        <nxp-doc-example
          heading="Promote deployment"
          description="With nxpDropdownLimitWidth='fixed' the panel matches the trigger's width exactly — ideal for select-like menus. The three rows render the Develop → Preview → Ship workflow palette from the design system, used contextually."
          [content]="{ HTML: promoteHtml, TypeScript: promoteTs }"
        >
          <div
            class="flex min-h-44 w-full flex-col items-center justify-center gap-3"
          >
            <button
              type="button"
              aria-haspopup="menu"
              class="flex w-full max-w-xs items-center justify-between gap-3 rounded-m bg-primary px-3.5 py-2.5 text-sm font-medium text-text-on-accent transition-colors duration-fast hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              [nxpDropdown]="promoteMenu"
              nxpDropdownAuto
              [nxpDropdownLimitWidth]="'fixed'"
              [nxpDropdownAlign]="'start'"
              [nxpDropdownOffset]="8"
            >
              <span class="inline-flex items-center gap-2">
                <nxp-icon icon="ri-rocket-2-line" size="sm" />
                Promote deployment
              </span>
              <nxp-icon
                icon="ri-arrow-down-s-line"
                size="sm"
                class="opacity-70 transition-transform duration-fast [.nxp-dropdown-open_&]:rotate-180"
              />
            </button>

            <p class="h-4 text-xs text-text-tertiary">
              @if (promotedLabel(); as label) {
                Promoted
                <code class="font-mono text-text-secondary">build_a1f9c2</code>
                to
                <span class="font-medium text-text-secondary">{{ label }}</span>
              }
            </p>
          </div>

          <ng-template #promoteMenu let-close>
            <div class="p-1.5">
              <p
                class="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
              >
                Promote to
              </p>

              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-m px-2 py-2 text-left outline-none transition-colors duration-fast hover:bg-bg-neutral-1 focus-visible:bg-bg-neutral-1"
                (click)="promote('development'); close()"
              >
                <span
                  class="size-2 shrink-0 rounded-full bg-accent-develop"
                ></span>
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="text-sm font-medium text-text-primary"
                    >Development</span
                  >
                  <span
                    class="truncate font-mono text-[11px] text-text-tertiary"
                    >feat/edge-runtime</span
                  >
                </span>
                @if (promoted() === 'development') {
                  <nxp-icon
                    icon="ri-check-line"
                    size="sm"
                    class="text-text-primary"
                  />
                }
              </button>

              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-m px-2 py-2 text-left outline-none transition-colors duration-fast hover:bg-bg-neutral-1 focus-visible:bg-bg-neutral-1"
                (click)="promote('preview'); close()"
              >
                <span
                  class="size-2 shrink-0 rounded-full bg-accent-preview"
                ></span>
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="text-sm font-medium text-text-primary"
                    >Preview</span
                  >
                  <span
                    class="truncate font-mono text-[11px] text-text-tertiary"
                    >staging.acme.dev</span
                  >
                </span>
                @if (promoted() === 'preview') {
                  <nxp-icon
                    icon="ri-check-line"
                    size="sm"
                    class="text-text-primary"
                  />
                }
              </button>

              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-m px-2 py-2 text-left outline-none transition-colors duration-fast hover:bg-bg-neutral-1 focus-visible:bg-bg-neutral-1"
                (click)="promote('production'); close()"
              >
                <span
                  class="size-2 shrink-0 rounded-full bg-accent-ship"
                ></span>
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="text-sm font-medium text-text-primary"
                    >Production</span
                  >
                  <span
                    class="truncate font-mono text-[11px] text-text-tertiary"
                    >acme.dev</span
                  >
                </span>
                @if (promoted() === 'production') {
                  <nxp-icon
                    icon="ri-check-line"
                    size="sm"
                    class="text-text-primary"
                  />
                }
              </button>
            </div>
          </ng-template>
        </nxp-doc-example>

        <!-- ─────────────────────────  Notifications  ──────────────────────── -->
        <nxp-doc-example
          heading="Notifications"
          description="nxpDropdownMaxHeight caps the panel and hands overflow to the built-in inner scroll panel. The header is sticky inside that scroll area, and align='end' pins the panel to the trigger's right edge."
          [content]="{ HTML: notificationsHtml, TypeScript: notificationsTs }"
        >
          <div class="flex min-h-44 w-full items-start justify-center pt-2">
            <button
              type="button"
              aria-label="Notifications"
              class="relative inline-flex size-9 items-center justify-center rounded-m bg-bg-base text-text-secondary shadow-border transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              [nxpDropdown]="notifMenu"
              nxpDropdownAuto
              [nxpDropdownAlign]="'end'"
              [nxpDropdownMaxHeight]="360"
              [nxpDropdownOffset]="10"
            >
              <nxp-icon icon="ri-notification-3-line" size="md" />
              @if (unread() > 0) {
                <span
                  class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-negative px-1 text-[10px] font-semibold text-white"
                  >{{ unread() }}</span
                >
              }
            </button>
          </div>

          <ng-template #notifMenu>
            <div class="w-80">
              <div
                class="sticky top-0 z-10 flex items-center justify-between border-b border-border-normal bg-bg-base px-3 py-2.5"
              >
                <p class="text-sm font-semibold text-text-primary">
                  Notifications
                </p>
                <button
                  type="button"
                  class="text-xs font-medium text-text-action underline-offset-2 transition hover:underline disabled:cursor-not-allowed disabled:text-text-quaternary disabled:no-underline"
                  [disabled]="unread() === 0"
                  (click)="markAllRead()"
                >
                  Mark all read
                </button>
              </div>

              <ul class="p-1.5">
                @for (n of notifications(); track n.id) {
                  <li
                    class="flex gap-3 rounded-m px-2 py-2 transition-colors duration-fast hover:bg-bg-neutral-1"
                  >
                    <span
                      class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-bg-neutral-1 text-text-secondary"
                    >
                      <nxp-icon [icon]="n.icon" size="sm" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm leading-snug text-text-primary">
                        <span class="font-medium">{{ n.actor }}</span>
                        {{ n.action }}
                      </p>
                      <p class="mt-0.5 text-xs text-text-tertiary">
                        {{ n.time }}
                      </p>
                    </div>
                    @if (!n.read) {
                      <span
                        class="mt-1.5 size-2 shrink-0 rounded-full bg-accent-develop"
                        aria-label="Unread"
                      ></span>
                    }
                  </li>
                }
              </ul>
            </div>
          </ng-template>
        </nxp-doc-example>

        <!-- ──────────────────────────  Hover card  ────────────────────────── -->
        <nxp-doc-example
          heading="Hover card"
          description="nxpDropdownHover opens on pointer-in and closes on pointer-out, with show/hide delays (wired to the API tab) that prevent flicker as the cursor transits the trigger. The panel stays open while you move into it."
          [content]="{ HTML: hoverHtml, TypeScript: hoverTs }"
        >
          <div class="flex min-h-44 w-full items-center justify-center">
            <p
              class="max-w-md text-center text-sm leading-relaxed text-text-secondary"
            >
              Last reviewed by
              <button
                type="button"
                class="rounded-sm font-medium text-text-action underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpDropdown]="profileCard"
                nxpDropdownAuto
                nxpDropdownHover
                [nxpDropdownShowDelay]="hoverShowDelay()"
                [nxpDropdownHideDelay]="hoverHideDelay()"
                [nxpDropdownAlign]="'center'"
                [nxpDropdownOffset]="8"
              >
                &#64;marcus
              </button>
              on the edge-runtime pull request.
            </p>
          </div>

          <ng-template #profileCard>
            <div class="w-72 p-4">
              <div class="flex items-start gap-3">
                <span
                  class="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-text-on-accent"
                  >MA</span
                >
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-text-primary">
                    Marcus Andersson
                  </p>
                  <p class="truncate text-xs text-text-tertiary">
                    &#64;marcus · Staff Engineer
                  </p>
                </div>
              </div>

              <p class="mt-3 text-sm leading-relaxed text-text-secondary">
                Building the deploy pipeline and edge runtime. Probably
                reviewing your PR right now.
              </p>

              <div
                class="mt-3 flex items-center gap-4 text-xs text-text-tertiary"
              >
                <span
                  ><span class="font-semibold text-text-primary">1.2k</span>
                  followers</span
                >
                <span
                  ><span class="font-semibold text-text-primary">318</span>
                  following</span
                >
              </div>

              @if (following()) {
                <button
                  type="button"
                  class="mt-4 flex w-full items-center justify-center gap-1.5 rounded-m bg-bg-base px-3 py-2 text-sm font-medium text-text-primary shadow-border transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  (click)="following.set(false)"
                >
                  <nxp-icon icon="ri-check-line" size="sm" />
                  Following
                </button>
              } @else {
                <button
                  type="button"
                  class="mt-4 w-full rounded-m bg-primary px-3 py-2 text-sm font-medium text-text-on-accent transition-colors duration-fast hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  (click)="following.set(true)"
                >
                  Follow
                </button>
              }
            </div>
          </ng-template>
        </nxp-doc-example>

        <!-- ───────────────────────  Selection toolbar  ────────────────────── -->
        <nxp-doc-example
          heading="Selection toolbar"
          description="nxpDropdownSelection anchors the panel to the selected text range instead of the host. Select any words in the paragraph below to raise a formatting toolbar above the selection — a 'comment on selection' / rich-text pattern."
          [content]="{ HTML: selectionHtml, TypeScript: selectionTs }"
        >
          <div class="flex w-full justify-center">
            <div
              class="max-w-prose select-text rounded-lg bg-bg-base p-5 shadow-border"
              [nxpDropdown]="formatToolbar"
              nxpDropdownSelection
              [nxpDropdownSelectionPosition]="'selection'"
              [nxpDropdownDirection]="'top'"
              [nxpDropdownAlign]="'center'"
              [nxpDropdownOffset]="8"
            >
              <p class="text-sm leading-relaxed text-text-secondary">
                Edge functions run your code closest to your users, with zero
                cold starts and automatic scaling.
                <strong class="font-semibold text-text-primary"
                  >Select any part of this sentence</strong
                >
                with your cursor and a formatting toolbar will float into view,
                pinned to the selection — the same primitive that powers comment
                threads and inline annotation.
              </p>
            </div>
          </div>

          <ng-template #formatToolbar>
            <div class="flex items-center gap-0.5 p-1">
              <button
                type="button"
                aria-label="Bold"
                class="flex size-7 items-center justify-center rounded-m text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1"
                [class.bg-bg-neutral-1]="formats()['bold']"
                [class.text-text-primary]="formats()['bold']"
                (click)="toggleFormat('bold')"
              >
                <nxp-icon icon="ri-bold" size="sm" />
              </button>
              <button
                type="button"
                aria-label="Italic"
                class="flex size-7 items-center justify-center rounded-m text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1"
                [class.bg-bg-neutral-1]="formats()['italic']"
                [class.text-text-primary]="formats()['italic']"
                (click)="toggleFormat('italic')"
              >
                <nxp-icon icon="ri-italic" size="sm" />
              </button>
              <button
                type="button"
                aria-label="Underline"
                class="flex size-7 items-center justify-center rounded-m text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1"
                [class.bg-bg-neutral-1]="formats()['underline']"
                [class.text-text-primary]="formats()['underline']"
                (click)="toggleFormat('underline')"
              >
                <nxp-icon icon="ri-underline" size="sm" />
              </button>

              <span class="mx-1 h-5 w-px bg-border-normal"></span>

              <button
                type="button"
                aria-label="Add link"
                class="flex size-7 items-center justify-center rounded-m text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1"
              >
                <nxp-icon icon="ri-link" size="sm" />
              </button>
              <button
                type="button"
                aria-label="Inline code"
                class="flex size-7 items-center justify-center rounded-m text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1"
              >
                <nxp-icon icon="ri-code-line" size="sm" />
              </button>

              <span class="mx-1 h-5 w-px bg-border-normal"></span>

              <button
                type="button"
                class="flex h-7 items-center gap-1.5 rounded-m px-2 text-xs font-medium text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1"
              >
                <nxp-icon icon="ri-chat-1-line" size="sm" />
                Comment
              </button>
            </div>
          </ng-template>
        </nxp-doc-example>

        <!-- ──────────────────────────  Context menu  ──────────────────────── -->
        <nxp-doc-example
          heading="Context menu"
          description="nxpDropdownContext replaces the browser's native right-click menu, anchoring a custom dropdown at the pointer. Right-click the file card to open contextual actions with icons, shortcuts, and a destructive item."
          [content]="{ HTML: contextHtml, TypeScript: contextTs }"
        >
          <div class="flex w-full justify-center">
            <div
              class="flex w-full max-w-sm items-center gap-3 rounded-lg bg-bg-base p-4 shadow-border"
              [nxpDropdown]="contextMenu"
              nxpDropdownContext
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-m bg-bg-neutral-1 text-text-secondary"
              >
                <nxp-icon icon="ri-file-code-line" size="md" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-text-primary">
                  deploy-config.ts
                </p>
                <p class="truncate text-xs text-text-tertiary">
                  Edited 2h ago · 4.2 KB
                </p>
              </div>
              <span
                class="hidden shrink-0 items-center gap-1 text-[11px] text-text-quaternary sm:inline-flex"
              >
                <nxp-icon icon="ri-cursor-line" size="xs" />
                Right-click
              </span>
            </div>
          </div>

          <ng-template #contextMenu let-close>
            <div class="w-52 p-1.5">
              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Opened deploy-config.ts'); close()"
              >
                <nxp-icon
                  icon="ri-external-link-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Open
                <kbd class="ml-auto font-mono text-[11px] text-text-quaternary"
                  >↵</kbd
                >
              </button>
              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Renaming…'); close()"
              >
                <nxp-icon
                  icon="ri-edit-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Rename
                <kbd class="ml-auto font-mono text-[11px] text-text-quaternary"
                  >F2</kbd
                >
              </button>
              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Duplicated file'); close()"
              >
                <nxp-icon
                  icon="ri-file-copy-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Duplicate
                <kbd class="ml-auto font-mono text-[11px] text-text-quaternary"
                  >⌘D</kbd
                >
              </button>
              <button
                type="button"
                class="group flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary focus-visible:bg-bg-neutral-1 focus-visible:text-text-primary"
                (click)="run('Link copied'); close()"
              >
                <nxp-icon
                  icon="ri-links-line"
                  size="sm"
                  class="text-text-tertiary group-hover:text-text-primary"
                />
                Copy link
              </button>

              <div class="my-1 h-px bg-border-normal"></div>

              <button
                type="button"
                class="flex w-full items-center gap-2.5 rounded-m px-2 py-1.5 text-left text-sm text-status-negative outline-none transition-colors duration-fast hover:bg-status-negative-pale focus-visible:bg-status-negative-pale"
                (click)="run('Deleted deploy-config.ts'); close()"
              >
                <nxp-icon icon="ri-delete-bin-line" size="sm" />
                Delete
                <kbd
                  class="ml-auto font-mono text-[11px] text-status-negative/60"
                  >⌫</kbd
                >
              </button>
            </div>
          </ng-template>
        </nxp-doc-example>

        <!-- ──────────────────────  Positioning playground  ────────────────── -->
        <nxp-doc-example
          heading="Positioning playground"
          description="Every positioning input on the options directive, live. Adjust align, direction, width strategy, sided opening, height bounds, and offset — the values are shared two-way with the API tab and persisted to the URL."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div
            class="grid w-full items-start gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
          >
            <!-- Trigger -->
            <div class="flex flex-col gap-3">
              <button
                type="button"
                aria-haspopup="menu"
                class="inline-flex items-center gap-2 self-start rounded-m bg-bg-base px-3.5 py-2 text-sm font-medium text-text-primary shadow-border transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                [nxpDropdown]="playgroundDropdown"
                nxpDropdownAuto
                [nxpDropdownAlign]="align()"
                [nxpDropdownDirection]="direction()"
                [nxpDropdownLimitWidth]="limitWidth()"
                [nxpDropdownMinHeight]="minHeight()"
                [nxpDropdownMaxHeight]="maxHeight()"
                [nxpDropdownOffset]="offset()"
                [nxpDropdownSided]="sided()"
                [nxpDropdownSidedOffset]="sidedOffset()"
              >
                <nxp-icon
                  icon="ri-equalizer-line"
                  size="sm"
                  class="text-text-tertiary"
                />
                Open dropdown
                <nxp-icon
                  icon="ri-arrow-down-s-line"
                  size="sm"
                  class="text-text-tertiary transition-transform duration-fast [.nxp-dropdown-open_&]:rotate-180"
                />
              </button>

              <div
                class="flex flex-wrap gap-1.5 font-mono text-[11px] text-text-tertiary"
              >
                <span class="rounded-full bg-bg-neutral-1 px-2 py-0.5"
                  >align: {{ align() }}</span
                >
                <span class="rounded-full bg-bg-neutral-1 px-2 py-0.5"
                  >dir: {{ directionLabel(direction()) }}</span
                >
                <span class="rounded-full bg-bg-neutral-1 px-2 py-0.5"
                  >width: {{ limitWidth() }}</span
                >
                @if (sided()) {
                  <span class="rounded-full bg-bg-neutral-1 px-2 py-0.5"
                    >sided</span
                  >
                }
              </div>
            </div>

            <!-- Controls -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="space-y-2">
                <div class="text-xs font-medium text-text-primary">Align</div>
                <div class="inline-flex flex-wrap gap-1.5">
                  @for (option of alignOptions; track option) {
                    <button
                      type="button"
                      class="rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      [class.bg-primary]="align() === option"
                      [class.text-text-on-accent]="align() === option"
                      [class.bg-bg-base]="align() !== option"
                      [class.text-text-secondary]="align() !== option"
                      [class.shadow-border]="align() !== option"
                      (click)="align.set(option)"
                    >
                      {{ option }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <div class="text-xs font-medium text-text-primary">
                  Direction
                </div>
                <div class="inline-flex flex-wrap gap-1.5">
                  @for (option of directionOptions; track option) {
                    <button
                      type="button"
                      class="rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      [class.bg-primary]="direction() === option"
                      [class.text-text-on-accent]="direction() === option"
                      [class.bg-bg-base]="direction() !== option"
                      [class.text-text-secondary]="direction() !== option"
                      [class.shadow-border]="direction() !== option"
                      (click)="direction.set(option)"
                    >
                      {{ directionLabel(option) }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <div class="text-xs font-medium text-text-primary">
                  Width mode
                </div>
                <div class="inline-flex flex-wrap gap-1.5">
                  @for (option of widthOptions; track option) {
                    <button
                      type="button"
                      class="rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      [class.bg-primary]="limitWidth() === option"
                      [class.text-text-on-accent]="limitWidth() === option"
                      [class.bg-bg-base]="limitWidth() !== option"
                      [class.text-text-secondary]="limitWidth() !== option"
                      [class.shadow-border]="limitWidth() !== option"
                      (click)="limitWidth.set(option)"
                    >
                      {{ option }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <div class="text-xs font-medium text-text-primary">Sided</div>
                <label
                  class="inline-flex cursor-pointer items-center gap-2 text-xs text-text-secondary"
                >
                  <input
                    type="checkbox"
                    class="size-4 rounded-sm border-border-strong text-primary focus:ring-border-focus"
                    [checked]="sided()"
                    (change)="sided.set($any($event.target).checked)"
                  />
                  Open to the side when possible
                </label>
                <div class="flex items-center gap-2 text-xs text-text-tertiary">
                  <span class="w-24">Sided offset</span>
                  <input
                    type="number"
                    min="0"
                    max="32"
                    class="w-20 rounded-m bg-bg-base px-2 py-1 text-xs text-text-primary shadow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    [value]="sidedOffset()"
                    (input)="
                      updateNumber(
                        sidedOffset,
                        $any($event.target).value,
                        0,
                        32
                      )
                    "
                  />
                  <span>px</span>
                </div>
              </div>

              <div class="space-y-2 sm:col-span-2">
                <div class="text-xs font-medium text-text-primary">
                  Height &amp; offset
                </div>
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div
                    class="flex items-center gap-2 text-xs text-text-tertiary"
                  >
                    <span class="w-20">Min height</span>
                    <input
                      type="number"
                      min="40"
                      max="400"
                      class="w-20 rounded-m bg-bg-base px-2 py-1 text-xs text-text-primary shadow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      [value]="minHeight()"
                      (input)="
                        updateNumber(
                          minHeight,
                          $any($event.target).value,
                          40,
                          400
                        )
                      "
                    />
                  </div>
                  <div
                    class="flex items-center gap-2 text-xs text-text-tertiary"
                  >
                    <span class="w-20">Max height</span>
                    <input
                      type="number"
                      min="80"
                      max="600"
                      class="w-20 rounded-m bg-bg-base px-2 py-1 text-xs text-text-primary shadow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      [value]="maxHeight()"
                      (input)="
                        updateNumber(
                          maxHeight,
                          $any($event.target).value,
                          80,
                          600
                        )
                      "
                    />
                  </div>
                  <div
                    class="flex items-center gap-2 text-xs text-text-tertiary"
                  >
                    <span class="w-20">Offset</span>
                    <input
                      type="number"
                      min="0"
                      max="32"
                      class="w-20 rounded-m bg-bg-base px-2 py-1 text-xs text-text-primary shadow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      [value]="offset()"
                      (input)="
                        updateNumber(offset, $any($event.target).value, 0, 32)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ng-template #playgroundDropdown let-close>
            <div class="w-60 p-3">
              <p class="text-sm font-medium text-text-primary">
                Rendered through the portal
              </p>
              <p class="mt-1 text-xs leading-relaxed text-text-tertiary">
                Positioned relative to the trigger using your current options.
              </p>
              <dl
                class="mt-3 space-y-1 font-mono text-[11px] text-text-secondary"
              >
                <div class="flex justify-between gap-4">
                  <dt class="text-text-tertiary">align</dt>
                  <dd>{{ align() }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-text-tertiary">direction</dt>
                  <dd>{{ directionLabel(direction()) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-text-tertiary">limitWidth</dt>
                  <dd>{{ limitWidth() }}</dd>
                </div>
              </dl>
              <button
                type="button"
                class="mt-3 w-full rounded-m bg-primary px-3 py-1.5 text-xs font-medium text-text-on-accent transition-colors duration-fast hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                (click)="close()"
              >
                Close from template context
              </button>
            </div>
          </ng-template>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-dropdown-api
          [(align)]="align"
          [(direction)]="direction"
          [(limitWidth)]="limitWidth"
          [(minHeight)]="minHeight"
          [(maxHeight)]="maxHeight"
          [(offset)]="offset"
          [(sided)]="sided"
          [(sidedOffset)]="sidedOffset"
          [(hoverShowDelay)]="hoverShowDelay"
          [(hoverHideDelay)]="hoverHideDelay"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class DropdownDemoComponent {
  // ── Playground state (shared two-way with the API tab) ──────────────────────
  readonly alignOptions: readonly NxpDropdownAlign[] = [
    'start',
    'center',
    'end',
  ];
  readonly widthOptions: readonly NxpDropdownWidth[] = ['auto', 'fixed', 'min'];
  readonly directionOptions: readonly DropdownDirection[] = [
    null,
    'top',
    'bottom',
  ];

  readonly align = signal<NxpDropdownAlign>('start');
  readonly direction = signal<DropdownDirection>(null);
  readonly limitWidth = signal<NxpDropdownWidth>('auto');
  readonly minHeight = signal(80);
  readonly maxHeight = signal(320);
  readonly offset = signal(4);
  readonly sided = signal(false);
  readonly sidedOffset = signal(4);

  readonly hoverShowDelay = signal(150);
  readonly hoverHideDelay = signal(150);

  // ── Account / context menu feedback line ────────────────────────────────────
  readonly lastAction = signal<string | null>(null);
  run(action: string): void {
    this.lastAction.set(action);
  }

  // ── Promote deployment ──────────────────────────────────────────────────────
  private readonly envLabels: Record<EnvId, string> = {
    development: 'Development',
    preview: 'Preview',
    production: 'Production',
  };
  readonly promoted = signal<EnvId | null>(null);
  readonly promotedLabel = computed(() => {
    const env = this.promoted();
    return env ? this.envLabels[env] : null;
  });
  promote(env: EnvId): void {
    this.promoted.set(env);
  }

  // ── Hover card ────────────────────────────────────────────────────────────--
  readonly following = signal(false);

  // ── Selection toolbar ─────────────────────────────────────────────────────--
  readonly formats = signal<Record<string, boolean>>({});
  toggleFormat(key: string): void {
    this.formats.update((state) => ({ ...state, [key]: !state[key] }));
  }

  // ── Notifications ───────────────────────────────────────────────────────────
  readonly notifications = signal<readonly DropdownNotification[]>([
    {
      id: 1,
      actor: 'Marcus Andersson',
      action: 'requested your review on edge-runtime',
      time: '2 minutes ago',
      icon: 'ri-git-pull-request-line',
      read: false,
    },
    {
      id: 2,
      actor: 'Priya Nair',
      action: 'commented on your deployment',
      time: '18 minutes ago',
      icon: 'ri-chat-1-line',
      read: false,
    },
    {
      id: 3,
      actor: 'Production',
      action: 'deploy succeeded in 41s',
      time: '1 hour ago',
      icon: 'ri-checkbox-circle-line',
      read: true,
    },
    {
      id: 4,
      actor: 'Leo Fischer',
      action: 'added you to the platform team',
      time: '3 hours ago',
      icon: 'ri-user-add-line',
      read: true,
    },
    {
      id: 5,
      actor: 'Preview',
      action: 'build failed — 2 type errors',
      time: 'Yesterday',
      icon: 'ri-error-warning-line',
      read: true,
    },
    {
      id: 6,
      actor: 'Sofia Reyes',
      action: 'starred your repository',
      time: 'Yesterday',
      icon: 'ri-star-line',
      read: true,
    },
  ]);
  readonly unread = computed(
    () => this.notifications().filter((n) => !n.read).length,
  );
  markAllRead(): void {
    this.notifications.update((list) =>
      list.map((n) => ({ ...n, read: true })),
    );
  }

  // ── Shared helpers ────────────────────────────────────────────────────────--
  directionLabel(direction: DropdownDirection): string {
    return direction === null ? 'auto' : direction;
  }

  updateNumber(
    target: WritableSignal<number>,
    rawValue: unknown,
    min: number,
    max: number,
  ): void {
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    target.set(Math.min(Math.max(value, min), max));
  }

  // ── Example source snippets shown inside the <nxp-doc-example> code tabs ─────
  readonly accountHtml = `<button
  [nxpDropdown]="accountMenu"
  nxpDropdownAuto
  [nxpDropdownAlign]="'end'"
  aria-haspopup="menu"
>
  <span class="avatar">MK</span> Mara
  <nxp-icon icon="ri-arrow-down-s-line" />
</button>

<ng-template #accountMenu let-close>
  <div class="w-64 p-1.5">
    <!-- identity header: avatar · name · email · Pro pill -->

    <button (click)="open('dashboard'); close()">
      <nxp-icon icon="ri-dashboard-line" /> Dashboard <kbd>⌘D</kbd>
    </button>
    <button (click)="open('settings'); close()">
      <nxp-icon icon="ri-settings-3-line" /> Settings <kbd>⌘S</kbd>
    </button>

    <div class="my-1 h-px bg-border-normal"></div>

    <button class="text-status-negative" (click)="signOut(); close()">
      <nxp-icon icon="ri-logout-box-r-line" /> Sign out
    </button>
  </div>
</ng-template>`;

  readonly accountTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-account-menu',
  imports: [...NxpDropdown, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-menu.html',
})
export class AccountMenuExample {
  open(target: string): void {
    /* navigate */
  }
  signOut(): void {
    /* clear session */
  }
}`;

  readonly promoteHtml = `<!-- limitWidth="fixed" makes the panel match the trigger width -->
<button
  [nxpDropdown]="promoteMenu"
  nxpDropdownAuto
  [nxpDropdownLimitWidth]="'fixed'"
>
  <nxp-icon icon="ri-rocket-2-line" /> Promote deployment
</button>

<ng-template #promoteMenu let-close>
  <div class="p-1.5">
    <button (click)="promote('development'); close()">
      <span class="size-2 rounded-full bg-accent-develop"></span>
      Development
    </button>
    <button (click)="promote('preview'); close()">
      <span class="size-2 rounded-full bg-accent-preview"></span>
      Preview
    </button>
    <button (click)="promote('production'); close()">
      <span class="size-2 rounded-full bg-accent-ship"></span>
      Production
    </button>
  </div>
</ng-template>`;

  readonly promoteTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

type EnvId = 'development' | 'preview' | 'production';

@Component({
  selector: 'app-promote',
  imports: [...NxpDropdown, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promote.html',
})
export class PromoteExample {
  readonly promoted = signal<EnvId | null>(null);
  promote(env: EnvId): void {
    this.promoted.set(env);
  }
}`;

  readonly notificationsHtml = `<!-- maxHeight caps the panel; the built-in inner scroll takes over -->
<button
  [nxpDropdown]="notifMenu"
  nxpDropdownAuto
  [nxpDropdownAlign]="'end'"
  [nxpDropdownMaxHeight]="360"
  aria-label="Notifications"
>
  <nxp-icon icon="ri-notification-3-line" />
  @if (unread() > 0) { <span class="badge">{{ unread() }}</span> }
</button>

<ng-template #notifMenu>
  <div class="w-80">
    <!-- sticky header stays pinned while the list scrolls -->
    <div class="sticky top-0 bg-bg-base ...">Notifications</div>

    <ul class="p-1.5">
      @for (n of notifications(); track n.id) {
        <li><nxp-icon [icon]="n.icon" /> {{ n.actor }} {{ n.action }}</li>
      }
    </ul>
  </div>
</ng-template>`;

  readonly notificationsTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-notifications',
  imports: [...NxpDropdown, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications.html',
})
export class NotificationsExample {
  readonly notifications = signal([/* … */]);
  readonly unread = computed(
    () => this.notifications().filter((n) => !n.read).length,
  );
}`;

  readonly hoverHtml = `<button
  [nxpDropdown]="profileCard"
  nxpDropdownAuto
  nxpDropdownHover
  [nxpDropdownShowDelay]="150"
  [nxpDropdownHideDelay]="150"
>
  &#64;marcus
</button>

<ng-template #profileCard>
  <div class="w-72 p-4">
    <!-- avatar · name · @handle · bio · stats -->
    <button (click)="following.set(!following())">
      {{ following() ? 'Following' : 'Follow' }}
    </button>
  </div>
</ng-template>`;

  readonly hoverTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';

@Component({
  selector: 'app-hover-card',
  imports: [...NxpDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hover-card.html',
})
export class HoverCardExample {
  readonly following = signal(false);
}`;

  readonly selectionHtml = `<!-- The panel anchors to the selected range, above it -->
<div
  class="select-text"
  [nxpDropdown]="formatToolbar"
  nxpDropdownSelection
  [nxpDropdownSelectionPosition]="'selection'"
  [nxpDropdownDirection]="'top'"
  [nxpDropdownAlign]="'center'"
>
  <p>Select any part of this paragraph…</p>
</div>

<ng-template #formatToolbar>
  <div class="flex items-center gap-0.5 p-1">
    <button (click)="toggleFormat('bold')"><nxp-icon icon="ri-bold" /></button>
    <button (click)="toggleFormat('italic')"><nxp-icon icon="ri-italic" /></button>
    <span class="divider"></span>
    <button><nxp-icon icon="ri-link" /></button>
    <button><nxp-icon icon="ri-chat-1-line" /> Comment</button>
  </div>
</ng-template>`;

  readonly selectionTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-selection-toolbar',
  imports: [...NxpDropdown, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selection-toolbar.html',
})
export class SelectionToolbarExample {
  readonly formats = signal<Record<string, boolean>>({});
  toggleFormat(key: string): void {
    this.formats.update((s) => ({ ...s, [key]: !s[key] }));
  }
}`;

  readonly contextHtml = `<!-- nxpDropdownContext anchors the panel at the pointer on right-click -->
<div [nxpDropdown]="contextMenu" nxpDropdownContext>
  <nxp-icon icon="ri-file-code-line" /> deploy-config.ts
</div>

<ng-template #contextMenu let-close>
  <div class="w-52 p-1.5">
    <button (click)="run('open'); close()">
      <nxp-icon icon="ri-external-link-line" /> Open <kbd>↵</kbd>
    </button>
    <button (click)="run('rename'); close()">
      <nxp-icon icon="ri-edit-line" /> Rename <kbd>F2</kbd>
    </button>

    <div class="my-1 h-px bg-border-normal"></div>

    <button class="text-status-negative" (click)="run('delete'); close()">
      <nxp-icon icon="ri-delete-bin-line" /> Delete <kbd>⌫</kbd>
    </button>
  </div>
</ng-template>`;

  readonly contextTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-context-menu',
  imports: [...NxpDropdown, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-menu.html',
})
export class ContextMenuExample {
  run(action: string): void {
    /* handle action */
  }
}`;

  readonly playgroundHtml = `<button
  [nxpDropdown]="playgroundDropdown"
  nxpDropdownAuto
  [nxpDropdownAlign]="align()"
  [nxpDropdownDirection]="direction()"
  [nxpDropdownLimitWidth]="limitWidth()"
  [nxpDropdownMinHeight]="minHeight()"
  [nxpDropdownMaxHeight]="maxHeight()"
  [nxpDropdownOffset]="offset()"
  [nxpDropdownSided]="sided()"
  [nxpDropdownSidedOffset]="sidedOffset()"
>
  Open dropdown
</button>

<ng-template #playgroundDropdown let-close>
  <div class="w-60 p-3">
    <p>Rendered through the portal</p>
    <button (click)="close()">Close from template context</button>
  </div>
</ng-template>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpDropdown,
  type NxpDropdownAlign,
  type NxpDropdownWidth,
} from '@ngxpro/cdk';

type DropdownDirection = 'top' | 'bottom' | null;

@Component({
  selector: 'app-playground',
  imports: [...NxpDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundExample {
  readonly align = signal<NxpDropdownAlign>('start');
  readonly direction = signal<DropdownDirection>(null);
  readonly limitWidth = signal<NxpDropdownWidth>('auto');
  readonly minHeight = signal(80);
  readonly maxHeight = signal(320);
  readonly offset = signal(4);
  readonly sided = signal(false);
  readonly sidedOffset = signal(4);
}`;
}
