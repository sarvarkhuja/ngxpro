import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpMenu, NxpNav } from '@ngxpro/components/menu';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { MenuApiComponent } from './menu-api.component';

interface SelectionItem {
  readonly label: string;
  readonly icon: string;
  readonly shortcut: string;
}

interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly initials: string;
}

interface SettingsRow {
  readonly label: string;
  readonly value: string;
}

interface SettingsSection {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly rows: readonly SettingsRow[];
}

interface PaletteCommand {
  readonly label: string;
  readonly icon: string;
  readonly shortcut: string;
}

interface PaletteGroup {
  readonly name: string;
  readonly items: readonly PaletteCommand[];
}

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

/**
 * Menu showcase. The floating surface, the three animated indicator layers
 * (selected pill · proximity-hover · focus ring) and the radio-group
 * `[(checkedIndex)]` model are all supplied by `nxp-menu` itself — every
 * example below only projects `[nxpMenuItem]` rows, styled with the
 * Vercel/Geist semantic tokens (`text-text-*`, `bg-bg-*`, `shadow-border`,
 * the workflow accents).
 *
 * Together the examples exercise the full surface: the bare selection model
 * (wired two-way to the API tab), the canonical menu-inside-a-`nxpDropdown`
 * portal, `checkedIndex` driving a master-detail pane, a ⌘K command palette
 * with non-item headers projected between rows, and the router-aware
 * `nxp-nav` peer whose active item is derived from `Router.isActive()`.
 */
