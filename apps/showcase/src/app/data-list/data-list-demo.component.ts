import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DataListComponent,
  OptionDirective,
  OptGroupDirective,
} from '@ngxpro/components/data-list';
import { NxpCheckboxDirective } from '@ngxpro/cdk/components/checkbox';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DataListApiComponent } from './data-list-api.component';

// ------------------------------------------------------------------ types

interface Person {
  id: string;
  name: string;
  handle: string;
  mono: string;
  role: string;
}

interface Scope {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  destructive?: boolean;
}

interface Command {
  id: string;
  label: string;
  icon: string;
  keys?: string[];
}

interface CommandGroup {
  label: string;
  items: Command[];
}

interface ModelOption {
  id: string;
  name: string;
  vendor: string;
  mono: string;
  context: string;
  recommended?: boolean;
  disabled?: boolean;
  note?: string;
}

interface Region {
  code: string;
  name: string;
  latency: number;
  nearest?: boolean;
}

interface DeployEnv {
  name: string;
  branch: string;
  hash: string;
  when: string;
  status: string;
  dot: string;
  pill: string;
  pulse: boolean;
}

interface Account {
  id: string;
  name: string;
  handle: string;
  mono: string;
  plan: string;
  avatar: string;
  planClass: string;
}

interface AccountGroup {
  label: string;
  items: Account[];
}

