import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpMapperPipe } from '@ngxpro/cdk';
import { NxpCheckboxComponent } from '@ngxpro/cdk/components/checkbox';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  NxpTree,
  nxpComputeTreeChecked,
  nxpToggleTreeChecked,
} from '@ngxpro/components/tree';
import { TreeApiComponent } from './tree-api.component';

// ─── Domain types ────────────────────────────────────────────────────────────

interface FileNode {
  readonly name: string;
  readonly kind: 'folder' | 'file';
  readonly children?: readonly FileNode[];
}

interface PersonNode {
  readonly name: string;
  readonly role: string;
  readonly status: 'on' | 'away' | 'off';
  readonly reports?: readonly PersonNode[];
}

type JsonValue = string | number | boolean | null;
type JsonType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

interface JsonNode {
  readonly key: string;
  readonly type: JsonType;
  readonly value?: JsonValue;
  readonly children?: readonly JsonNode[];
}

interface PageNode {
  readonly title: string;
  readonly path: string;
  readonly state?: 'live' | 'draft' | 'redirect';
  readonly pages?: readonly PageNode[];
}

interface TaxonNode {
  readonly name: string;
  readonly rank:
    | 'Kingdom'
    | 'Phylum'
    | 'Class'
    | 'Order'
    | 'Family'
    | 'Genus'
    | 'Species';
  readonly children?: readonly TaxonNode[];
}

interface ManualNode {
  readonly name: string;
  readonly kind: 'folder' | 'file';
  readonly children?: readonly ManualNode[];
}

interface SelectableNode {
  readonly text: string;
  readonly children?: readonly SelectableNode[];
}

// ─── Datasets ────────────────────────────────────────────────────────────────

