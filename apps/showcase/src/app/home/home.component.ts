import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ExpandComponent, nxpWriteToClipboard } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';

import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';
import { ButtonComponent } from '@ngxpro/components/button';
import { CalendarComponent } from '@ngxpro/components/calendar';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { NxpInputChipComponent } from '@ngxpro/components/input-chip';
import { NxpMenu } from '@ngxpro/components/menu';
import { NxpRangeComponent, type NxpKeySteps } from '@ngxpro/components/range';
import { NxpSelectComponent } from '@ngxpro/components/select';
import { NxpSwitch } from '@ngxpro/components/switch';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';
import { NxpTree } from '@ngxpro/components/tree';
import {
  TextMorphComponent,
  TextMorphDirective,
} from '@ngxpro/components/text-morph';

/** Inline 24×24 stroke icon for the button `iconStart` / `iconEnd` slots. */
const geistIcon = (paths: string): string =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

interface Verb {
  readonly word: string;
  readonly color: string;
}

interface Deployment {
  readonly status: string;
  readonly color: NxpBadgeColor;
  readonly message: string;
  readonly branch: string;
  readonly hash: string;
  readonly time: string;
}

interface Region {
  readonly code: string;
  readonly name: string;
  readonly latency: number;
  readonly nearest?: boolean;
}

interface Faq {
  readonly title: string;
  readonly content: string;
  readonly icon: string;
}

interface DeployStage {
  readonly label: string;
  readonly dot: string;
  readonly text: string;
  readonly pulse: boolean;
}

interface SettingSection {
  readonly label: string;
  readonly icon: string;
  readonly title: string;
  readonly hint: string;
}

interface Team {
  readonly id: string;
  readonly name: string;
  readonly org: string;
}

interface RepoNode {
  readonly name: string;
  readonly kind: 'folder' | 'file';
  readonly children?: readonly RepoNode[];
}

interface ToastRow {
  readonly appearance: NxpNotificationOptions['appearance'];
  readonly label: string;
  readonly blurb: string;
  readonly icon: string;
}