@Component({
  selector: 'app-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    ...NxpDropdown,
    ...NxpMenu,
    ...NxpNav,
    NxpIconComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    MenuApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Menu"
      package="components"
      type="component"
      path="components/menu"
    >
      <p class="max-w-2xl text-base leading-relaxed text-text-secondary">
        An animated menu surface with proximity-hover tracking. Three layered
        indicators — selected pill, hover fill, and focus ring — spring across
        the
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >[nxpMenuItem]</code
        >
        rows via the shared
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >NxpAnimatedProximityBase</code
        >
        from
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >&#64;ngxpro/cdk</code
        >. Selection is a two-way
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >[(checkedIndex)]</code
        >
        radio model; the router-aware
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >nxp-nav</code
        >
        peer shares the same machinery.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ─────────────────────────  Selection menu  ────────────────────── -->
        <nxp-doc-example
          heading="Selection menu"
          description="The bare radio-group model. Hover the rows to watch the proximity indicator spring between them, click to move the selected pill, and use ↑/↓/Home/End to drive it from the keyboard. checkedIndex is bound two-way to the API tab — edit it there and this menu reacts."
          [content]="{ HTML: selectionHtml, TypeScript: selectionTs }"
        >
          <div
            class="flex min-h-56 w-full flex-col items-center justify-center gap-4"
          >
            <nxp-menu class="w-72" [(checkedIndex)]="checkedIndex">
              @for (item of selectionItems; track item.label) {
                <button nxpMenuItem>
                  <nxp-icon
                    [icon]="item.icon"
                    size="sm"
                    class="text-text-tertiary"
                  />
                  <span class="flex-1 text-text-primary">{{ item.label }}</span>
                  <kbd class="font-mono text-[11px] text-text-quaternary">{{
                    item.shortcut
                  }}</kbd>
                </button>
              }
            </nxp-menu>

            <p class="text-xs text-text-tertiary">
              Selected:
              <span class="font-medium text-text-secondary">{{
                selectionItems[checkedIndex() ?? 0].label
              }}</span>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ────────────────────  Workspace menu (portal)  ─────────────────── -->
        <nxp-doc-example
          heading="Workspace switcher"
          description="The canonical pairing — nxp-menu projected into an nxpDropdown portal panel. The panel's overflow-hidden clips the menu's own card shadow, so the two surfaces read as one. (checkedIndexChange) updates the trigger and closes the dropdown via the template's let-close."
          [content]="{ HTML: workspaceHtml, TypeScript: workspaceTs }"
        >
          <div class="flex min-h-56 w-full items-center justify-center">
            <button
              type="button"
              aria-haspopup="menu"
              class="group inline-flex items-center gap-2.5 rounded-m bg-bg-base px-2.5 py-2 text-left shadow-border transition-colors duration-fast hover:bg-bg-neutral-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              [nxpDropdown]="workspaceMenu"
              nxpDropdownAuto
              [nxpDropdownAlign]="'start'"
              [nxpDropdownOffset]="8"
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-m bg-primary text-[11px] font-semibold text-text-on-accent"
                >{{ activeWorkspace().initials }}</span
              >
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium text-text-primary">{{
                  activeWorkspace().name
                }}</span>
                <span class="truncate text-[11px] text-text-tertiary">{{
                  activeWorkspace().domain
                }}</span>
              </span>
              <nxp-icon
                icon="ri-expand-up-down-line"
                size="sm"
                class="ml-2 text-text-tertiary"
              />
            </button>

            <ng-template #workspaceMenu let-close>
              <nxp-menu
                class="w-64"
                [checkedIndex]="workspaceIndex()"
                (checkedIndexChange)="selectWorkspace($event); close()"
              >
                <p
                  class="px-2 pb-0.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
                >
                  Workspaces
                </p>
                @for (w of workspaces; track w.id; let i = $index) {
                  <button nxpMenuItem>
                    <span
                      class="flex size-7 shrink-0 items-center justify-center rounded-sm bg-bg-neutral-1 text-[10px] font-semibold text-text-secondary"
                      >{{ w.initials }}</span
                    >
                    <span class="flex min-w-0 flex-1 flex-col">
                      <span class="truncate font-medium text-text-primary">{{
                        w.name
                      }}</span>
                      <span class="truncate text-[11px] text-text-tertiary">{{
                        w.domain
                      }}</span>
                    </span>
                    @if (workspaceIndex() === i) {
                      <nxp-icon
                        icon="ri-check-line"
                        size="sm"
                        class="text-text-primary"
                      />
                    }
                  </button>
                }
              </nxp-menu>
            </ng-template>
          </div>
        </nxp-doc-example>

        <!-- ─────────────────────  Master-detail settings  ─────────────────── -->
        <nxp-doc-example
          heading="Settings navigator"
          description="checkedIndex doing real work — the menu on the left is the source of truth for the detail pane on the right. A computed() maps the active index onto the rendered section, so selecting a row (mouse or keyboard) swaps the panel content instantly."
          [content]="{ HTML: settingsHtml, TypeScript: settingsTs }"
        >
          <div class="grid w-full gap-5 md:grid-cols-[13rem_minmax(0,1fr)]">
            <nxp-menu class="h-fit w-full" [(checkedIndex)]="settingsIndex">
              @for (section of settings; track section.id) {
                <button nxpMenuItem>
                  <nxp-icon
                    [icon]="section.icon"
                    size="sm"
                    class="text-text-tertiary"
                  />
                  <span class="flex-1 text-text-primary">{{
                    section.label
                  }}</span>
                </button>
              }
            </nxp-menu>

            <div class="min-w-0 rounded-lg bg-bg-base p-5 shadow-border">
              <div class="flex items-center gap-2">
                <nxp-icon
                  [icon]="activeSection().icon"
                  size="md"
                  class="text-text-secondary"
                />
                <h4 class="text-base font-semibold text-text-primary">
                  {{ activeSection().title }}
                </h4>
              </div>
              <p class="mt-1 text-sm leading-relaxed text-text-secondary">
                {{ activeSection().description }}
              </p>
              <dl class="mt-4 space-y-1.5">
                @for (row of activeSection().rows; track row.label) {
                  <div
                    class="flex items-center justify-between rounded-m bg-bg-neutral-1/60 px-3 py-2"
                  >
                    <dt class="text-sm text-text-secondary">{{ row.label }}</dt>
                    <dd class="font-mono text-xs text-text-primary">
                      {{ row.value }}
                    </dd>
                  </div>
                }
              </dl>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ───────────────────────  Command palette  ──────────────────────── -->
        <nxp-doc-example
          heading="Command palette"
          description="A ⌘K surface built entirely inside one nxp-menu. The search field and the group labels are plain projected nodes — the menu only indexes the [nxpMenuItem] rows, and each row's offsetTop accounts for the headers above it, so the springs still land perfectly."
          [content]="{ HTML: paletteHtml, TypeScript: paletteTs }"
        >
          <div
            class="flex min-h-72 w-full flex-col items-center justify-center gap-3"
          >
            <nxp-menu
              class="w-80"
              [checkedIndex]="paletteIndex()"
              (checkedIndexChange)="runCommand($event)"
            >
              <div class="flex items-center gap-2 px-2 py-1.5">
                <nxp-icon
                  icon="ri-search-line"
                  size="sm"
                  class="text-text-tertiary"
                />
                <span class="flex-1 text-sm text-text-quaternary"
                  >Search commands…</span
                >
                <kbd
                  class="rounded-xs bg-bg-neutral-1 px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary"
                  >⌘K</kbd
                >
              </div>
              <div class="mx-1 my-0.5 h-px bg-border-normal"></div>

              @for (group of paletteGroups; track group.name) {
                <p
                  class="px-2 pb-0.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
                >
                  {{ group.name }}
                </p>
                @for (cmd of group.items; track cmd.label) {
                  <button nxpMenuItem>
                    <nxp-icon
                      [icon]="cmd.icon"
                      size="sm"
                      class="text-text-tertiary"
                    />
                    <span class="flex-1 text-text-primary">{{
                      cmd.label
                    }}</span>
                    <kbd class="font-mono text-[11px] text-text-quaternary">{{
                      cmd.shortcut
                    }}</kbd>
                  </button>
                }
              }
            </nxp-menu>

            <p class="h-4 text-xs text-text-tertiary">
              @if (ranCommand(); as label) {
                <span
                  class="inline-flex items-center gap-1 text-text-secondary"
                >
                  <nxp-icon
                    icon="ri-corner-down-left-line"
                    size="xs"
                    class="text-accent-develop"
                  />
                  Ran <span class="font-medium">{{ label }}</span>
                </span>
              }
            </p>
          </div>
        </nxp-doc-example>

        <!-- ────────────────────  Router-aware sidebar nav  ────────────────── -->
        <nxp-doc-example
          heading="Sidebar navigation"
          description="The nxp-nav peer wires the same proximity machinery to the router. Each a[nxpNavItem] derives its active state from Router.isActive() against its routerLink — so the pill sits on whichever page you're viewing (Menu, right now). Hover to preview, click to actually navigate."
          [content]="{ HTML: navHtml, TypeScript: navTs }"
        >
          <div class="flex w-full justify-center">
            <div class="w-64 rounded-xl bg-bg-base p-3 shadow-card">
              <div class="flex items-center gap-2.5 px-2 py-1.5">
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-m bg-primary text-[11px] font-semibold text-text-on-accent"
                  >AC</span
                >
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-text-primary">
                    Acme Platform
                  </p>
                  <p class="truncate text-[11px] text-text-tertiary">
                    acme.dev
                  </p>
                </div>
                <nxp-icon
                  icon="ri-expand-up-down-line"
                  size="sm"
                  class="text-text-tertiary"
                />
              </div>

              <div class="my-2 h-px bg-border-normal"></div>

              <nxp-nav>
                @for (item of navItems; track item.route) {
                  <a nxpNavItem [routerLink]="item.route">
                    <nxp-icon [icon]="item.icon" size="sm" />
                    <span class="flex-1">{{ item.label }}</span>
                  </a>
                }
              </nxp-nav>

              <div class="my-2 h-px bg-border-normal"></div>

              <div class="flex items-center gap-2.5 px-2 py-1.5">
                <span
                  class="flex size-7 shrink-0 items-center justify-center rounded-full bg-bg-neutral-1 text-[10px] font-semibold text-text-secondary"
                  >MK</span
                >
                <span
                  class="min-w-0 flex-1 truncate text-xs text-text-secondary"
                  >Mara Kovač</span
                >
                <nxp-icon
                  icon="ri-settings-3-line"
                  size="sm"
                  class="text-text-tertiary"
                />
              </div>
            </div>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-menu-api [(checkedIndex)]="checkedIndex" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class MenuDemoComponent {
  // ── Selection menu (wired two-way to the API tab) ───────────────────────────
  readonly selectionItems: readonly SelectionItem[] = [
    { label: 'Overview', icon: 'ri-apps-2-line', shortcut: '⌘1' },
    { label: 'Analytics', icon: 'ri-bar-chart-box-line', shortcut: '⌘2' },
    { label: 'Deployments', icon: 'ri-rocket-2-line', shortcut: '⌘3' },
    { label: 'Activity', icon: 'ri-pulse-line', shortcut: '⌘4' },
    { label: 'Settings', icon: 'ri-settings-3-line', shortcut: '⌘5' },
  ];
  readonly checkedIndex = signal<number | null>(0);

  // ── Workspace switcher (menu inside a dropdown portal) ──────────────────────
  readonly workspaces: readonly Workspace[] = [
    { id: 'acme', name: 'Acme Platform', domain: 'acme.dev', initials: 'AC' },
    { id: 'edge', name: 'Edge Labs', domain: 'edge.acme.dev', initials: 'EL' },
    {
      id: 'orbit',
      name: 'Orbit Analytics',
      domain: 'orbit.acme.dev',
      initials: 'OR',
    },
    { id: 'nova', name: 'Nova Studio', domain: 'nova.studio', initials: 'NV' },
  ];
  readonly workspaceIndex = signal<number | null>(0);
  readonly activeWorkspace = computed(
    () => this.workspaces[this.workspaceIndex() ?? 0],
  );
  selectWorkspace(index: number | null): void {
    this.workspaceIndex.set(index);
  }

  // ── Master-detail settings ──────────────────────────────────────────────────
  readonly settings: readonly SettingsSection[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'ri-user-3-line',
      title: 'Profile',
      description: 'How you appear to everyone across the workspace.',
      rows: [
        { label: 'Display name', value: 'Mara Kovač' },
        { label: 'Username', value: '@mara' },
        { label: 'Role', value: 'Owner' },
      ],
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: 'ri-palette-line',
      title: 'Appearance',
      description: 'Tune the interface theme and information density.',
      rows: [
        { label: 'Theme', value: 'System' },
        { label: 'Density', value: 'Comfortable' },
        { label: 'Accent', value: 'Monochrome' },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'ri-notification-3-line',
      title: 'Notifications',
      description: 'Decide what is worth a ping and what can wait.',
      rows: [
        { label: 'Deploys', value: 'All' },
        { label: 'Mentions', value: 'On' },
        { label: 'Weekly digest', value: 'Off' },
      ],
    },
    {
      id: 'api',
      label: 'API keys',
      icon: 'ri-key-2-line',
      title: 'API keys',
      description: 'Tokens used by the CLI and the edge runtime.',
      rows: [
        { label: 'Active tokens', value: '3' },
        { label: 'Last used', value: '2h ago' },
        { label: 'Scope', value: 'deploy:write' },
      ],
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: 'ri-bank-card-line',
      title: 'Billing',
      description: 'Plan, seat usage, and upcoming invoices.',
      rows: [
        { label: 'Plan', value: 'Pro' },
        { label: 'Seats', value: '8 / 10' },
        { label: 'Renews', value: 'Jun 1' },
      ],
    },
  ];
  readonly settingsIndex = signal<number | null>(0);
  readonly activeSection = computed(
    () => this.settings[this.settingsIndex() ?? 0],
  );

  // ── Command palette ─────────────────────────────────────────────────────────
  readonly paletteGroups: readonly PaletteGroup[] = [
    {
      name: 'Jump to',
      items: [
        { label: 'Dashboard', icon: 'ri-dashboard-line', shortcut: 'G D' },
        { label: 'Deployments', icon: 'ri-rocket-2-line', shortcut: 'G P' },
        { label: 'Analytics', icon: 'ri-line-chart-line', shortcut: 'G A' },
      ],
    },
    {
      name: 'Actions',
      items: [
        { label: 'New deployment', icon: 'ri-add-circle-line', shortcut: 'C' },
        { label: 'Invite teammate', icon: 'ri-user-add-line', shortcut: 'I' },
        { label: 'Copy current URL', icon: 'ri-links-line', shortcut: '⌘C' },
      ],
    },
  ];
  readonly paletteFlat: readonly PaletteCommand[] = this.paletteGroups.flatMap(
    (group) => group.items,
  );
  readonly paletteIndex = signal<number | null>(0);
  readonly ranCommand = signal<string | null>(null);
  runCommand(index: number | null): void {
    this.paletteIndex.set(index);
    this.ranCommand.set(
      index == null ? null : (this.paletteFlat[index]?.label ?? null),
    );
  }

  // ── Router-aware sidebar nav (links resolve to live showcase routes) ────────
  readonly navItems: readonly NavItem[] = [
    { label: 'Alert', icon: 'ri-alarm-warning-line', route: '/alert' },
    { label: 'Dialog', icon: 'ri-window-line', route: '/dialog' },
    { label: 'Dropdown', icon: 'ri-arrow-down-s-line', route: '/dropdown' },
    { label: 'Menu', icon: 'ri-menu-line', route: '/menu' },
    { label: 'Tooltip', icon: 'ri-chat-1-line', route: '/tooltip' },
  ];

  // ── Example source snippets shown inside the <nxp-doc-example> code tabs ─────
  readonly selectionHtml = `<nxp-menu class="w-72" [(checkedIndex)]="checkedIndex">
  @for (item of items; track item.label) {
    <button nxpMenuItem>
      <nxp-icon [icon]="item.icon" size="sm" />
      <span class="flex-1">{{ item.label }}</span>
      <kbd>{{ item.shortcut }}</kbd>
    </button>
  }
</nxp-menu>

<p>Selected: {{ items[checkedIndex() ?? 0].label }}</p>`;

  readonly selectionTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpMenu } from '@ngxpro/components/menu';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-selection-menu',
  imports: [...NxpMenu, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selection-menu.html',
})
export class SelectionMenuExample {
  readonly items = [
    { label: 'Overview', icon: 'ri-apps-2-line', shortcut: '⌘1' },
    { label: 'Analytics', icon: 'ri-bar-chart-box-line', shortcut: '⌘2' },
    { label: 'Deployments', icon: 'ri-rocket-2-line', shortcut: '⌘3' },
  ];
  readonly checkedIndex = signal<number | null>(0);
}`;

  readonly workspaceHtml = `<!-- nxp-menu projected into the dropdown portal -->