const REPO_TREE: readonly FileNode[] = [
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

const ORG_TREE: readonly PersonNode[] = [
  {
    name: 'Anya Voss',
    role: 'Chief Executive',
    status: 'on',
    reports: [
      {
        name: 'Marcus Reid',
        role: 'VP, Engineering',
        status: 'on',
        reports: [
          { name: 'Lina Park', role: 'Frontend Lead', status: 'away' },
          { name: 'Diego Ruiz', role: 'Backend Lead', status: 'on' },
        ],
      },
      {
        name: 'Cleo Hart',
        role: 'VP, Design',
        status: 'on',
        reports: [{ name: 'Mira Solé', role: 'Senior Designer', status: 'on' }],
      },
    ],
  },
];

const JSON_TREE: readonly JsonNode[] = [
  {
    key: 'session',
    type: 'object',
    children: [
      { key: 'token', type: 'string', value: '0xa9f2···' },
      {
        key: 'user',
        type: 'object',
        children: [
          { key: 'id', type: 'number', value: 4072 },
          { key: 'verified', type: 'boolean', value: true },
        ],
      },
      { key: 'expires', type: 'string', value: '2026-12-31' },
    ],
  },
];

const SITEMAP_TREE: readonly PageNode[] = [
  { title: 'Index', path: '/', state: 'live' },
  {
    title: 'Atelier',
    path: '/atelier',
    state: 'live',
    pages: [
      { title: 'Manifest', path: '/atelier/manifest', state: 'live' },
      { title: 'Press', path: '/atelier/press', state: 'draft' },
    ],
  },
  {
    title: 'Catalogue',
    path: '/catalogue',
    state: 'live',
    pages: [
      { title: 'Spring 26', path: '/catalogue/ss-26', state: 'live' },
      { title: 'Archive', path: '/archive', state: 'redirect' },
    ],
  },
];

const TAXONOMY_TREE: readonly TaxonNode[] = [
  {
    name: 'Animalia',
    rank: 'Kingdom',
    children: [
      {
        name: 'Chordata',
        rank: 'Phylum',
        children: [
          {
            name: 'Mammalia',
            rank: 'Class',
            children: [
              {
                name: 'Carnivora',
                rank: 'Order',
                children: [
                  {
                    name: 'Felidae',
                    rank: 'Family',
                    children: [
                      {
                        name: 'Panthera',
                        rank: 'Genus',
                        children: [
                          { name: 'P. tigris', rank: 'Species' },
                          { name: 'P. leo', rank: 'Species' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const MANUAL_TREE: readonly ManualNode[] = [
  {
    name: 'src',
    kind: 'folder',
    children: [
      { name: 'main.ts', kind: 'file' },
      { name: 'app.ts', kind: 'file' },
    ],
  },
  {
    name: 'tests',
    kind: 'folder',
    children: [{ name: 'unit.spec.ts', kind: 'file' }],
  },
  { name: 'README.md', kind: 'file' },
];

const SELECTABLE_TREE: SelectableNode = {
  text: 'Resources',
  children: [
    {
      text: 'Documents',
      children: [
        { text: 'Annual report.pdf' },
        { text: 'Q3 review.pdf' },
        { text: 'Onboarding.docx' },
      ],
    },
    {
      text: 'Media',
      children: [
        { text: 'Brand guidelines.png' },
        { text: 'Hero footage.mov' },
      ],
    },
    {
      text: 'Code',
      children: [{ text: 'tree.spec.ts' }, { text: 'tree.utils.ts' }],
    },
  ],
};

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NxpTree,
    NxpMapperPipe,
    NxpCheckboxComponent,
    NxpLabelDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    TreeApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Tree"
      package="components"
      type="component"
      path="components/tree"
    >
      <p class="text-base text-text-secondary mb-6">
        Recursive, generic tree primitive. Provide a list of root values, a
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >childrenHandler</code
        >, and an optional
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[content]</code
        >
        template — the component renders itself recursively, with depth,
        expansion state, and a chevron toggle handled for you.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Default"
          description="Wrap roots in a [nxpTreeController] and render each with <nxp-tree>. Falls back to the value as text when no [content] template is provided."
        >
          <div nxpTreeController class="max-w-md">
            @for (item of repoTree; track item.name) {
              <nxp-tree
                [value]="item"
                [childrenHandler]="getRepoChildren"
                [content]="repoTpl"
              />
            }
          </div>

          <ng-template #repoTpl let-item>
            <span class="inline-flex w-full items-center gap-2 text-sm">
              <span>{{ item.name }}</span>
              @if (item.kind === 'folder') {
                <span class="text-gray-400">/</span>
              }
            </span>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Custom row template"
          description="Pass a TemplateRef to [content]. The chevron and indent are handled — you control everything inside the row."
        >
          <div nxpTreeController class="max-w-md">
            @for (person of orgTree; track person.name) {
              <nxp-tree
                [value]="person"
                [childrenHandler]="getOrgChildren"
                [content]="orgTpl"
              />
            }
          </div>

          <ng-template #orgTpl let-person>
            <span class="flex w-full min-w-0 items-center gap-3">
              <span
                class="grid size-7 shrink-0 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium"
                aria-hidden="true"
              >
                {{ initials(person.name) }}
              </span>
              <span class="flex min-w-0 flex-1 flex-col leading-tight">
                <span class="truncate text-sm font-medium">{{
                  person.name
                }}</span>
                <span class="truncate text-xs text-gray-500 dark:text-gray-400">
                  {{ person.role }}
                </span>
              </span>
              <span
                class="size-1.5 shrink-0 rounded-full"
                [class]="statusClass(person.status)"
                [attr.aria-label]="statusLabel(person.status)"
              ></span>
            </span>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Generic typing"
          description="NxpTreeComponent<T> is generic — the type parameter flows through [value], [childrenHandler] and the $implicit variable inside the template."
        >
          <div nxpTreeController class="max-w-md">
            @for (node of jsonTree; track node.key) {
              <nxp-tree
                [value]="node"
                [childrenHandler]="getJsonChildren"
                [content]="jsonTpl"
              />
            }
          </div>

          <ng-template #jsonTpl let-node>
            <span class="flex w-full items-baseline gap-2 text-sm">
              <span class="font-mono">{{ node.key }}</span>
              @if (node.type === 'object' || node.type === 'array') {
                <span
                  class="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500"
                >
                  {{ node.type }}
                </span>
              } @else {
                <span class="text-gray-400">:</span>
                <span
                  class="font-mono truncate"
                  [class]="jsonValueClass(node.type)"
                >
                  {{ jsonValueLabel(node) }}
                </span>
              }
            </span>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Deep nesting"
          description="Renders arbitrary depth. State is per-instance — each <nxp-tree> bumps NXP_TREE_LEVEL via DI."
        >
          <div nxpTreeController class="max-w-md">
            @for (taxon of taxonomyTree; track taxon.name) {
              <nxp-tree
                [value]="taxon"
                [childrenHandler]="getTaxonChildren"
                [content]="taxonTpl"
              />
            }
          </div>

          <ng-template #taxonTpl let-taxon>
            <span class="flex w-full items-baseline gap-2 text-sm">
              <span
                class="w-16 shrink-0 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500"
              >
                {{ taxon.rank }}
              </span>
              <span>{{ taxon.name }}</span>
            </span>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="State chip"
          description="A different shape — state badge on the right rail."
        >
          <div nxpTreeController class="max-w-md">
            @for (page of sitemapTree; track page.path) {
              <nxp-tree
                [value]="page"
                [childrenHandler]="getSitemapChildren"
                [content]="sitemapTpl"
              />
            }
          </div>

          <ng-template #sitemapTpl let-page>
            <span class="flex w-full min-w-0 items-baseline gap-2 text-sm">
              <span class="truncate">{{ page.title }}</span>
              <span
                class="truncate text-xs text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              >
                {{ page.path }}
              </span>
              @if (page.state && page.state !== 'live') {
                <span
                  class="ml-auto inline-flex items-center rounded border px-1.5 py-px text-[10px] uppercase tracking-wide"
                  [class]="stateClass(page.state)"
                >
                  {{ page.state }}
                </span>
              }
            </span>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Typed controller"
          description="Add map to track expansion in a Map<T, boolean> keyed by data value. Each row registers via [nxpTreeNode]; (toggled) emits the data value."
        >
          <div
            nxpTreeController
            map
            (toggled)="logManualToggle($event)"
            class="max-w-md"
          >
            @for (root of manualTree; track root.name) {
              <nxp-tree-item [nxpTreeNode]="root">
                <nxp-tree-item-content>
                  <span class="text-sm">
                    {{ root.name }}{{ root.kind === 'folder' ? '/' : '' }}
                  </span>
                </nxp-tree-item-content>
                @for (child of root.children ?? []; track child.name) {
                  <nxp-tree
                    [value]="child"
                    [childrenHandler]="noChildren"
                    [content]="manualLeafTpl"
                  />
                }
              </nxp-tree-item>
            }
          </div>

          <ng-template #manualLeafTpl let-leaf>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ leaf.name }}
            </span>
          </ng-template>

          <div class="mt-4 max-w-md">
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                (toggled) event log
              </p>
              <button
                type="button"
                class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                (click)="clearLog()"
              >
                Clear
              </button>
            </div>
            @if (toggleLog().length === 0) {
              <p class="text-xs italic text-gray-400 dark:text-gray-500">
                Toggle a row to see events.
              </p>
            } @else {
              <ul class="space-y-0.5">
                @for (line of toggleLog(); track $index) {
                  <li
                    class="text-xs font-mono tabular-nums text-gray-600 dark:text-gray-400"
                  >
                    {{ line }}
                  </li>
                }
              </ul>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Selection state"
          description="Compose nxp-checkbox, the nxpMapper pipe, and two pure helpers — nxpComputeTreeChecked derives a parent's tri-state from descendants; nxpToggleTreeChecked cascades a click."
        >
          <div [nxpTreeController]="true" class="max-w-md">
            @for (item of selectableData.children ?? []; track item.text) {
              <nxp-tree
                [childrenHandler]="selectableHandler"
                [content]="selectionTpl"
                [value]="item"
              />
            }
          </div>

          <ng-template #selectionTpl let-item>
            <div class="inline-flex w-full cursor-pointer items-center gap-2">
              <nxp-checkbox
                size="m"
                [ngModel]="item | nxpMapper: getSelectionValue : selectionMap()"
                (ngModelChange)="onSelectionChecked(item, $event)"
              />
              <span class="text-sm">{{ item.text }}</span>
            </div>
          </ng-template>

          <div class="mt-4 max-w-md flex items-baseline justify-between">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Selected · {{ selectedLeaves().length }}
            </p>
            <button
              type="button"
              class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              (click)="clearSelection()"
            >
              Reset
            </button>
          </div>
          @if (selectedLeaves().length > 0) {
            <ul class="mt-2 flex flex-wrap gap-1.5 max-w-md">
              @for (leaf of selectedLeaves(); track leaf) {
                <li
                  class="rounded border border-gray-200 dark:border-gray-800 px-1.5 py-px text-xs"
                >
                  {{ leaf }}
                </li>
              }
            </ul>
          }
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-tree-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class TreeDemoComponent {
  protected readonly repoTree = REPO_TREE;
  protected readonly orgTree = ORG_TREE;
  protected readonly jsonTree = JSON_TREE;
  protected readonly sitemapTree = SITEMAP_TREE;
  protected readonly taxonomyTree = TAXONOMY_TREE;
  protected readonly manualTree = MANUAL_TREE;
  protected readonly selectableData = SELECTABLE_TREE;

  protected readonly toggleLog = signal<readonly string[]>([]);

  protected logManualToggle(node: ManualNode): void {
    const t = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.toggleLog.update((prev) =>
      [`${t}  toggled  "${node.name}"`, ...prev].slice(0, 6),
    );
  }

  protected clearLog(): void {
    this.toggleLog.set([]);
  }

  protected readonly getRepoChildren = (n: FileNode): readonly FileNode[] =>
    n.children ?? [];

  protected readonly getOrgChildren = (p: PersonNode): readonly PersonNode[] =>
    p.reports ?? [];

  protected readonly getJsonChildren = (n: JsonNode): readonly JsonNode[] =>
    n.children ?? [];

  protected readonly getSitemapChildren = (p: PageNode): readonly PageNode[] =>
    p.pages ?? [];

  protected readonly getTaxonChildren = (t: TaxonNode): readonly TaxonNode[] =>
    t.children ?? [];

  protected readonly noChildren = (): readonly ManualNode[] => [];

  protected readonly selectableHandler = (
    n: SelectableNode,
  ): readonly SelectableNode[] => n.children ?? [];

  protected readonly selectionMap = signal<
    ReadonlyMap<SelectableNode, boolean | null>
  >(new Map());

  protected readonly getSelectionValue = (
    item: SelectableNode,
    map: ReadonlyMap<SelectableNode, boolean | null>,
  ): boolean | null => nxpComputeTreeChecked(item, map, this.selectableHandler);

  protected readonly onSelectionChecked = (
    item: SelectableNode,
    value: boolean,
  ): void => {
    this.selectionMap.set(
      nxpToggleTreeChecked(
        item,
        value,
        this.selectionMap(),
        this.selectableHandler,
      ),
    );
  };

  protected readonly clearSelection = (): void => {
    this.selectionMap.set(new Map());
  };

  protected readonly selectedLeaves = computed(() => {
    const map = this.selectionMap();
    const out: string[] = [];
    const walk = (node: SelectableNode): void => {
      const kids = this.selectableHandler(node);
      if (kids.length === 0) {
        if (map.get(node) === true) out.push(node.text);
        return;
      }
      kids.forEach(walk);
    };
    walk(this.selectableData);
    return out;
  });

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  protected statusClass(status: PersonNode['status']): string {
    switch (status) {
      case 'on':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-500';
      case 'off':
        return 'bg-gray-400 dark:bg-gray-600';
    }
  }

  protected statusLabel(status: PersonNode['status']): string {
    switch (status) {
      case 'on':
        return 'Online';
      case 'away':
        return 'Away';
      case 'off':
        return 'Offline';
    }
  }

  protected jsonValueClass(type: JsonType): string {
    switch (type) {
      case 'string':
        return 'text-amber-700 dark:text-amber-300';
      case 'number':
        return 'text-sky-700 dark:text-sky-300 tabular-nums';
      case 'boolean':
        return 'text-fuchsia-700 dark:text-fuchsia-300';
      case 'null':
        return 'opacity-50 italic';
      default:
        return '';
    }
  }

  protected jsonValueLabel(node: JsonNode): string {
    if (node.type === 'string') return `"${node.value}"`;
    if (node.type === 'null') return 'null';
    return String(node.value);
  }

  protected stateClass(state: NonNullable<PageNode['state']>): string {
    switch (state) {
      case 'draft':
        return 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300';
      case 'redirect':
        return 'border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300';
      case 'live':
        return 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300';
    }
  }
}