@Component({
  selector: 'app-data-list-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    DataListComponent,
    OptionDirective,
    OptGroupDirective,
    NxpCheckboxDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DataListApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="DataList"
      package="components"
      type="component"
      path="components/data-list"
    >
      <p class="text-base text-text-secondary mb-6 max-w-2xl">
        An accessible <code class="font-mono">role="listbox"</code> with
        animated proximity-hover indicators, full keyboard navigation (<kbd
          class="font-mono text-xs"
          >↑</kbd
        >
        <kbd class="font-mono text-xs">↓</kbd>
        <kbd class="font-mono text-xs">Home</kbd>
        <kbd class="font-mono text-xs">End</kbd>), size variants, grouping, a
        two-way <code class="font-mono">selectedIndex</code>, and a graceful
        empty state. It projects plain
        <code class="font-mono">button[nxpOption]</code> children, so anything
        composes inside — checkboxes, avatars, monospace metadata, shortcut caps
        — to build command palettes, pickers, and switchers.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ─────────────────────────────────────────── Playground (API-wired) -->
        <nxp-doc-example
          heading="Playground"
          description="Live wiring of the inputs from the API tab. Tweak label, size, emptyLabel, and class to watch the listbox react."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-full max-w-xs rounded-xl bg-bg-base p-2 shadow-card">
            <nxp-data-list
              [class]="'w-full ' + extraClass()"
              [label]="label()"
              [size]="size()"
              [emptyLabel]="emptyLabel()"
            >
              <button
                nxpOption
                [selected]="playgroundSelected() === 'overview'"
                (click)="playgroundSelected.set('overview')"
              >
                <i
                  class="ri-bar-chart-box-line text-base text-text-tertiary"
                ></i>
                <span class="flex-1">Overview</span>
              </button>
              <button
                nxpOption
                [selected]="playgroundSelected() === 'activity'"
                (click)="playgroundSelected.set('activity')"
              >
                <i class="ri-pulse-line text-base text-text-tertiary"></i>
                <span class="flex-1">Activity</span>
              </button>
              <button
                nxpOption
                [selected]="playgroundSelected() === 'settings'"
                (click)="playgroundSelected.set('settings')"
              >
                <i class="ri-settings-3-line text-base text-text-tertiary"></i>
                <span class="flex-1">Settings</span>
              </button>
              <button nxpOption [disabled]="true">
                <i class="ri-lock-2-line text-base text-text-tertiary"></i>
                <span class="flex-1">Billing</span>
                <span
                  class="ml-auto rounded-full bg-bg-neutral-1 px-2 py-0.5 font-mono text-[10px] text-text-tertiary"
                  >locked</span
                >
              </button>
            </nxp-data-list>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Sizes & empty state -->
        <nxp-doc-example
          heading="Sizes & empty state"
          description="Three density variants — sm, md (default), lg — readable by child options through parent injection, plus the emptyLabel placeholder shown when no options are projected."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div
            class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <!-- sm -->
            <div class="space-y-2.5">
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >sm</span
              >
              <div class="rounded-xl bg-bg-base p-2 shadow-card">
                <nxp-data-list size="sm" label="Sort by" class="w-full">
                  <button
                    nxpOption
                    [selected]="sortBy() === 'relevance'"
                    (click)="sortBy.set('relevance')"
                  >
                    Relevance
                  </button>
                  <button
                    nxpOption
                    [selected]="sortBy() === 'newest'"
                    (click)="sortBy.set('newest')"
                  >
                    Newest first
                  </button>
                  <button
                    nxpOption
                    [selected]="sortBy() === 'oldest'"
                    (click)="sortBy.set('oldest')"
                  >
                    Oldest first
                  </button>
                </nxp-data-list>
              </div>
            </div>

            <!-- md (default) -->
            <div class="space-y-2.5">
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >md · default</span
              >
              <div class="rounded-xl bg-bg-base p-2 shadow-card">
                <nxp-data-list label="Filter issues" class="w-full">
                  <button
                    nxpOption
                    [selected]="statusFilter() === 'all'"
                    (click)="statusFilter.set('all')"
                  >
                    All issues
                  </button>
                  <button
                    nxpOption
                    [selected]="statusFilter() === 'open'"
                    (click)="statusFilter.set('open')"
                  >
                    Open
                  </button>
                  <button
                    nxpOption
                    [selected]="statusFilter() === 'closed'"
                    (click)="statusFilter.set('closed')"
                  >
                    Closed
                  </button>
                  <button nxpOption [disabled]="true">Archived</button>
                </nxp-data-list>
              </div>
            </div>

            <!-- lg -->
            <div class="space-y-2.5">
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >lg</span
              >
              <div class="rounded-xl bg-bg-base p-2 shadow-card">
                <nxp-data-list size="lg" label="Density" class="w-full">
                  <button
                    nxpOption
                    [selected]="viewDensity() === 'comfortable'"
                    (click)="viewDensity.set('comfortable')"
                  >
                    Comfortable
                  </button>
                  <button
                    nxpOption
                    [selected]="viewDensity() === 'cozy'"
                    (click)="viewDensity.set('cozy')"
                  >
                    Cozy
                  </button>
                  <button
                    nxpOption
                    [selected]="viewDensity() === 'compact'"
                    (click)="viewDensity.set('compact')"
                  >
                    Compact
                  </button>
                </nxp-data-list>
              </div>
            </div>

            <!-- empty -->
            <div class="space-y-2.5">
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >empty</span
              >
              <div class="rounded-xl bg-bg-base p-2 shadow-card">
                <nxp-data-list
                  label="Saved views"
                  class="w-full"
                  emptyLabel="No saved views yet"
                />
              </div>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Assignee picker (filter) -->
        <nxp-doc-example
          heading="Assignee picker"
          description="A filterable single-select popover — a native input above the list narrows the options, with monogram avatars, handles in Geist Mono, a trailing check on the active row, and an empty state that echoes the query."
          [content]="{ HTML: assigneeHtml, TypeScript: assigneeTs }"
        >
          <div
            class="w-full max-w-xs overflow-hidden rounded-xl bg-bg-base shadow-card-lg"
          >
            <div
              class="flex items-center gap-2.5 border-b border-border-normal px-3.5"
            >
              <i class="ri-search-line text-base text-text-quaternary"></i>
              <input
                type="text"
                placeholder="Assign to…"
                class="flex-1 bg-transparent py-2.5 text-sm text-text-primary outline-none placeholder:text-text-quaternary"
                [ngModel]="assigneeQuery()"
                (ngModelChange)="assigneeQuery.set($event)"
              />
            </div>
            <div class="p-2">
              <nxp-data-list
                class="w-full"
                label="Assignees"
                [emptyLabel]="'No people match ‘' + assigneeQuery() + '’'"
              >
                @for (p of filteredPeople(); track p.id) {
                  <button
                    nxpOption
                    [selected]="selectedAssignee() === p.id"
                    (click)="selectedAssignee.set(p.id)"
                  >
                    <span
                      class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bg-neutral-2 font-mono text-[11px] font-semibold text-text-primary shadow-border"
                      >{{ p.mono }}</span
                    >
                    <span class="flex min-w-0 flex-col">
                      <span class="truncate text-text-primary">{{
                        p.name
                      }}</span>
                      <span
                        class="truncate font-mono text-xs text-text-tertiary"
                      >
                        {{ p.handle }} · {{ p.role }}
                      </span>
                    </span>
                    <i
                      class="ri-check-line ml-auto shrink-0 text-base text-text-primary transition-opacity duration-fast"
                      [class.opacity-0]="selectedAssignee() !== p.id"
                    ></i>
                  </button>
                }
              </nxp-data-list>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Permission scopes (multi) -->
        <nxp-doc-example
          heading="Permission scopes"
          description="Multi-select via composed checkboxes. Because more than one option carries [selected], the single-selection pill is auto-suppressed — each active row simply brightens its own text while the proximity-hover overlay still tracks the pointer."
          [content]="{ HTML: scopesHtml, TypeScript: scopesTs }"
        >
          <div
            class="w-full max-w-md overflow-hidden rounded-xl bg-bg-base shadow-card"
          >
            <div
              class="flex items-center justify-between border-b border-border-normal px-4 py-2.5"
            >
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >Token scopes</span
              >
              <span class="font-mono text-xs text-text-tertiary"
                >{{ enabledScopeCount() }} / {{ scopes.length }}</span
              >
            </div>
            <div class="p-2">
              <nxp-data-list size="lg" label="Token scopes" class="w-full">
                @for (scope of scopes; track scope.id) {
                  <button
                    nxpOption
                    [selected]="scope.enabled"
                    (click)="scope.enabled = !scope.enabled"
                  >
                    <input
                      type="checkbox"
                      nxpCheckbox
                      size="s"
                      [ngModel]="scope.enabled"
                      (click)="$event.stopPropagation()"
                      (ngModelChange)="scope.enabled = $event"
                    />
                    <span class="flex min-w-0 flex-col">
                      <span class="flex items-center gap-2">
                        <span class="truncate font-mono text-sm">{{
                          scope.label
                        }}</span>
                        @if (scope.destructive) {
                          <span
                            class="rounded-full bg-status-negative-pale px-1.5 py-0.5 text-[10px] font-medium text-status-negative"
                            >destructive</span
                          >
                        }
                      </span>
                      <span class="truncate text-xs text-text-tertiary">{{
                        scope.description
                      }}</span>
                    </span>
                  </button>
                }
              </nxp-data-list>
            </div>
            <div
              class="border-t border-border-normal px-4 py-2.5 text-xs text-text-tertiary"
            >
              Grants:
              <span class="font-mono text-text-secondary">{{
                enabledScopeLabels() || 'none'
              }}</span>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Command palette ⌘K -->
        <nxp-doc-example
          heading="Command palette"
          description="A ⌘K menu: a search field, commands grouped under monospace section headers with leading icons and trailing shortcut caps, and a graceful empty state. Filter, groups, rich content, the proximity indicator, and arrow-key navigation — composed onto one surface."
          [content]="{ HTML: commandHtml, TypeScript: commandTs }"
        >
          <div
            class="w-full max-w-md overflow-hidden rounded-xl bg-bg-base shadow-card-lg"
          >
            <div
              class="flex items-center gap-2.5 border-b border-border-normal px-3.5"
            >
              <i class="ri-search-line text-base text-text-quaternary"></i>
              <input
                type="text"
                placeholder="Type a command or search…"
                class="flex-1 bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-quaternary"
                [ngModel]="cmdQuery()"
                (ngModelChange)="cmdQuery.set($event)"
              />
              <kbd
                class="hidden h-5 items-center rounded-sm px-1.5 font-mono text-[11px] font-medium text-text-tertiary shadow-border-light sm:inline-flex"
                >esc</kbd
              >
            </div>

            <div class="p-2">
              <nxp-data-list
                class="w-full"
                label="Commands"
                [emptyLabel]="'No commands matching “' + cmdQuery() + '”'"
              >
                @for (group of filteredCommands(); track group.label) {
                  <div nxpOptGroup [label]="group.label">
                    <div
                      class="px-2 pb-0.5 pt-1 font-mono text-[10px] font-medium uppercase tracking-wide text-text-quaternary"
                    >
                      {{ group.label }}
                    </div>
                    @for (cmd of group.items; track cmd.id) {
                      <button
                        nxpOption
                        [selected]="cmdSelected() === cmd.id"
                        (click)="cmdSelected.set(cmd.id)"
                      >
                        <i
                          [class]="cmd.icon + ' text-base text-text-tertiary'"
                        ></i>
                        <span class="flex-1 truncate">{{ cmd.label }}</span>
                        @if (cmd.keys; as keys) {
                          <span
                            class="ml-auto flex shrink-0 items-center gap-1"
                          >
                            @for (k of keys; track $index) {
                              <kbd
                                class="inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 font-mono text-[11px] font-medium text-text-tertiary shadow-border-light"
                                >{{ k }}</kbd
                              >
                            }
                          </span>
                        }
                      </button>
                    }
                  </div>
                }
              </nxp-data-list>
            </div>

            <div
              class="flex items-center gap-3 border-t border-border-normal px-3.5 py-2 text-[11px] text-text-tertiary"
            >
              <span class="flex items-center gap-1">
                <kbd
                  class="inline-flex h-4 min-w-4 items-center justify-center rounded-sm font-mono shadow-border-light"
                  >↑</kbd
                >
                <kbd
                  class="inline-flex h-4 min-w-4 items-center justify-center rounded-sm font-mono shadow-border-light"
                  >↓</kbd
                >
                navigate
              </span>
              <span class="flex items-center gap-1">
                <kbd
                  class="inline-flex h-4 min-w-4 items-center justify-center rounded-sm font-mono shadow-border-light"
                  >↵</kbd
                >
                select
              </span>
              <span class="ml-auto flex items-center gap-1.5">
                <i class="ri-command-line text-sm"></i> command menu
              </span>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── AI model picker -->
        <nxp-doc-example
          heading="Model picker"
          description="A rich single-select: provider monogram, model name, context window in Geist Mono, a “Recommended” pill, and a disabled row for a model that isn't ready. Selection is auto-derived from the one option carrying [selected] — no [(selectedIndex)] binding required."
          [content]="{ HTML: modelHtml, TypeScript: modelTs }"
        >
          <div
            class="w-full max-w-sm overflow-hidden rounded-xl bg-bg-base shadow-card-lg"
          >
            <div class="border-b border-border-normal px-4 py-2.5">
              <span
                class="font-mono text-[11px] uppercase tracking-wide text-text-quaternary"
                >Model</span
              >
            </div>
            <div class="p-2">
              <nxp-data-list size="lg" label="Select model" class="w-full">
                @for (model of models; track model.id) {
                  <button
                    nxpOption
                    [selected]="selectedModel() === model.id"
                    [disabled]="model.disabled ?? false"
                    (click)="selectedModel.set(model.id)"
                  >
                    <span
                      class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-bg-neutral-2 font-mono text-xs font-semibold text-text-primary shadow-border"
                      >{{ model.mono }}</span
                    >
                    <span class="flex min-w-0 flex-col">
                      <span class="flex items-center gap-2">
                        <span class="truncate text-text-primary">{{
                          model.name
                        }}</span>
                        @if (model.recommended) {
                          <span
                            class="rounded-full bg-badge-blue-bg px-2 py-0.5 text-[10px] font-medium text-badge-blue-text"
                            >Recommended</span
                          >
                        }
                      </span>
                      <span
                        class="truncate font-mono text-xs text-text-tertiary"
                      >
                        {{ model.vendor }} · {{ model.context }}
                      </span>
                    </span>
                    @if (model.note) {
                      <span
                        class="ml-auto shrink-0 rounded-full bg-bg-neutral-1 px-2 py-0.5 font-mono text-[10px] text-text-tertiary"
                        >{{ model.note }}</span
                      >
                    } @else {
                      <i
                        class="ri-check-line ml-auto shrink-0 text-base text-text-primary transition-opacity duration-fast"
                        [class.opacity-0]="selectedModel() !== model.id"
                      ></i>
                    }
                  </button>
                }
              </nxp-data-list>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Region / edge picker -->
        <nxp-doc-example
          heading="Region picker"
          description="An edge-region selector: the deploy region code in a monospace chip, the city, round-trip latency in Geist Mono, and a “Nearest” badge on the lowest-latency edge. A clean infrastructure list with technical metadata aligned to the right."
          [content]="{ HTML: regionHtml, TypeScript: regionTs }"
        >
          <div class="w-full max-w-sm rounded-xl bg-bg-base p-2 shadow-card">
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
                    class="ml-auto w-14 shrink-0 text-right font-mono text-xs"
                    [class.text-text-primary]="region.nearest"
                    [class.font-medium]="region.nearest"
                    [class.text-text-tertiary]="!region.nearest"
                    >{{ region.latency }} ms</span
                  >
                </button>
              }
            </nxp-data-list>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Deployment target -->
        <nxp-doc-example
          heading="Deployment pipeline"
          description="The Develop → Preview → Production workflow as a selectable listbox. Status dots carry the workflow accent colors in their proper pipeline context, and selection is driven by a two-way [(selectedIndex)] — the Prev / Next buttons set it from outside the list."
          [content]="{ HTML: deployHtml, TypeScript: deployTs }"
        >
          <div class="w-full max-w-md space-y-4">
            <div class="rounded-xl bg-bg-base p-2 shadow-card">
              <nxp-data-list
                class="w-full"
                size="lg"
                label="Deploy target"
                [(selectedIndex)]="deployIndex"
              >
                @for (env of environments; track env.name; let i = $index) {
                  <button
                    nxpOption
                    [selected]="deployIndex() === i"
                    (click)="deployIndex.set(i)"
                  >
                    <span
                      class="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center"
                    >
                      @if (env.pulse) {
                        <span
                          [class]="
                            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ' +
                            env.dot
                          "
                        ></span>
                      }
                      <span
                        [class]="
                          'relative inline-flex h-2.5 w-2.5 rounded-full ' +
                          env.dot
                        "
                      ></span>
                    </span>
                    <span class="flex min-w-0 flex-col">
                      <span class="font-medium text-text-primary">{{
                        env.name
                      }}</span>
                      <span
                        class="truncate font-mono text-xs text-text-tertiary"
                      >
                        {{ env.branch }} · {{ env.hash }} · {{ env.when }}
                      </span>
                    </span>
                    <span
                      [class]="
                        'ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                        env.pill
                      "
                      >{{ env.status }}</span
                    >
                  </button>
                }
              </nxp-data-list>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-text-secondary shadow-border transition-colors duration-fast hover:text-text-primary"
                (click)="cycleDeploy(-1)"
              >
                <i class="ri-arrow-left-s-line"></i> Prev
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-text-secondary shadow-border transition-colors duration-fast hover:text-text-primary"
                (click)="cycleDeploy(1)"
              >
                Next <i class="ri-arrow-right-s-line"></i>
              </button>
              <span class="ml-auto text-text-tertiary">
                Target:
                <strong class="text-text-primary">{{
                  environments[deployIndex() ?? 0]?.name
                }}</strong>
                · index {{ deployIndex() }}
              </span>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────────────────────────── Account switcher -->
        <nxp-doc-example
          heading="Account switcher"
          description="A Vercel-style team switcher: personal and team accounts under monospace section headers, monogram avatars, handles in Geist Mono, plan badges, and a check on the active account. The selected row keeps the animated indicator pinned while the pointer roams."
          [content]="{ HTML: teamHtml, TypeScript: teamTs }"
        >
          <div class="w-full max-w-sm rounded-xl bg-bg-base p-2 shadow-card">
            <nxp-data-list class="w-full" size="lg" label="Switch account">
              @for (group of accountGroups; track group.label) {
                <div nxpOptGroup [label]="group.label">
                  <div
                    class="px-2 pb-0.5 pt-1 font-mono text-[10px] font-medium uppercase tracking-wide text-text-quaternary"
                  >
                    {{ group.label }}
                  </div>
                  @for (acc of group.items; track acc.id) {
                    <button
                      nxpOption
                      [selected]="account() === acc.id"
                      (click)="account.set(acc.id)"
                    >
                      <span
                        [class]="
                          'grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold ' +
                          acc.avatar
                        "
                        >{{ acc.mono }}</span
                      >
                      <span class="flex min-w-0 flex-col">
                        <span class="truncate font-medium text-text-primary">{{
                          acc.name
                        }}</span>
                        <span
                          class="truncate font-mono text-xs text-text-tertiary"
                          >{{ acc.handle }}</span
                        >
                      </span>
                      <span
                        [class]="
                          'ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                          acc.planClass
                        "
                        >{{ acc.plan }}</span
                      >
                      <i
                        class="ri-check-line shrink-0 text-base text-text-primary transition-opacity duration-fast"
                        [class.opacity-0]="account() !== acc.id"
                      ></i>
                    </button>
                  }
                </div>
              }
            </nxp-data-list>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-data-list-api
          [(label)]="label"
          [(emptyLabel)]="emptyLabel"
          [(size)]="size"
          [(class)]="extraClass"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class DataListDemoComponent {
  // ── Playground state (shared with API tab) ──────────────────────────────
  readonly label = signal<string>('Playground list');
  readonly emptyLabel = signal<string>('No options');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly extraClass = signal<string>('');
  readonly playgroundSelected = signal<string | null>('overview');

  // ── Sizes & empty state ─────────────────────────────────────────────────
  readonly sortBy = signal<string>('relevance');
  readonly statusFilter = signal<string>('open');
  readonly viewDensity = signal<string>('comfortable');

  // ── Assignee picker (filterable single-select) ──────────────────────────
  readonly assigneeQuery = signal('');
  readonly selectedAssignee = signal<string | null>('sarah');

  readonly people: Person[] = [
    {
      id: 'sarah',
      name: 'Sarah Chen',
      handle: '@schen',
      mono: 'SC',
      role: 'Maintainer',
    },
    {
      id: 'marco',
      name: 'Marco Rossi',
      handle: '@mrossi',
      mono: 'MR',
      role: 'Reviewer',
    },
    {
      id: 'aisha',
      name: 'Aisha Khan',
      handle: '@akhan',
      mono: 'AK',
      role: 'Triage',
    },
    {
      id: 'tomas',
      name: 'Tomás Vega',
      handle: '@tvega',
      mono: 'TV',
      role: 'Reviewer',
    },
    {
      id: 'yuki',
      name: 'Yuki Tanaka',
      handle: '@ytanaka',
      mono: 'YT',
      role: 'Maintainer',
    },
    {
      id: 'lena',
      name: 'Lena Fischer',
      handle: '@lfischer',
      mono: 'LF',
      role: 'Contributor',
    },
  ];

  readonly filteredPeople = computed<Person[]>(() => {
    const q = this.assigneeQuery().trim().toLowerCase();
    return q
      ? this.people.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.handle.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q),
        )
      : this.people;
  });

  // ── Permission scopes (multi-select) ────────────────────────────────────
  readonly scopes: Scope[] = [
    {
      id: 'read:user',
      label: 'read:user',
      description: 'Read access to profile data',
      enabled: true,
    },
    {
      id: 'repo',
      label: 'repo',
      description: 'Full control of private repositories',
      enabled: true,
    },
    {
      id: 'write:packages',
      label: 'write:packages',
      description: 'Upload and publish packages',
      enabled: false,
    },
    {
      id: 'admin:org',
      label: 'admin:org',
      description: 'Manage organization members and teams',
      enabled: false,
    },
    {
      id: 'delete:repo',
      label: 'delete:repo',
      description: 'Permanently delete repositories',
      enabled: false,
      destructive: true,
    },
  ];

  enabledScopeCount = (): number => this.scopes.filter((s) => s.enabled).length;
  enabledScopeLabels = (): string =>
    this.scopes
      .filter((s) => s.enabled)
      .map((s) => s.label)
      .join(', ');

  // ── Command palette ─────────────────────────────────────────────────────
  readonly cmdQuery = signal('');
  readonly cmdSelected = signal<string | null>('new-project');

  readonly commandGroups: CommandGroup[] = [
    {
      label: 'Suggestions',
      items: [
        {
          id: 'new-project',
          label: 'Create New Project…',
          icon: 'ri-add-box-line',
          keys: ['⌘', 'N'],
        },
        {
          id: 'import-repo',
          label: 'Import Git Repository',
          icon: 'ri-git-branch-line',
          keys: ['⌘', 'I'],
        },
        { id: 'invite', label: 'Invite Team Member', icon: 'ri-user-add-line' },
      ],
    },
    {
      label: 'Navigation',
      items: [
        {
          id: 'dashboard',
          label: 'Go to Dashboard',
          icon: 'ri-dashboard-line',
          keys: ['G', 'H'],
        },
        {
          id: 'deployments',
          label: 'Go to Deployments',
          icon: 'ri-rocket-2-line',
          keys: ['G', 'D'],
        },
        {
          id: 'analytics',
          label: 'Go to Analytics',
          icon: 'ri-line-chart-line',
          keys: ['G', 'A'],
        },
        {
          id: 'domains',
          label: 'Go to Domains',
          icon: 'ri-global-line',
          keys: ['G', 'M'],
        },
      ],
    },
    {
      label: 'Appearance',
      items: [
        {
          id: 'theme-light',
          label: 'Switch to Light Mode',
          icon: 'ri-sun-line',
        },
        {
          id: 'theme-dark',
          label: 'Switch to Dark Mode',
          icon: 'ri-moon-line',
        },
      ],
    },
  ];

  readonly filteredCommands = (): CommandGroup[] => {
    const q = this.cmdQuery().trim().toLowerCase();
    if (!q) return this.commandGroups;
    return this.commandGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((c) => c.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  };

  // ── Model picker ─────────────────────────────────────────────────────────
  readonly selectedModel = signal<string>('opus');

  readonly models: ModelOption[] = [
    {
      id: 'opus',
      name: 'Claude Opus 4.6',
      vendor: 'Anthropic',
      mono: 'A',
      context: '200K context',
      recommended: true,
    },
    {
      id: 'sonnet',
      name: 'Claude Sonnet 4.6',
      vendor: 'Anthropic',
      mono: 'A',
      context: '200K context',
    },
    {
      id: 'haiku',
      name: 'Claude Haiku 4.5',
      vendor: 'Anthropic',
      mono: 'A',
      context: '200K context',
    },
    {
      id: 'gpt',
      name: 'GPT-5',
      vendor: 'OpenAI',
      mono: 'O',
      context: '256K context',
    },
    {
      id: 'llama',
      name: 'Llama 4 Maverick',
      vendor: 'Local · Ollama',
      mono: 'L',
      context: '128K context',
      disabled: true,
      note: 'Pulling…',
    },
  ];

  // ── Region picker ─────────────────────────────────────────────────────────
  readonly selectedRegion = signal<string>('iad1');

  readonly regions: Region[] = [
    { code: 'iad1', name: 'Washington, D.C.', latency: 12, nearest: true },
    { code: 'sfo1', name: 'San Francisco', latency: 68 },
    { code: 'cdg1', name: 'Paris', latency: 96 },
    { code: 'fra1', name: 'Frankfurt', latency: 104 },
    { code: 'hnd1', name: 'Tokyo', latency: 158 },
    { code: 'syd1', name: 'Sydney', latency: 191 },
  ];

  // ── Deployment pipeline ──────────────────────────────────────────────────
  readonly deployIndex = signal<number | null>(2);

  readonly environments: DeployEnv[] = [
    {
      name: 'Development',
      branch: 'feat/edge-cache',
      hash: 'a1b9f02',
      when: 'building now',
      status: 'Building',
      dot: 'bg-accent-develop',
      pill: 'bg-accent-develop/10 text-accent-develop',
      pulse: true,
    },
    {
      name: 'Preview',
      branch: 'fix/auth-retry',
      hash: '7c3d4e1',
      when: '2m ago',
      status: 'Ready',
      dot: 'bg-accent-preview',
      pill: 'bg-accent-preview/10 text-accent-preview',
      pulse: false,
    },
    {
      name: 'Production',
      branch: 'main',
      hash: 'e91f8a0',
      when: '14m ago',
      status: 'Live',
      dot: 'bg-accent-ship',
      pill: 'bg-accent-ship/10 text-accent-ship',
      pulse: false,
    },
  ];

  cycleDeploy(direction: number): void {
    const n = this.environments.length;
    const current = this.deployIndex() ?? 0;
    this.deployIndex.set((current + direction + n) % n);
  }

  // ── Account switcher ──────────────────────────────────────────────────────
  readonly account = signal<string>('acme');

  readonly accountGroups: AccountGroup[] = [
    {
      label: 'Personal Account',
      items: [
        {
          id: 'sarah',
          name: 'Sarah Chen',
          handle: 'sarah-chen',
          mono: 'SC',
          plan: 'Hobby',
          avatar: 'bg-primary text-text-on-accent',
          planClass: 'bg-bg-neutral-1 text-text-tertiary',
        },
      ],
    },
    {
      label: 'Teams',
      items: [
        {
          id: 'acme',
          name: 'Acme Inc.',
          handle: 'acme',
          mono: 'A',
          plan: 'Pro',
          avatar: 'bg-bg-neutral-2 text-text-primary shadow-border',
          planClass: 'bg-badge-blue-bg text-badge-blue-text',
        },
        {
          id: 'monorail',
          name: 'Monorail Labs',
          handle: 'monorail-labs',
          mono: 'M',
          plan: 'Enterprise',
          avatar: 'bg-primary text-text-on-accent',
          planClass: 'bg-primary text-text-on-accent',
        },
        {
          id: 'northwind',
          name: 'Northwind',
          handle: 'northwind',
          mono: 'N',
          plan: 'Hobby',
          avatar: 'bg-bg-neutral-2 text-text-primary shadow-border',
          planClass: 'bg-bg-neutral-1 text-text-tertiary',
        },
      ],
    },
  ];

  // ── Example source snippets shown inside <nxp-doc-example> tabs ─────────
  readonly playgroundHtml = `<nxp-data-list
  [label]="label()"
  [size]="size()"
  [emptyLabel]="emptyLabel()"
>
  <button nxpOption [selected]="selected() === 'overview'" (click)="selected.set('overview')">
    <i class="ri-bar-chart-box-line"></i>
    <span class="flex-1">Overview</span>
  </button>
  <button nxpOption [selected]="selected() === 'activity'" (click)="selected.set('activity')">
    <i class="ri-pulse-line"></i>
    <span class="flex-1">Activity</span>
  </button>
  <button nxpOption [selected]="selected() === 'settings'" (click)="selected.set('settings')">
    <i class="ri-settings-3-line"></i>
    <span class="flex-1">Settings</span>
  </button>
  <button nxpOption [disabled]="true">
    <i class="ri-lock-2-line"></i>
    <span class="flex-1">Billing</span>
  </button>
</nxp-data-list>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-playground',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class DataListPlaygroundExample {
  readonly label = signal<string>('Playground list');
  readonly emptyLabel = signal<string>('No options');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly selected = signal<string | null>('overview');
}`;

  readonly sizesHtml = `<!-- sm -->
<nxp-data-list size="sm" label="Sort by">
  <button nxpOption [selected]="sortBy() === 'relevance'" (click)="sortBy.set('relevance')">Relevance</button>
  <button nxpOption [selected]="sortBy() === 'newest'" (click)="sortBy.set('newest')">Newest first</button>
  <button nxpOption [selected]="sortBy() === 'oldest'" (click)="sortBy.set('oldest')">Oldest first</button>
</nxp-data-list>

<!-- md (default) — note the disabled option -->
<nxp-data-list label="Filter issues">
  <button nxpOption [selected]="statusFilter() === 'all'" (click)="statusFilter.set('all')">All issues</button>
  <button nxpOption [selected]="statusFilter() === 'open'" (click)="statusFilter.set('open')">Open</button>
  <button nxpOption [disabled]="true">Archived</button>
</nxp-data-list>

<!-- lg -->
<nxp-data-list size="lg" label="Density">
  <button nxpOption [selected]="viewDensity() === 'comfortable'" (click)="viewDensity.set('comfortable')">Comfortable</button>
  <button nxpOption [selected]="viewDensity() === 'compact'" (click)="viewDensity.set('compact')">Compact</button>
</nxp-data-list>

<!-- empty state -->
<nxp-data-list label="Saved views" emptyLabel="No saved views yet" />`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

@Component({
  selector: 'app-data-list-sizes',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class DataListSizesExample {
  readonly sortBy = signal('relevance');
  readonly statusFilter = signal('open');
  readonly viewDensity = signal('comfortable');
}`;

  readonly assigneeHtml = `<!-- Search field above the list narrows the options -->
<input
  type="text"
  placeholder="Assign to…"
  [ngModel]="assigneeQuery()"
  (ngModelChange)="assigneeQuery.set($event)"
/>

<nxp-data-list
  label="Assignees"
  [emptyLabel]="'No people match ‘' + assigneeQuery() + '’'"
>
  @for (p of filteredPeople(); track p.id) {
    <button nxpOption [selected]="selectedAssignee() === p.id" (click)="selectedAssignee.set(p.id)">
      <span class="grid h-7 w-7 place-items-center rounded-full bg-bg-neutral-2 font-mono text-[11px] font-semibold shadow-border">
        {{ p.mono }}
      </span>
      <span class="flex flex-col">
        <span>{{ p.name }}</span>
        <span class="font-mono text-xs text-text-tertiary">{{ p.handle }} · {{ p.role }}</span>
      </span>
      <i class="ri-check-line ml-auto" [class.opacity-0]="selectedAssignee() !== p.id"></i>
    </button>
  }
</nxp-data-list>`;

  readonly assigneeTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

interface Person {
  id: string;
  name: string;
  handle: string;
  mono: string;
  role: string;
}

@Component({
  selector: 'app-data-list-assignee',
  imports: [FormsModule, DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignee.html',
})
export class DataListAssigneeExample {
  readonly assigneeQuery = signal('');
  readonly selectedAssignee = signal<string | null>('sarah');

  readonly people: Person[] = [
    { id: 'sarah', name: 'Sarah Chen', handle: '@schen', mono: 'SC', role: 'Maintainer' },
    { id: 'marco', name: 'Marco Rossi', handle: '@mrossi', mono: 'MR', role: 'Reviewer' },
    /* … */
  ];

  readonly filteredPeople = computed(() => {
    const q = this.assigneeQuery().trim().toLowerCase();
    return q
      ? this.people.filter((p) => p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q))
      : this.people;
  });
}`;

  readonly scopesHtml = `<!-- Binding [selected] on 2+ options auto-suppresses the single-selection pill -->
<nxp-data-list size="lg" label="Token scopes">
  @for (scope of scopes; track scope.id) {
    <button nxpOption [selected]="scope.enabled" (click)="scope.enabled = !scope.enabled">
      <input
        type="checkbox"
        nxpCheckbox
        size="s"
        [ngModel]="scope.enabled"
        (click)="$event.stopPropagation()"
        (ngModelChange)="scope.enabled = $event"
      />
      <span class="flex flex-col">
        <span class="flex items-center gap-2">
          <span class="font-mono text-sm">{{ scope.label }}</span>
          @if (scope.destructive) {
            <span class="rounded-full bg-status-negative-pale px-1.5 text-[10px] text-status-negative">destructive</span>
          }
        </span>
        <span class="text-xs text-text-tertiary">{{ scope.description }}</span>
      </span>
    </button>
  }
</nxp-data-list>`;

  readonly scopesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpCheckboxDirective } from '@ngxpro/cdk/components/checkbox';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

interface Scope {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  destructive?: boolean;
}

@Component({
  selector: 'app-data-list-scopes',
  imports: [FormsModule, NxpCheckboxDirective, DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scopes.html',
})
export class DataListScopesExample {
  readonly scopes: Scope[] = [
    { id: 'read:user', label: 'read:user', description: 'Read access to profile data', enabled: true },
    { id: 'repo', label: 'repo', description: 'Full control of private repositories', enabled: true },
    { id: 'delete:repo', label: 'delete:repo', description: 'Permanently delete repositories', enabled: false, destructive: true },
    /* … */
  ];
}`;

  readonly commandHtml = `<!-- Search -->
<input
  type="text"
  placeholder="Type a command or search…"
  [ngModel]="cmdQuery()"
  (ngModelChange)="cmdQuery.set($event)"
/>

<!-- Grouped, filterable command list -->
<nxp-data-list label="Commands" [emptyLabel]="'No commands matching “' + cmdQuery() + '”'">
  @for (group of filteredCommands(); track group.label) {
    <div nxpOptGroup [label]="group.label">
      <div class="px-2 font-mono text-[10px] uppercase text-text-quaternary">{{ group.label }}</div>
      @for (cmd of group.items; track cmd.id) {
        <button nxpOption [selected]="cmdSelected() === cmd.id" (click)="cmdSelected.set(cmd.id)">
          <i [class]="cmd.icon + ' text-text-tertiary'"></i>
          <span class="flex-1 truncate">{{ cmd.label }}</span>
          @if (cmd.keys; as keys) {
            <span class="ml-auto flex items-center gap-1">
              @for (k of keys; track $index) {
                <kbd class="rounded-sm px-1 font-mono shadow-border-light">{{ k }}</kbd>
              }
            </span>
          }
        </button>
      }
    </div>
  }
</nxp-data-list>`;

  readonly commandTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataListComponent, OptGroupDirective, OptionDirective } from '@ngxpro/components/data-list';

interface Command { id: string; label: string; icon: string; keys?: string[]; }

@Component({
  selector: 'app-data-list-command',
  imports: [FormsModule, DataListComponent, OptGroupDirective, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command.html',
})
export class DataListCommandExample {
  readonly cmdQuery = signal('');
  readonly cmdSelected = signal<string | null>('new-project');

  readonly commandGroups = [
    {
      label: 'Suggestions',
      items: [
        { id: 'new-project', label: 'Create New Project…', icon: 'ri-add-box-line', keys: ['⌘', 'N'] },
        { id: 'invite', label: 'Invite Team Member', icon: 'ri-user-add-line' },
      ],
    },
    {
      label: 'Navigation',
      items: [
        { id: 'dashboard', label: 'Go to Dashboard', icon: 'ri-dashboard-line', keys: ['G', 'H'] },
        { id: 'deployments', label: 'Go to Deployments', icon: 'ri-rocket-2-line', keys: ['G', 'D'] },
      ],
    },
  ];

  readonly filteredCommands = () => {
    const q = this.cmdQuery().trim().toLowerCase();
    if (!q) return this.commandGroups;
    return this.commandGroups
      .map((g) => ({ ...g, items: g.items.filter((c) => c.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  };
}`;

  readonly modelHtml = `<!-- Single-select: only one option carries [selected], so the pill auto-derives -->
<nxp-data-list size="lg" label="Select model">
  @for (model of models; track model.id) {
    <button
      nxpOption
      [selected]="selectedModel() === model.id"
      [disabled]="model.disabled ?? false"
      (click)="selectedModel.set(model.id)"
    >
      <span class="grid h-8 w-8 place-items-center rounded-lg bg-bg-neutral-2 font-mono text-xs font-semibold shadow-border">
        {{ model.mono }}
      </span>
      <span class="flex flex-col">
        <span class="flex items-center gap-2">
          {{ model.name }}
          @if (model.recommended) {
            <span class="rounded-full bg-badge-blue-bg px-2 text-[10px] text-badge-blue-text">Recommended</span>
          }
        </span>
        <span class="font-mono text-xs text-text-tertiary">{{ model.vendor }} · {{ model.context }}</span>
      </span>
      @if (model.note) {
        <span class="ml-auto font-mono text-[10px] text-text-tertiary">{{ model.note }}</span>
      } @else {
        <i class="ri-check-line ml-auto" [class.opacity-0]="selectedModel() !== model.id"></i>
      }
    </button>
  }
</nxp-data-list>`;

  readonly modelTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

interface ModelOption {
  id: string;
  name: string;
  vendor: string;
  mono: string;
  context: string;
  recommended?: boolean;
  disabled?: boolean;
  note?: string;
}

@Component({
  selector: 'app-data-list-model',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './model.html',
})
export class DataListModelExample {
  readonly selectedModel = signal<string>('opus');

  readonly models: ModelOption[] = [
    { id: 'opus', name: 'Claude Opus 4.6', vendor: 'Anthropic', mono: 'A', context: '200K context', recommended: true },
    { id: 'sonnet', name: 'Claude Sonnet 4.6', vendor: 'Anthropic', mono: 'A', context: '200K context' },
    { id: 'gpt', name: 'GPT-5', vendor: 'OpenAI', mono: 'O', context: '256K context' },
    { id: 'llama', name: 'Llama 4 Maverick', vendor: 'Local · Ollama', mono: 'L', context: '128K context', disabled: true, note: 'Pulling…' },
  ];
}`;

  readonly regionHtml = `<nxp-data-list size="lg" label="Deploy region">
  @for (region of regions; track region.code) {
    <button nxpOption [selected]="selectedRegion() === region.code" (click)="selectedRegion.set(region.code)">
      <span class="rounded-md bg-bg-neutral-1 px-1.5 py-0.5 font-mono text-[11px] font-medium text-text-secondary">
        {{ region.code }}
      </span>
      <span class="flex-1 truncate">{{ region.name }}</span>
      @if (region.nearest) {
        <span class="rounded-full bg-badge-blue-bg px-2 text-[10px] text-badge-blue-text">Nearest</span>
      }
      <span class="ml-auto w-14 text-right font-mono text-xs"
            [class.text-text-primary]="region.nearest"
            [class.text-text-tertiary]="!region.nearest">{{ region.latency }} ms</span>
    </button>
  }
</nxp-data-list>`;

  readonly regionTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

interface Region { code: string; name: string; latency: number; nearest?: boolean; }

@Component({
  selector: 'app-data-list-region',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './region.html',
})
export class DataListRegionExample {
  readonly selectedRegion = signal<string>('iad1');

  readonly regions: Region[] = [
    { code: 'iad1', name: 'Washington, D.C.', latency: 12, nearest: true },
    { code: 'sfo1', name: 'San Francisco', latency: 68 },
    { code: 'fra1', name: 'Frankfurt', latency: 104 },
    /* … */
  ];
}`;

  readonly deployHtml = `<nxp-data-list size="lg" label="Deploy target" [(selectedIndex)]="deployIndex">
  @for (env of environments; track env.name; let i = $index) {
    <button nxpOption [selected]="deployIndex() === i" (click)="deployIndex.set(i)">
      <span [class]="'h-2.5 w-2.5 rounded-full ' + env.dot"></span>
      <span class="flex flex-col">
        <span class="font-medium">{{ env.name }}</span>
        <span class="font-mono text-xs text-text-tertiary">{{ env.branch }} · {{ env.hash }} · {{ env.when }}</span>
      </span>
      <span [class]="'ml-auto rounded-full px-2 py-0.5 text-[11px] ' + env.pill">{{ env.status }}</span>
    </button>
  }
</nxp-data-list>

<!-- Drive the listbox selection from outside via [(selectedIndex)] -->
<button (click)="cycleDeploy(-1)">Prev</button>
<button (click)="cycleDeploy(1)">Next</button>
<span>Target: {{ environments[deployIndex() ?? 0]?.name }} · index {{ deployIndex() }}</span>`;

  readonly deployTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataListComponent, OptionDirective } from '@ngxpro/components/data-list';

interface DeployEnv {
  name: string; branch: string; hash: string; when: string;
  status: string; dot: string; pill: string;
}

@Component({
  selector: 'app-data-list-deploy',
  imports: [DataListComponent, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deploy.html',
})
export class DataListDeployExample {
  readonly deployIndex = signal<number | null>(2);

  readonly environments: DeployEnv[] = [
    { name: 'Development', branch: 'feat/edge-cache', hash: 'a1b9f02', when: 'building now', status: 'Building', dot: 'bg-accent-develop', pill: 'bg-accent-develop/10 text-accent-develop' },
    { name: 'Preview', branch: 'fix/auth-retry', hash: '7c3d4e1', when: '2m ago', status: 'Ready', dot: 'bg-accent-preview', pill: 'bg-accent-preview/10 text-accent-preview' },
    { name: 'Production', branch: 'main', hash: 'e91f8a0', when: '14m ago', status: 'Live', dot: 'bg-accent-ship', pill: 'bg-accent-ship/10 text-accent-ship' },
  ];

  cycleDeploy(direction: number): void {
    const n = this.environments.length;
    const current = this.deployIndex() ?? 0;
    this.deployIndex.set((current + direction + n) % n);
  }
}`;

  readonly teamHtml = `<nxp-data-list size="lg" label="Switch account">
  @for (group of accountGroups; track group.label) {
    <div nxpOptGroup [label]="group.label">
      <div class="px-2 font-mono text-[10px] uppercase text-text-quaternary">{{ group.label }}</div>
      @for (acc of group.items; track acc.id) {
        <button nxpOption [selected]="account() === acc.id" (click)="account.set(acc.id)">
          <span [class]="'grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold ' + acc.avatar">{{ acc.mono }}</span>
          <span class="flex flex-col">
            <span class="font-medium">{{ acc.name }}</span>
            <span class="font-mono text-xs text-text-tertiary">{{ acc.handle }}</span>
          </span>
          <span [class]="'ml-auto rounded-full px-2 py-0.5 text-[11px] ' + acc.planClass">{{ acc.plan }}</span>
          <i class="ri-check-line" [class.opacity-0]="account() !== acc.id"></i>
        </button>
      }
    </div>
  }
</nxp-data-list>`;

  readonly teamTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataListComponent, OptGroupDirective, OptionDirective } from '@ngxpro/components/data-list';

interface Account {
  id: string; name: string; handle: string; mono: string;
  plan: string; avatar: string; planClass: string;
}

@Component({
  selector: 'app-data-list-team',
  imports: [DataListComponent, OptGroupDirective, OptionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team.html',
})
export class DataListTeamExample {
  readonly account = signal<string>('acme');

  readonly accountGroups = [
    {
      label: 'Personal Account',
      items: [
        { id: 'sarah', name: 'Sarah Chen', handle: 'sarah-chen', mono: 'SC', plan: 'Hobby', avatar: 'bg-primary text-text-on-accent', planClass: 'bg-bg-neutral-1 text-text-tertiary' },
      ],
    },
    {
      label: 'Teams',
      items: [
        { id: 'acme', name: 'Acme Inc.', handle: 'acme', mono: 'A', plan: 'Pro', avatar: 'bg-bg-neutral-2 text-text-primary shadow-border', planClass: 'bg-badge-blue-bg text-badge-blue-text' },
        { id: 'monorail', name: 'Monorail Labs', handle: 'monorail-labs', mono: 'M', plan: 'Enterprise', avatar: 'bg-primary text-text-on-accent', planClass: 'bg-primary text-text-on-accent' },
      ],
    },
  ];
}`;
}
