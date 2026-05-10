import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxpMapperPipe } from '@ngxpro/cdk';
import { NxpCheckboxDirective } from '@ngxpro/cdk/components/checkbox';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import {
  NxpTree,
  nxpComputeTreeChecked,
  nxpToggleTreeChecked,
} from '@ngxpro/components/tree';

// ─── Domain types ────────────────────────────────────────────────────────────

interface FileNode {
  readonly name: string;
  readonly kind: 'folder' | 'file';
  readonly ext?: string;
  readonly size?: string;
  readonly children?: readonly FileNode[];
}

interface PersonNode {
  readonly name: string;
  readonly role: string;
  readonly team: 'eng' | 'design' | 'product' | 'office';
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
  readonly italic?: boolean;
  readonly children?: readonly TaxonNode[];
}

// ─── Datasets ─────────────────────────────────────────────────────────────────

const REPO_TREE: readonly FileNode[] = [
  {
    name: 'apps',
    kind: 'folder',
    children: [
      {
        name: 'showcase',
        kind: 'folder',
        children: [
          {
            name: 'src',
            kind: 'folder',
            children: [
              {
                name: 'app',
                kind: 'folder',
                children: [
                  {
                    name: 'tree',
                    kind: 'folder',
                    children: [
                      {
                        name: 'tree-demo.component.ts',
                        kind: 'file',
                        ext: 'ts',
                        size: '14.2 KB',
                      },
                    ],
                  },
                  {
                    name: 'app.routes.ts',
                    kind: 'file',
                    ext: 'ts',
                    size: '4.2 KB',
                  },
                ],
              },
              {
                name: 'index.html',
                kind: 'file',
                ext: 'html',
                size: '512 B',
              },
              {
                name: 'styles.scss',
                kind: 'file',
                ext: 'scss',
                size: '6.1 KB',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'libs',
    kind: 'folder',
    children: [
      { name: 'cdk', kind: 'folder' },
      { name: 'core', kind: 'folder' },
      {
        name: 'components',
        kind: 'folder',
        children: [
          {
            name: 'tree',
            kind: 'folder',
            children: [
              {
                name: 'tree.component.ts',
                kind: 'file',
                ext: 'ts',
                size: '2.4 KB',
              },
              {
                name: 'tree-item.component.ts',
                kind: 'file',
                ext: 'ts',
                size: '1.8 KB',
              },
            ],
          },
        ],
      },
    ],
  },
  { name: 'nx.json', kind: 'file', ext: 'json', size: '1.1 KB' },
  { name: 'package.json', kind: 'file', ext: 'json', size: '3.4 KB' },
  { name: 'README.md', kind: 'file', ext: 'md', size: '8.7 KB' },
];

const ORG_TREE: readonly PersonNode[] = [
  {
    name: 'Anya Voss',
    role: 'Chief Executive',
    team: 'office',
    status: 'on',
    reports: [
      {
        name: 'Marcus Reid',
        role: 'VP, Engineering',
        team: 'eng',
        status: 'on',
        reports: [
          {
            name: 'Lina Park',
            role: 'Frontend Lead',
            team: 'eng',
            status: 'away',
            reports: [
              {
                name: 'Sam Chen',
                role: 'Senior Engineer',
                team: 'eng',
                status: 'on',
              },
              {
                name: 'Jaya Iyer',
                role: 'Engineer',
                team: 'eng',
                status: 'off',
              },
            ],
          },
          {
            name: 'Diego Ruiz',
            role: 'Backend Lead',
            team: 'eng',
            status: 'on',
            reports: [
              {
                name: 'Ola Hansen',
                role: 'Staff Engineer',
                team: 'eng',
                status: 'on',
              },
              {
                name: 'Ren Tanaka',
                role: 'Engineer',
                team: 'eng',
                status: 'away',
              },
            ],
          },
        ],
      },
      {
        name: 'Cleo Hart',
        role: 'VP, Design',
        team: 'design',
        status: 'on',
        reports: [
          {
            name: 'Mira Solé',
            role: 'Senior Designer',
            team: 'design',
            status: 'on',
          },
          {
            name: 'Felix Bram',
            role: 'Designer',
            team: 'design',
            status: 'away',
          },
        ],
      },
      {
        name: 'Theo Adler',
        role: 'VP, Product',
        team: 'product',
        status: 'off',
        reports: [
          {
            name: 'Quinn Park',
            role: 'Product Manager',
            team: 'product',
            status: 'on',
          },
        ],
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
          {
            key: 'profile',
            type: 'object',
            children: [
              { key: 'name', type: 'string', value: 'Anya Voss' },
              {
                key: 'preferences',
                type: 'object',
                children: [
                  { key: 'theme', type: 'string', value: 'dusk' },
                  { key: 'reduceMotion', type: 'boolean', value: false },
                ],
              },
            ],
          },
          {
            key: 'permissions',
            type: 'array',
            children: [
              { key: '0', type: 'string', value: 'read' },
              { key: '1', type: 'string', value: 'write' },
              { key: '2', type: 'string', value: 'review' },
            ],
          },
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
      { title: 'Process', path: '/atelier/process', state: 'live' },
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
  {
    title: 'Journal',
    path: '/journal',
    state: 'live',
    pages: [
      { title: 'Notes', path: '/journal/notes', state: 'live' },
      { title: 'Field study', path: '/journal/field', state: 'draft' },
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
                        italic: true,
                        children: [
                          {
                            name: 'P. tigris',
                            rank: 'Species',
                            italic: true,
                          },
                          {
                            name: 'P. leo',
                            rank: 'Species',
                            italic: true,
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
    ],
  },
];

// ─── Selectable-tree dataset (checkbox cascade demo) ────────────────────────

interface SelectableNode {
  readonly text: string;
  readonly children?: readonly SelectableNode[];
}

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

// ─── Manual-tree dataset (for the [nxpTreeNode] / Map-controller demo) ──────

interface ManualNode {
  readonly name: string;
  readonly kind: 'folder' | 'file';
  readonly children?: readonly ManualNode[];
}

const MANUAL_TREE: readonly ManualNode[] = [
  {
    name: 'src',
    kind: 'folder',
    children: [
      { name: 'main.ts', kind: 'file' },
      { name: 'app.ts', kind: 'file' },
      { name: 'tree.ts', kind: 'file' },
    ],
  },
  {
    name: 'tests',
    kind: 'folder',
    children: [{ name: 'unit.spec.ts', kind: 'file' }],
  },
  { name: 'README.md', kind: 'file' },
];

// ─── File-system inspector copy ─────────────────────────────────────────────

interface InspectorEntry {
  readonly label: string;
  readonly value: string;
}

interface ApiRow {
  readonly name: string;
  readonly kind:
    | 'input'
    | 'output'
    | 'method'
    | 'computed'
    | 'signal'
    | 'inject'
    | 'projection';
  readonly type: string;
  readonly default: string;
  readonly description: string;
}

interface ApiGroup {
  readonly symbol: string;
  readonly kind: string;
  readonly blurb: string;
  readonly rows: readonly ApiRow[];
}

const INSPECTOR_ENTRIES: readonly InspectorEntry[] = [
  { label: 'Owner', value: 'aki@local' },
  { label: 'Permissions', value: 'rwxr-xr-x' },
  { label: 'Modified', value: '2026-05-09 11:47' },
  { label: 'Size on disk', value: '38.4 MB' },
  { label: 'Items', value: '142 files / 27 folders' },
];

// ─── Component ──────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    FormsModule,
    NxpTree,
    NxpMapperPipe,
    NxpCheckboxDirective,
    NxpLabelDirective,
  ],
  styles: `
    :host {
      display: block;
      --font-display: 'Fraunces', 'Times New Roman', serif;
      --font-jbm:
        'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      --ink: #1c1917; /* stone-900 */
      --paper: #fafaf7;
      --rule: rgba(28, 25, 23, 0.12);
      --accent: #b45309; /* amber-700 */
    }
    :host-context(.dark) {
      --ink: #f5f5f4;
      --paper: #0c0a09;
      --rule: rgba(245, 245, 244, 0.14);
      --accent: #fbbf24; /* amber-400 */
    }

    .font-display {
      font-family: var(--font-display);
      font-feature-settings:
        'ss01' on,
        'ss02' on;
      font-variation-settings:
        'opsz' 144,
        'SOFT' 30,
        'WONK' 0;
      letter-spacing: -0.025em;
    }
    .font-display-italic {
      font-family: var(--font-display);
      font-style: italic;
      font-variation-settings:
        'opsz' 144,
        'SOFT' 80,
        'WONK' 1;
      letter-spacing: -0.02em;
    }
    .font-jbm {
      font-family: var(--font-jbm);
      font-feature-settings:
        'calt' off,
        'liga' off;
    }

    /* Faint blueprint grid */
    .grid-paper {
      background-image:
        linear-gradient(to right, var(--rule) 1px, transparent 1px),
        linear-gradient(to bottom, var(--rule) 1px, transparent 1px);
      background-size: 56px 56px;
      background-position: -1px -1px;
    }

    /* Dotted leader between section tag & title */
    .leader {
      flex: 1;
      align-self: end;
      border-bottom: 1.5px dotted var(--rule);
      margin: 0 0.875rem 0.55rem;
      min-width: 1rem;
    }

    /* Numerical row counter on the left margin (decorative) */
    .row-rule {
      background-image: linear-gradient(
        to bottom,
        var(--rule) 0,
        var(--rule) 1px,
        transparent 1px
      );
      background-size: 100% 28px;
    }

    /* Stagger reveal */
    @keyframes nxp-rise {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .rise {
      animation: nxp-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    }

    /* Rotating folder marker on hover (decorative) */
    .marker {
      transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
    }
    .marker-row:hover .marker {
      transform: rotate(45deg);
    }

    /* JSON tree mono spacing tweak */
    .json-key {
      font-family: var(--font-jbm);
      font-feature-settings: 'zero' on;
    }

    /* Subtle warm paper for light, deep paper for dark */
    .paper {
      background-color: var(--paper);
      color: var(--ink);
    }

    /* Inline kbd-style pill (used for input/output/method kind labels) */
    .api-pill {
      display: inline-flex;
      align-items: center;
      padding: 0.05rem 0.4rem;
      border: 1px solid var(--rule);
      font-family: var(--font-jbm);
      font-size: 9.5px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      line-height: 1.4;
      opacity: 0.7;
    }
    .api-pill[data-kind='input'],
    .api-pill[data-kind='output'] {
      border-color: color-mix(in oklch, var(--accent) 35%, transparent);
      color: var(--accent);
      opacity: 0.85;
    }

    /* Dark code panel — shared shell for all code examples */
    .code-pane {
      background-color: #0c0a09;
      color: #d6d3d1;
      border: 1px solid var(--rule);
    }
    .code-pane pre {
      font-family: var(--font-jbm);
      font-size: 12.5px;
      line-height: 1.65;
    }

    /* Faint columnar gridlines inside the API table */
    .api-table dl {
      display: grid;
      grid-template-columns:
        minmax(0, 1.4fr) minmax(0, 1.7fr) minmax(0, 0.9fr)
        minmax(0, 2.4fr);
      column-gap: 1.25rem;
    }
    @media (max-width: 768px) {
      .api-table dl {
        grid-template-columns: 1fr;
        row-gap: 0.25rem;
      }
    }

    /* DI provider chain ASCII frame */
    .frame {
      border: 1px solid var(--rule);
      background-image: linear-gradient(
        transparent 27px,
        var(--rule) 27px,
        var(--rule) 28px,
        transparent 28px
      );
      background-size: 100% 28px;
    }
  `,
  templateUrl: './tree-demo.component.html',
})
export class TreeDemoComponent {
  // Datasets
  protected readonly repoTree = REPO_TREE;
  protected readonly orgTree = ORG_TREE;
  protected readonly jsonTree = JSON_TREE;
  protected readonly sitemapTree = SITEMAP_TREE;
  protected readonly taxonomyTree = TAXONOMY_TREE;
  protected readonly manualTree = MANUAL_TREE;
  protected readonly selectableData = SELECTABLE_TREE;
  protected readonly inspector = INSPECTOR_ENTRIES;

  // Live (toggled) event log for the typed-controller demo
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

  // Children handlers (one per data shape)
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

  protected readonly getManualChildren = (
    n: ManualNode,
  ): readonly ManualNode[] => n.children ?? [];

  /** No-op children handler used to flatten leaves under a hand-rolled root. */
  protected readonly noChildren = (): readonly ManualNode[] => [];

  // ─── Selectable-tree state ────────────────────────────────────────────────

  protected readonly selectableHandler = (
    n: SelectableNode,
  ): readonly SelectableNode[] => n.children ?? [];

  /** Explicit per-leaf state. Parents are derived in `getSelectionValue`. */
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

  /** Flattened list of currently-selected leaves, for the live readout. */
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

  // Counts (computed lazily so the template stays declarative)
  protected readonly repoCount = computed(() =>
    this.countNodes(this.repoTree, this.getRepoChildren),
  );
  protected readonly orgCount = computed(() =>
    this.countNodes(this.orgTree, this.getOrgChildren),
  );

  // Header metrics
  protected readonly metrics = [
    { label: 'exports', value: '6', detail: 'components + directives' },
    { label: 'tokens', value: '4', detail: 'DI injection tokens' },
    { label: 'types', value: '4', detail: 'public type signatures' },
    { label: 'change detection', value: 'OnPush', detail: 'all components' },
  ];

  // API reference, grouped by symbol
  protected readonly apiGroups: ApiGroup[] = [
    {
      symbol: '<nxp-tree>',
      kind: 'NxpTreeComponent<T>',
      blurb:
        'Recursive container. Renders one row for value(), then recurses for each child returned by childrenHandler().',
      rows: [
        {
          name: '[value]',
          kind: 'input',
          type: 'T | undefined',
          default: '—',
          description:
            'Data item this node represents. If undefined, nothing is rendered.',
        },
        {
          name: '[childrenHandler]',
          kind: 'input',
          type: 'NxpTreeHandler<T>',
          default: 'Array.isArray ? item : []',
          description:
            'Pure function returning the children of a value. Defaults to treating arrays as children.',
        },
        {
          name: '[content]',
          kind: 'input',
          type: 'TemplateRef<NxpTreeItemContext<T>> | null',
          default: 'null',
          description:
            'Optional row template; receives { $implicit, node } context. Falls back to {{ value }} as text.',
        },
        {
          name: 'children',
          kind: 'computed',
          type: 'readonly T[]',
          default: '—',
          description:
            'Resolved children of value(); recomputes when value or handler changes.',
        },
      ],
    },
    {
      symbol: '<nxp-tree-item>',
      kind: 'NxpTreeItemComponent',
      blurb:
        'Wrapper for a single tree row. Auto-detects expandability via contentChildren(NXP_TREE_NODE) and animates open/close with nxp-expand.',
      rows: [
        {
          name: 'expandable',
          kind: 'computed',
          type: 'boolean',
          default: '—',
          description: 'True when at least one child <nxp-tree> is projected.',
        },
        {
          name: 'expanded',
          kind: 'signal',
          type: 'boolean',
          default: 'false',
          description:
            'Bridged from the controller via ngDoCheck on every CD cycle.',
        },
        {
          name: 'level',
          kind: 'inject',
          type: 'number',
          default: '0',
          description:
            'Nesting depth, derived from NXP_TREE_LEVEL provider chain.',
        },
        {
          name: 'toggle()',
          kind: 'method',
          type: '() => void',
          default: '—',
          description:
            'Calls controller.toggle(this) when expandable. No-op otherwise.',
        },
      ],
    },
    {
      symbol: '<nxp-tree-item-content>',
      kind: 'NxpTreeItemContentComponent',
      blurb:
        'Default row renderer. Provides the chevron toggle button, level-based indent, and a slot for projected content.',
      rows: [
        {
          name: 'indentPx',
          kind: 'computed',
          type: 'number',
          default: 'level * 16 + 4',
          description: 'Left padding in pixels driven by injected level.',
        },
        {
          name: '<ng-content>',
          kind: 'projection',
          type: '—',
          default: '—',
          description: 'Slot for the visible row content.',
        },
      ],
    },
    {
      symbol: '[nxpTreeController]',
      kind: 'NxpTreeItemControllerDirective',
      blurb:
        'Default fallback controller. Tracks expansion state with a WeakMap keyed by NxpTreeItemComponent instance — no data identity required.',
      rows: [
        {
          name: 'isExpanded(item)',
          kind: 'method',
          type: '(item) => boolean',
          default: '—',
          description: 'Returns the cached state, or false if unset.',
        },
        {
          name: 'toggle(item)',
          kind: 'method',
          type: '(item) => void',
          default: '—',
          description: 'Flips the cached state.',
        },
      ],
    },
    {
      symbol: '[nxpTreeController][map]',
      kind: 'NxpTreeControllerDirective<T>',
      blurb:
        'Typed controller. Tracks expansion in Map<T, boolean> keyed by data value; emits (toggled) with the value. Requires <nxp-tree-item> to register via [nxpTreeNode].',
      rows: [
        {
          name: '(toggled)',
          kind: 'output',
          type: 'EventEmitter<T>',
          default: '—',
          description: 'Emits the data value of the item that just toggled.',
        },
        {
          name: 'register(item, value)',
          kind: 'method',
          type: '(item, T) => void',
          default: '—',
          description:
            'Registers a component → value mapping. Called by [nxpTreeNode] in ngOnInit.',
        },
        {
          name: 'unregister(item)',
          kind: 'method',
          type: '(item) => void',
          default: '—',
          description: 'Removes the mapping. Called in ngOnDestroy.',
        },
      ],
    },
    {
      symbol: '[nxpTreeNode]',
      kind: 'NxpTreeNodeDirective<T>',
      blurb:
        'Attribute on <nxp-tree-item> that registers the item with a typed controller. Required when using the [map] variant.',
      rows: [
        {
          name: '[nxpTreeNode]',
          kind: 'input',
          type: 'T (required)',
          default: '—',
          description:
            'Data value associated with this row; used as the Map key.',
        },
      ],
    },
  ];

  protected readonly tokens = [
    {
      name: 'NXP_TREE_CONTROLLER',
      type: 'InjectionToken<NxpTreeController>',
      detail:
        'Controls expand/collapse. Default factory returns an always-expanded no-op controller.',
    },
    {
      name: 'NXP_TREE_ACCESSOR',
      type: 'InjectionToken<NxpTreeAccessor<unknown>>',
      detail:
        'Maps tree-item components to data values. Provided by [nxpTreeController][map].',
    },
    {
      name: 'NXP_TREE_NODE',
      type: 'InjectionToken<NxpTreeComponent>',
      detail:
        'References the nearest ancestor <nxp-tree>. Used by tree-item to discover its children.',
    },
    {
      name: 'NXP_TREE_LEVEL',
      type: 'InjectionToken<number>',
      detail:
        'Current nesting depth. Each <nxp-tree> increments it via a useFactory provider.',
    },
  ];

  // ─── Template helpers ──────────────────────────────────────────────────────

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  protected teamLabel(team: PersonNode['team']): string {
    switch (team) {
      case 'eng':
        return 'Engineering';
      case 'design':
        return 'Design';
      case 'product':
        return 'Product';
      case 'office':
        return 'Office';
    }
  }

  protected orgInitialClass(team: PersonNode['team']): string {
    const base = 'border-current/30';
    switch (team) {
      case 'eng':
        return `${base} text-amber-700 dark:text-amber-300 bg-amber-50/40 dark:bg-amber-300/10`;
      case 'design':
        return `${base} text-stone-800 dark:text-stone-200 bg-stone-200/50 dark:bg-stone-200/10`;
      case 'product':
        return `${base} text-emerald-800 dark:text-emerald-300 bg-emerald-50/40 dark:bg-emerald-300/10`;
      case 'office':
        return `${base} text-rose-800 dark:text-rose-300 bg-rose-50/40 dark:bg-rose-300/10`;
    }
  }

  protected statusClass(status: PersonNode['status']): string {
    switch (status) {
      case 'on':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-500';
      case 'off':
        return 'bg-stone-400 dark:bg-stone-600';
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
        return 'border-amber-700/40 text-amber-800 dark:border-amber-300/40 dark:text-amber-300';
      case 'redirect':
        return 'border-sky-700/40 text-sky-800 dark:border-sky-300/40 dark:text-sky-300';
      case 'live':
        return 'border-emerald-700/40 text-emerald-800 dark:border-emerald-300/40 dark:text-emerald-300';
    }
  }

  // ─── Counting helpers (used by section headers) ────────────────────────────

  private countNodes<T>(
    items: readonly T[],
    getChildren: (n: T) => readonly T[],
  ): number {
    return items.reduce(
      (sum, item) => sum + 1 + this.countNodes(getChildren(item), getChildren),
      0,
    );
  }
}