<button
  [nxpDropdown]="workspaceMenu"
  nxpDropdownAuto
  [nxpDropdownAlign]="'start'"
  aria-haspopup="menu"
>
  <span class="avatar">{{ active().initials }}</span>
  {{ active().name }}
  <nxp-icon icon="ri-expand-up-down-line" />
</button>

<ng-template #workspaceMenu let-close>
  <nxp-menu
    class="w-64"
    [checkedIndex]="index()"
    (checkedIndexChange)="select($event); close()"
  >
    @for (w of workspaces; track w.id) {
      <button nxpMenuItem>
        <span class="avatar">{{ w.initials }}</span>
        <span class="flex-1">{{ w.name }}</span>
      </button>
    }
  </nxp-menu>
</ng-template>`;

  readonly workspaceTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpMenu } from '@ngxpro/components/menu';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-workspace-switcher',
  imports: [...NxpDropdown, ...NxpMenu, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace-switcher.html',
})
export class WorkspaceSwitcherExample {
  readonly workspaces = [/* … */];
  readonly index = signal<number | null>(0);
  readonly active = computed(() => this.workspaces[this.index() ?? 0]);
  select(i: number): void {
    this.index.set(i);
  }
}`;

  readonly settingsHtml = `<div class="grid md:grid-cols-[13rem_1fr] gap-5">
  <nxp-menu [(checkedIndex)]="index">
    @for (section of sections; track section.id) {
      <button nxpMenuItem>
        <nxp-icon [icon]="section.icon" size="sm" />
        {{ section.label }}
      </button>
    }
  </nxp-menu>

  <!-- checkedIndex drives the detail pane -->
  <div class="panel">
    <h4>{{ active().title }}</h4>
    <p>{{ active().description }}</p>
  </div>
</div>`;

  readonly settingsTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NxpMenu } from '@ngxpro/components/menu';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-settings-navigator',
  imports: [...NxpMenu, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-navigator.html',
})
export class SettingsNavigatorExample {
  readonly sections = [/* … */];
  readonly index = signal<number | null>(0);
  readonly active = computed(() => this.sections[this.index() ?? 0]);
}`;

  readonly paletteHtml = `<nxp-menu
  class="w-80"
  [checkedIndex]="index()"
  (checkedIndexChange)="run($event)"