/**
 * Showcase landing page — an animated hero, a two-up featured bento of live
 * product vignettes, then a masonry gallery of interactive component demos.
 * Recipes are lifted from each component's own `*-demo.component.ts` and
 * re-styled with the Vercel/Geist design tokens (see design-system.md). Cards
 * are live-only and deep-link to their full docs page; full A–Z navigation
 * lives in the sidebar.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ExpandComponent,
    NxpIconComponent,
    NxpLinkDirective,
    NxpNotificationHostComponent,
    AccordionComponent,
    AccordionTriggerComponent,
    NxpBadgeComponent,
    ButtonComponent,
    CalendarComponent,
    DataListComponent,
    OptionDirective,
    NxpInputChipComponent,
    NxpRangeComponent,
    NxpSelectComponent,
    NxpTooltipDirective,
    NxpTree,
    TextMorphComponent,
    TextMorphDirective,
    ...NxpMenu,
    ...NxpSwitch,
  ],
  template: `
    <!-- Toasts fired from the Notification card render through this host. -->
    <nxp-notification-host />

    <div class="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
      <!-- ───────────────────────────── HERO ───────────────────────────── -->
      <header class="relative">
        <!-- Atmospheric pastel wash (design-system §6) — barely-there. -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-96 overflow-hidden"
        >
          <div
            class="absolute left-[8%] top-0 size-72 rounded-full bg-accent-develop/10 blur-3xl"
          ></div>
          <div
            class="absolute left-[48%] top-8 size-64 rounded-full bg-accent-preview/10 blur-3xl"
          ></div>
          <div
            class="absolute left-[78%] top-2 size-56 rounded-full bg-accent-ship/[0.08] blur-3xl"
          ></div>
        </div>

        <span
          class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-text-tertiary"
        >
          <span class="size-1.5 rounded-full bg-accent-develop"></span>
          The Angular UI library
        </span>

        <h1
          class="mt-6 flex flex-wrap items-baseline gap-x-4 text-5xl font-semibold leading-[1.02] tracking-display text-text-primary sm:text-7xl"
        >
          <span>Built to</span>
          <span
            nxpTextMorph
            [text]="verb().word"
            [class]="'tracking-display ' + verb().color"
          ></span>
        </h1>

        <p
          class="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          A signal-first Angular component library — 30+ accessible primitives,
          100% Tailwind, zero runtime CSS-in-JS. Architecture from Taiga UI,
          styling from Tremor.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            nxpButton
            variant="primary"
            size="lg"
            routerLink="/button"
            [iconEnd]="icons.arrowRight"
          >
            Get started
          </a>
          <button
            nxpButton
            variant="secondary"
            size="lg"
            class="font-mono"
            [nxpTooltip]="copyTip"
            nxpTooltipDirection="bottom"
            [iconEnd]="icons.copy"
            [attr.aria-label]="copyLabel()"
            (click)="copyInstall()"
          >
            <span class="text-text-tertiary">$</span>&nbsp;npm i
            &#64;ngxpro/components
          </button>
          <ng-template #copyTip>
            <nxp-text-morph [text]="copyLabel()" class="text-sm font-medium" />
          </ng-template>
        </div>

        <dl
          class="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-5 border-t border-bg-neutral-2 pt-7 sm:grid-cols-4"
        >
          @for (stat of stats; track stat.label) {
            <div class="flex flex-col gap-1">
              <dt
                class="font-mono text-[11px] uppercase tracking-[0.1em] text-text-quaternary"
              >
                {{ stat.label }}
              </dt>
              <dd
                class="text-2xl font-semibold tracking-card text-text-primary"
              >
                {{ stat.value }}
              </dd>
            </div>
          }
        </dl>
      </header>

      <!-- ──────────────────────── FEATURED BENTO ───────────────────────── -->
      <section class="mt-14 grid gap-5 lg:grid-cols-2">
        <!-- F1 · Text Morph — live edge metrics + deploy pipeline -->
        <article [class]="cls.featured">
          <header [class]="cls.featuredHead">
            <div>
              <span [class]="cls.kicker">Featured · Animation</span>
              <h3 [class]="cls.featuredTitle">Live edge metrics</h3>
            </div>
            <a
              routerLink="/text-morph"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Text Morph →</a
            >
          </header>

          <div class="flex flex-col gap-6 px-6 py-6">
            <div class="grid grid-cols-2 gap-4">
              <div [class]="cls.metric">
                <p [class]="cls.metricLabel">Edge requests</p>
                <span
                  nxpTextMorph
                  [text]="requests()"
                  [duration]="500"
                  class="text-[2.25rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-text-primary"
                ></span>
              </div>
              <div [class]="cls.metric">
                <p [class]="cls.metricLabel">p95 latency</p>
                <span
                  nxpTextMorph
                  [text]="latency()"
                  [duration]="500"
                  class="text-[2.25rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-accent-develop"
                ></span>
              </div>
            </div>

            <!-- Signature deployment pipeline — status line morphs per stage. -->
            <div class="rounded-lg bg-bg-base-alt p-4 shadow-border">
              <div class="flex items-center justify-between">
                <span [class]="cls.kicker">Production</span>
                <span
                  class="font-mono text-[11px] tabular-nums text-text-tertiary"
                  >{{ stage().pulse ? 'in progress' : 'idle' }}</span
                >
              </div>
              <div class="mt-3 flex items-center gap-2.5">
                <span
                  class="size-2 shrink-0 rounded-full transition-colors duration-slow"
                  [class]="
                    stage().dot + (stage().pulse ? ' animate-pulse' : '')
                  "
                ></span>
                <span
                  nxpTextMorph
                  [text]="stage().label"
                  [class]="'text-lg font-medium tracking-tight ' + stage().text"
                ></span>
              </div>
              <div class="mt-4 flex gap-2">
                <button
                  nxpButton
                  variant="primary"
                  size="sm"
                  [iconStart]="icons.rocket"
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
                <button
                  nxpButton
                  variant="secondary"
                  size="sm"
                  class="ml-auto"
                  (click)="refreshMetrics()"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </article>

        <!-- F2 · Calendar — release schedule -->
        <article [class]="cls.featured">
          <header [class]="cls.featuredHead">
            <div>
              <span [class]="cls.kicker">Featured · Date</span>
              <h3 [class]="cls.featuredTitle">Release schedule</h3>
            </div>
            <a
              routerLink="/calendar"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Calendar →</a
            >
          </header>

          <div class="grid gap-5 px-6 py-6 sm:grid-cols-[auto_1fr]">
            <nxp-calendar
              [value]="calendarValue()"
              [markerHandler]="scheduleMarkers"
              (dayClick)="calendarValue.set($event)"
            />

            <div class="flex min-w-0 flex-col justify-between gap-4">
              <div>
                <p [class]="cls.kicker">Selected</p>
                <p
                  class="mt-1 text-lg font-semibold tracking-card text-text-primary"
                >
                  {{ selectedDateLabel() }}
                </p>
                @if (isScheduled()) {
                  <div class="mt-3 flex items-center gap-2">
                    <span class="size-2 rounded-full bg-accent-develop"></span>
                    <span class="text-sm text-text-secondary"
                      >Production deploy · 09:00 UTC</span
                    >
                  </div>
                } @else {
                  <p class="mt-3 text-sm text-text-tertiary">
                    No deployment scheduled for this day.
                  </p>
                }
              </div>

              <button
                nxpButton
                [variant]="isScheduled() ? 'secondary' : 'primary'"
                size="sm"
                (click)="toggleSchedule()"
              >
                {{ isScheduled() ? 'Cancel deploy' : 'Schedule deploy' }}
              </button>
            </div>
          </div>
        </article>
      </section>

      <!-- ─────────────────────────── MASONRY ──────────────────────────── -->
      <section
        class="mt-5 gap-5 [column-fill:balance] sm:columns-2 xl:columns-3"
      >
        <!-- 1 · Switch — settings panel -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Form control</span>
              <h3 [class]="cls.title">Switch</h3>
            </div>
            <a
              routerLink="/switch"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <ul class="flex flex-col divide-y divide-bg-neutral-2 px-5">
            @for (s of switches; track s.label) {
              <li class="flex items-center justify-between gap-4 py-3">
                <div class="min-w-0">
                  <p class="text-[13px] font-medium text-text-primary">
                    {{ s.label }}
                  </p>
                  <p class="truncate text-[12px] text-text-tertiary">
                    {{ s.desc }}
                  </p>
                </div>
                <nxp-switch [(checked)]="s.on" [color]="s.color" />
              </li>
            }
          </ul>
        </article>

        <!-- 2 · Badge — deployment feed -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div class="flex items-center gap-2.5">
              <span [class]="cls.kicker">Display · Badge</span>
              <nxp-badge variant="dot" color="green" size="sm">Live</nxp-badge>
            </div>
            <a
              routerLink="/badge"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="divide-y divide-bg-neutral-2">
            @for (d of deployments; track d.hash) {
              <div
                class="flex items-center gap-3 px-5 py-3 transition-colors duration-normal hover:bg-bg-neutral-1"
              >
                <div class="w-[88px] shrink-0">
                  <nxp-badge variant="dot" [color]="d.color" size="sm">{{
                    d.status
                  }}</nxp-badge>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-medium text-text-primary">
                    {{ d.message }}
                  </p>
                  <p
                    class="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[11px] text-text-tertiary"
                  >
                    <span>{{ d.branch }}</span>
                    <span class="text-text-quaternary">·</span>
                    <span>{{ d.hash }}</span>
                  </p>
                </div>
                <span
                  class="shrink-0 font-mono text-[11px] text-text-quaternary"
                  >{{ d.time }}</span
                >
              </div>
            }
          </div>
        </article>

        <!-- 3 · Range — budget filter -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Input</span>
              <h3 [class]="cls.title">Range</h3>
            </div>
            <a
              routerLink="/range"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="space-y-4 px-5 py-5">
            <div class="flex items-baseline justify-between">
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >Budget</span
              >
              <span
                class="font-mono text-[13px] font-medium tabular-nums text-text-primary"
                >{{ budgetLabel() }}</span
              >
            </div>
            <nxp-range
              [themeColor]="true"
              [keySteps]="priceKeySteps"
              [step]="1"
              [(value)]="priceRange"
            />
          </div>
        </article>

        <!-- 4 · Menu — settings navigator (proximity hover) -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Navigation</span>
              <h3 [class]="cls.title">Menu</h3>
            </div>
            <a
              routerLink="/menu"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="px-3 py-3">
            <nxp-menu class="w-full" [(checkedIndex)]="settingsIndex">
              @for (section of settings; track section.label) {
                <button nxpMenuItem>
                  <nxp-icon
                    [icon]="section.icon"
                    size="sm"
                    class="text-text-tertiary"
                  />
                  <span class="flex-1 text-[13px] text-text-primary">{{
                    section.label
                  }}</span>
                </button>
              }
            </nxp-menu>
            <p class="mt-2 px-2 text-[12px] text-text-tertiary">
              {{ activeSection().hint }}
            </p>
          </div>
        </article>

        <!-- 5 · Select — transfer to team (filterable, grouped, portal) -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Input · Listbox</span>
              <h3 [class]="cls.title">Select</h3>
            </div>
            <a
              routerLink="/select"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="space-y-2 px-5 py-5">
            <p class="text-[13px] text-text-secondary">
              Transfer this project to a team.
            </p>
            <nxp-select
              class="w-full"
              [formControl]="teamCtrl"
              [items]="teams"
              textField="name"
              valueField="id"
              groupBy="org"
              [filterable]="true"
              filterPlaceholder="Search teams…"
              placeholder="Select a team"
              [clearable]="true"
            />
            <p class="font-mono text-[12px] text-text-tertiary">
              Owner:
              <span class="text-text-primary">{{
                selectedTeam()?.name ?? '—'
              }}</span>
            </p>
          </div>
        </article>

        <!-- 6 · Tree — repository explorer -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Display · Tree</span>
              <h3 [class]="cls.title">Tree</h3>
            </div>
            <a
              routerLink="/tree"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div nxpTreeController class="px-3 py-3">
            @for (item of repoTree; track item.name) {
              <nxp-tree
                [value]="item"
                [childrenHandler]="repoChildren"
                [content]="repoTpl"
              />
            }
            <ng-template #repoTpl let-item>
              <span class="inline-flex w-full items-center gap-2 text-[13px]">
                <nxp-icon
                  [icon]="
                    item.kind === 'folder'
                      ? 'ri-folder-3-line'
                      : 'ri-file-3-line'
                  "
                  size="sm"
                  class="text-text-tertiary"
                />
                <span class="font-mono text-text-primary">{{ item.name }}</span>
              </span>
            </ng-template>
          </div>
        </article>

        <!-- 7 · Button -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Action</span>
              <h3 [class]="cls.title">Button</h3>
            </div>
            <a
              routerLink="/button"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="flex flex-wrap items-center gap-2 px-5 py-5">
            <button
              nxpButton
              variant="primary"
              size="sm"
              [iconStart]="icons.rocket"
            >
              Deploy
            </button>
            <button
              nxpButton
              variant="secondary"
              size="sm"
              [iconEnd]="icons.arrowRight"
            >
              Continue
            </button>
            <button nxpButton variant="ghost" size="sm">Cancel</button>
            <button nxpButton variant="destructive" size="sm">Delete</button>
            <button nxpButton variant="primary" size="sm" [loading]="true">
              Saving
            </button>
          </div>
        </article>

        <!-- 8 · Accordion — FAQ -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Layout</span>
              <h3 [class]="cls.title">Accordion</h3>
            </div>
            <a
              routerLink="/accordion"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="px-3 py-3">
            <nxp-accordion type="single">
              @for (item of faqs; track item.title) {
                <nxp-accordion-trigger nxpAccordion>
                  <span class="flex w-full items-center gap-3">
                    <i
                      [class]="
                        item.icon +
                        ' shrink-0 text-lg leading-none text-text-secondary'
                      "
                      aria-hidden="true"
                    ></i>
                    <span class="text-left text-[13px]">{{ item.title }}</span>
                  </span>
                </nxp-accordion-trigger>
                <nxp-expand>
                  <div
                    class="px-3 pb-2 pl-9 pt-1 text-[13px] leading-relaxed text-text-secondary"
                  >
                    {{ item.content }}
                  </div>
                </nxp-expand>
              }
            </nxp-accordion>
          </div>
        </article>

        <!-- 9 · Tooltip — directional compass -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Overlay</span>
              <h3 [class]="cls.title">Tooltip</h3>
            </div>
            <a
              routerLink="/tooltip"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="grid place-items-center px-5 py-6">
            <div class="grid grid-cols-3 grid-rows-3 gap-2">
              <button
                type="button"
                [class]="cls.tipBtn + ' col-start-2 row-start-1'"
                [nxpTooltip]="'Opens upward'"
                nxpTooltipDirection="top"
              >
                top
              </button>
              <button
                type="button"
                [class]="cls.tipBtn + ' col-start-1 row-start-2'"
                [nxpTooltip]="'Opens to the left'"
                nxpTooltipDirection="left"
              >
                left
              </button>
              <div
                class="col-start-2 row-start-2 grid place-items-center rounded-m bg-bg-base-alt font-mono text-[10px] uppercase tracking-[0.08em] text-text-quaternary"
              >
                hover
              </div>
              <button
                type="button"
                [class]="cls.tipBtn + ' col-start-3 row-start-2'"
                [nxpTooltip]="'Opens to the right'"
                nxpTooltipDirection="right"
              >
                right
              </button>
              <button
                type="button"
                [class]="cls.tipBtn + ' col-start-2 row-start-3'"
                [nxpTooltip]="'Opens downward'"
                nxpTooltipDirection="bottom"
              >
                bottom
              </button>
            </div>
          </div>
        </article>

        <!-- 10 · Notification — fire a toast -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Feedback</span>
              <h3 [class]="cls.title">Notification</h3>
            </div>
            <a
              routerLink="/alert"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="space-y-3 px-5 py-5">
            <p class="text-[13px] text-text-secondary">
              Fire a toast — swipe or hover the stack to dismiss.
            </p>
            <div class="grid grid-cols-2 gap-2">
              @for (t of toasts; track t.label) {
                <button
                  type="button"
                  [class]="cls.toastBtn"
                  (click)="fireToast(t)"
                >
                  <i
                    [class]="
                      t.icon +
                      ' text-base leading-none ' +
                      toastIconColor(t.appearance)
                    "
                    aria-hidden="true"
                  ></i>
                  {{ t.label }}
                </button>
              }
            </div>
          </div>
        </article>

        <!-- 11 · Input Chip — invite teammates -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Input</span>
              <h3 [class]="cls.title">Input Chip</h3>
            </div>
            <a
              routerLink="/input-chip"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="space-y-3 px-5 py-5">
            <div class="flex items-baseline justify-between">
              <span class="text-[13px] font-medium text-text-primary"
                >Invite teammates</span
              >
              <span class="font-mono text-[11px] text-text-tertiary"
                >{{ inviteCount() }} invited</span
              >
            </div>
            <nxp-input-chip
              class="w-full min-w-0"
              [formControl]="inviteCtrl"
              placeholder="name@company.com"
              [separator]="','"
            />
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <span
                class="font-mono text-[10px] uppercase tracking-wider text-text-quaternary"
                >Suggested</span
              >
              @for (email of inviteSuggestions; track email) {
                <button
                  type="button"
                  [disabled]="isInvited(email)"
                  [class]="isInvited(email) ? cls.pillAdded : cls.pillIdle"
                  (click)="addInvite(email)"
                >
                  <span aria-hidden="true">{{
                    isInvited(email) ? '✓' : '+'
                  }}</span>
                  {{ email }}
                </button>
              }
            </div>
          </div>
        </article>

        <!-- 12 · Data List — region picker -->
        <article [class]="cls.card">
          <header [class]="cls.cardHead">
            <div>
              <span [class]="cls.kicker">Display · Listbox</span>
              <h3 [class]="cls.title">Data List</h3>
            </div>
            <a
              routerLink="/data-list"
              [class]="cls.docLinkCls"
              nxpLink
              variant="muted"
              size="sm"
              [underline]="false"
              >Docs →</a
            >
          </header>
          <div class="p-2">
            <nxp-data-list size="lg" label="Deploy region" class="w-full">
              @for (region of regions; track region.code) {
                <button
                  nxpOption
                  [selected]="selectedRegion() === region.code"
                  (click)="selectedRegion.set(region.code)"
                >
                  <span
                    class="rounded-md bg-bg-neutral-1 px-1.5 py-0.5 font-mono text-[11px] font-medium text-text-secondary"
                    >{{ region.code }}</span
                  >
                  <span class="flex-1 truncate text-text-primary">{{
                    region.name
                  }}</span>
                  @if (region.nearest) {
                    <span
                      class="shrink-0 rounded-full bg-badge-blue-bg px-2 py-0.5 text-[10px] font-medium text-badge-blue-text"
                      >Nearest</span
                    >
                  }
                  <span
                    class="ml-auto w-14 shrink-0 text-right font-mono text-xs tabular-nums"
                    [class.text-text-primary]="region.nearest"
                    [class.text-text-tertiary]="!region.nearest"
                    >{{ region.latency }} ms</span
                  >
                </button>
              }
            </nxp-data-list>
          </div>
        </article>
      </section>

      <!-- ─────────────────────────── FOOTER ───────────────────────────── -->
      <footer
        class="mt-16 flex flex-col items-center gap-2 border-t border-bg-neutral-2 pt-8 text-center"
      >
        <p
          class="font-mono text-[11px] uppercase tracking-[0.12em] text-text-quaternary"
        >
          ngxpro · Taiga architecture + Tremor styling
        </p>
        <a
          href="https://github.com/your-repo/ngxpro"
          target="_blank"
          rel="noreferrer"
          nxpLink
          variant="muted"
          size="sm"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  `,
})
export class HomeComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(NxpNotificationService);

  // ── Shared class vocabulary — keeps card chrome consistent ──────────────
  protected readonly cls = {
    card:
      'mb-5 break-inside-avoid overflow-hidden rounded-xl bg-bg-base shadow-card ' +
      'transition-[transform,box-shadow] duration-normal',
    cardHead:
      'flex items-start justify-between gap-3 border-b border-bg-neutral-2 px-5 py-3.5',
    featured:
      'overflow-hidden rounded-xl bg-bg-base shadow-card-lg ' +
      'transition-[transform,box-shadow]',
    featuredHead:
      'flex items-start justify-between gap-3 border-b border-bg-neutral-2 px-6 py-4',
    featuredTitle:
      'mt-0.5 text-xl font-semibold tracking-card text-text-primary',
    kicker:
      'font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary',
    title: 'mt-0.5 text-[15px] font-semibold tracking-card text-text-primary',
    docLinkCls: 'shrink-0 whitespace-nowrap',
    metric: 'rounded-lg bg-bg-base-alt p-4 shadow-border',
    metricLabel:
      'mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary',
    tipBtn:
      'inline-flex items-center justify-center rounded-m bg-bg-base px-4 py-2 text-[13px] ' +
      'font-medium text-text-primary shadow-border transition-colors duration-fast hover:bg-bg-neutral-1',
    toastBtn:
      'inline-flex items-center justify-center gap-2 rounded-m bg-bg-base px-3 py-2 text-[13px] ' +
      'font-medium text-text-primary shadow-border transition-colors duration-fast hover:bg-bg-neutral-1',
    pillIdle:
      'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[11px] font-medium text-text-primary ' +
      'bg-bg-base shadow-border transition-colors duration-fast hover:bg-bg-neutral-1',
    pillAdded:
      'inline-flex cursor-default items-center gap-1 rounded-pill bg-bg-neutral-1 px-2.5 py-1 ' +
      'text-[11px] font-medium text-text-tertiary',
  } as const;

  // ── Hero: rotating verb ────────────────────────────────────────────────
  private readonly verbs: Verb[] = [
    { word: 'develop.', color: 'text-accent-develop' },
    { word: 'preview.', color: 'text-accent-preview' },
    { word: 'ship.', color: 'text-accent-ship' },
    { word: 'scale.', color: 'text-text-primary' },
  ];
  private readonly verbIndex = signal(0);
  readonly verb = computed(() => this.verbs[this.verbIndex()]);

  // ── Hero: copy install command ─────────────────────────────────────────
  readonly copyLabel = signal<'Copy' | 'Copied'>('Copy');
  private readonly installCmd = 'npm i @ngxpro/components --legacy-peer-deps';
  private copyResetId: ReturnType<typeof setTimeout> | null = null;

  async copyInstall(): Promise<void> {
    if (!(await nxpWriteToClipboard(this.installCmd, this.doc))) return;
    this.copyLabel.set('Copied');
    if (this.copyResetId !== null) clearTimeout(this.copyResetId);
    this.copyResetId = setTimeout(() => {
      this.copyLabel.set('Copy');
      this.copyResetId = null;
    }, 1500);
  }

  // ── Hero: stat row ─────────────────────────────────────────────────────
  readonly stats = [
    { label: 'Components', value: '30+' },
    { label: 'Styling', value: '100%' },
    { label: 'Bundle', value: 'Tree-shaken' },
    { label: 'Inputs', value: 'Signals' },
  ];

  // ── Inline icons for the button slots ──────────────────────────────────
  readonly icons = {
    arrowRight: geistIcon('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
    rocket: geistIcon(
      '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    ),
    copy: geistIcon(
      '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    ),
  };

  // ── F1 · Live metrics ──────────────────────────────────────────────────
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

  // ── F1 · Deployment pipeline ───────────────────────────────────────────
  private readonly stages: DeployStage[] = [
    {
      label: 'Ready to deploy',
      dot: 'bg-text-secondary/40',
      text: 'text-text-secondary',
      pulse: false,
    },
    {
      label: 'Queued',
      dot: 'bg-text-secondary/60',
      text: 'text-text-primary',
      pulse: true,
    },
    {
      label: 'Building',
      dot: 'bg-accent-develop',
      text: 'text-accent-develop',
      pulse: true,
    },
    {
      label: 'Uploading',
      dot: 'bg-accent-preview',
      text: 'text-accent-preview',
      pulse: true,
    },
    {
      label: 'Ready',
      dot: 'bg-status-positive',
      text: 'text-status-positive',
      pulse: false,
    },
  ];
  private readonly stageIndex = signal(0);
  readonly running = signal(false);
  readonly stage = computed(() => this.stages[this.stageIndex()]);
  private deployTimers: ReturnType<typeof setTimeout>[] = [];

  deploy(): void {
    if (this.running()) return;
    this.clearDeployTimers();
    this.running.set(true);
    this.stageIndex.set(1);
    [2, 3, 4].forEach((target, i) => {
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

  // ── F2 · Calendar release schedule ─────────────────────────────────────
  readonly calendarValue = signal<Date>(new Date());
  private readonly scheduled = signal<ReadonlySet<string>>(
    new Set(
      [2, 9, 16].map((offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return this.iso(d);
      }),
    ),
  );

  private iso(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  /** Dots scheduled deploy days with the Develop-blue workflow accent. */
  readonly scheduleMarkers = (date: Date): [] | [string] =>
    this.scheduled().has(this.iso(date)) ? ['var(--color-accent-develop)'] : [];

  readonly isScheduled = computed(() =>
    this.scheduled().has(this.iso(this.calendarValue())),
  );
  readonly selectedDateLabel = computed(() =>
    this.calendarValue().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  );

  toggleSchedule(): void {
    const key = this.iso(this.calendarValue());
    this.scheduled.update((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // ── 1 · Switch settings panel ──────────────────────────────────────────
  readonly switches = [
    {
      label: 'Email notifications',
      desc: 'Updates about your deployments',
      color: 'primary' as const,
      on: signal(true),
    },
    {
      label: 'Auto-deploy on push',
      desc: 'Ship the main branch automatically',
      color: 'primary' as const,
      on: signal(false),
    },
    {
      label: 'Delete preview on merge',
      desc: 'Tear down the environment',
      color: 'danger' as const,
      on: signal(false),
    },
  ];

  // ── 2 · Badge deployment feed ──────────────────────────────────────────
  readonly deployments: Deployment[] = [
    {
      status: 'Ready',
      color: 'green',
      message: 'feat: streaming SSR on the edge runtime',
      branch: 'main',
      hash: '3f9a1c2',
      time: '2m',
    },
    {
      status: 'Building',
      color: 'amber',
      message: 'fix: hydration mismatch on theme toggle',
      branch: 'fix/hydration',
      hash: 'b7d4e90',
      time: '4m',
    },
    {
      status: 'Error',
      color: 'rose',
      message: 'chore: bump tailwind to v4.1',
      branch: 'deps/tailwind',
      hash: 'a1c8f33',
      time: '6m',
    },
    {
      status: 'Queued',
      color: 'gray',
      message: 'docs: rewrite the home showcase',
      branch: 'docs/home',
      hash: '9e2b7a4',
      time: '8m',
    },
  ];

  // ── 3 · Range budget filter ────────────────────────────────────────────
  readonly priceKeySteps: NxpKeySteps = [
    [0, 50_000],
    [25, 200_000],
    [50, 1_000_000],
    [75, 5_000_000],
    [100, 30_000_000],
  ];
  readonly priceRange = signal<[number, number]>([200_000, 5_000_000]);
  readonly budgetLabel = computed(
    () =>
      `${this.money(this.priceRange()[0])} – ${this.money(this.priceRange()[1])}`,
  );

  private money(n: number): string {
    if (n >= 1_000_000)
      return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
    return `$${n}`;
  }

  // ── 4 · Menu settings navigator ────────────────────────────────────────
  readonly settings: readonly SettingSection[] = [
    {
      label: 'Profile',
      icon: 'ri-user-3-line',
      title: 'Profile',
      hint: 'How you appear across the workspace.',
    },
    {
      label: 'Appearance',
      icon: 'ri-palette-line',
      title: 'Appearance',
      hint: 'Theme, density, and accent colour.',
    },
    {
      label: 'Notifications',
      icon: 'ri-notification-3-line',
      title: 'Notifications',
      hint: 'Decide what is worth a ping.',
    },
    {
      label: 'API keys',
      icon: 'ri-key-2-line',
      title: 'API keys',
      hint: 'Tokens used by the CLI and edge runtime.',
    },
  ];
  readonly settingsIndex = signal<number | null>(0);
  readonly activeSection = computed(
    () => this.settings[this.settingsIndex() ?? 0],
  );

  // ── 5 · Select transfer-to-team ────────────────────────────────────────
  readonly teams: readonly Team[] = [
    { id: 'edge', name: 'Edge Runtime', org: 'Platform' },
    { id: 'core', name: 'Core Framework', org: 'Platform' },
    { id: 'dx', name: 'Developer Experience', org: 'Product' },
    { id: 'growth', name: 'Growth', org: 'Product' },
    { id: 'design', name: 'Design Systems', org: 'Design' },
    { id: 'brand', name: 'Brand Studio', org: 'Design' },
  ];
  readonly teamCtrl = new FormControl<string | null>('edge');
  private readonly teamId = toSignal(this.teamCtrl.valueChanges, {
    initialValue: this.teamCtrl.value,
  });
  readonly selectedTeam = computed(
    () => this.teams.find((t) => t.id === this.teamId()) ?? null,
  );

  // ── 6 · Tree repository explorer ───────────────────────────────────────
  readonly repoTree: readonly RepoNode[] = [
    {
      name: 'apps',
      kind: 'folder',
      children: [
        {
          name: 'showcase',
          kind: 'folder',
          children: [{ name: 'src', kind: 'folder' }],
        },
      ],
    },
    {
      name: 'libs',
      kind: 'folder',
      children: [
        { name: 'cdk', kind: 'folder' },
        { name: 'core', kind: 'folder' },
        { name: 'components', kind: 'folder' },
      ],
    },
    { name: 'package.json', kind: 'file' },
    { name: 'README.md', kind: 'file' },
  ];
  readonly repoChildren = (n: RepoNode): readonly RepoNode[] =>
    n.children ?? [];

  // ── 8 · Accordion FAQ ──────────────────────────────────────────────────
  readonly faqs: Faq[] = [
    {
      title: 'What is ngxpro?',
      content:
        'A production-ready Angular UI library combining Taiga UI architecture patterns with Tremor Tailwind styling and fluid motion.',
      icon: 'ri-stack-line',
    },
    {
      title: 'Is it built on Taiga UI?',
      content:
        'No — Taiga is a reference for architecture only. Every component is built from scratch and styled 100% with Tailwind.',
      icon: 'ri-css3-line',
    },
    {
      title: 'How do I install it?',
      content:
        'Run npm i @ngxpro/components --legacy-peer-deps, then import the secondary entry point for the component you need.',
      icon: 'ri-download-2-line',
    },
  ];

  // ── 10 · Notification toasts ───────────────────────────────────────────
  readonly toasts: readonly ToastRow[] = [
    {
      appearance: 'success',
      label: 'Success',
      blurb: 'Production deployment is live.',
      icon: 'ri-checkbox-circle-line',
    },
    {
      appearance: 'info',
      label: 'Info',
      blurb: 'A new preview is building on the edge.',
      icon: 'ri-information-line',
    },
    {
      appearance: 'warning',
      label: 'Warning',
      blurb: 'Your plan is approaching its bandwidth limit.',
      icon: 'ri-alert-line',
    },
    {
      appearance: 'error',
      label: 'Error',
      blurb: 'Build failed — type error in app.ts.',
      icon: 'ri-close-circle-line',
    },
  ];

  fireToast(t: ToastRow): void {
    this.notifications.open(t.blurb, {
      appearance: t.appearance,
      label: t.label,
      autoClose: 4000,
    });
  }

  toastIconColor(appearance: ToastRow['appearance']): string {
    switch (appearance) {
      case 'success':
        return 'text-status-positive';
      case 'warning':
        return 'text-status-warning';
      case 'error':
        return 'text-status-negative';
      default:
        return 'text-status-info';
    }
  }

  // ── 11 · Input chip invite teammates ───────────────────────────────────
  readonly inviteCtrl = new FormControl<string[]>(['ada@ngxpro.dev']);
  readonly inviteSuggestions = [
    'lina@ngxpro.dev',
    'diego@ngxpro.dev',
    'mara@ngxpro.dev',
  ];
  private readonly inviteValue = toSignal(this.inviteCtrl.valueChanges, {
    initialValue: this.inviteCtrl.value,
  });
  readonly inviteCount = computed(() => this.inviteValue()?.length ?? 0);

  isInvited(email: string): boolean {
    return this.inviteCtrl.value?.includes(email) ?? false;
  }

  addInvite(email: string): void {
    const current = this.inviteCtrl.value ?? [];
    if (current.includes(email)) return;
    this.inviteCtrl.setValue([...current, email]);
  }

  // ── 12 · Data list region picker ───────────────────────────────────────
  readonly selectedRegion = signal('iad1');
  readonly regions: Region[] = [
    { code: 'iad1', name: 'Washington, D.C.', latency: 12, nearest: true },
    { code: 'sfo1', name: 'San Francisco', latency: 68 },
    { code: 'cdg1', name: 'Paris', latency: 96 },
    { code: 'fra1', name: 'Frankfurt', latency: 104 },
    { code: 'hnd1', name: 'Tokyo', latency: 158 },
  ];

  constructor() {
    afterNextRender(() => {
      const rotate = setInterval(() => {
        this.verbIndex.update((i) => (i + 1) % this.verbs.length);
      }, 2400);
      const metrics = setInterval(() => this.refreshMetrics(), 3600);
      this.destroyRef.onDestroy(() => {
        clearInterval(rotate);
        clearInterval(metrics);
        this.clearDeployTimers();
        if (this.copyResetId !== null) clearTimeout(this.copyResetId);
      });
    });
  }
}