>
  <!-- plain projected nodes — ignored by indexing, measured by layout -->
  <div class="search">
    <nxp-icon icon="ri-search-line" /> Search commands… <kbd>⌘K</kbd>
  </div>
  <div class="divider"></div>

  @for (group of groups; track group.name) {
    <p class="group-label">{{ group.name }}</p>
    @for (cmd of group.items; track cmd.label) {
      <button nxpMenuItem>
        <nxp-icon [icon]="cmd.icon" size="sm" />
        <span class="flex-1">{{ cmd.label }}</span>
        <kbd>{{ cmd.shortcut }}</kbd>
      </button>
    }
  }
</nxp-menu>`;

  readonly paletteTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpMenu } from '@ngxpro/components/menu';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-command-palette',
  imports: [...NxpMenu, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-palette.html',
})
export class CommandPaletteExample {
  readonly groups = [/* { name, items: [{ label, icon, shortcut }] } */];
  readonly flat = this.groups.flatMap((g) => g.items);
  readonly index = signal<number | null>(0);
  run(i: number): void {
    this.index.set(i);
    // dispatch this.flat[i] …
  }
}`;

  readonly navHtml = `<nxp-nav>
  @for (item of items; track item.route) {
    <a nxpNavItem [routerLink]="item.route">
      <nxp-icon [icon]="item.icon" size="sm" />
      {{ item.label }}
    </a>
  }
</nxp-nav>`;

  readonly navTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpNav } from '@ngxpro/components/menu';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterModule, ...NxpNav, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-nav.html',
})
export class SidebarNavExample {
  // a[nxpNavItem] derives its active state from Router.isActive()
  readonly items = [
    { label: 'Dialog', icon: 'ri-window-line', route: '/dialog' },
    { label: 'Dropdown', icon: 'ri-arrow-down-s-line', route: '/dropdown' },
    { label: 'Menu', icon: 'ri-menu-line', route: '/menu' },
  ];
}`;
}
