import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpTree } from '@nxp/components/tree';

interface FileNode {
  name: string;
  children?: FileNode[];
}

const FILE_TREE: FileNode[] = [
  {
    name: 'src',
    children: [
      {
        name: 'app',
        children: [
          { name: 'app.component.ts' },
          { name: 'app.module.ts' },
          { name: 'app.routes.ts' },
        ],
      },
      {
        name: 'assets',
        children: [
          { name: 'logo.svg' },
          { name: 'styles.css' },
        ],
      },
      { name: 'main.ts' },
      { name: 'index.html' },
    ],
  },
  {
    name: 'node_modules',
    children: [
      {
        name: '@angular',
        children: [{ name: 'core' }, { name: 'common' }],
      },
      {
        name: 'rxjs',
        children: [{ name: 'operators' }],
      },
    ],
  },
  { name: 'package.json' },
  { name: 'tsconfig.json' },
  { name: 'README.md' },
];

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NxpTree],
  template: `
    <div class="mx-auto max-w-2xl space-y-8 p-8">
      <div>
        <a
          routerLink="/"
          class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to showcase
        </a>
      </div>

      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-50">Tree</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Hierarchical tree view component with expand/collapse behavior.
        </p>
      </div>

      <!-- Basic file tree -->
      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
          File tree
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Simple mode using <code class="font-mono text-xs">nxpTreeController</code> (no external map).
          All nodes start collapsed; click the chevron to expand.
        </p>

        <div
          nxpTreeController
          class="rounded-lg border border-gray-200 bg-white px-2 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          @for (item of fileTree; track item.name) {
            <nxp-tree [value]="item" [childrenHandler]="getChildren" [content]="nodeTemplate" />
          }
        </div>
      </section>

      <!-- Pre-expanded tree -->
      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Nested node example
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Same data with a narrower subtree shown independently.
        </p>

        <div
          nxpTreeController
          class="rounded-lg border border-gray-200 bg-white px-2 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          @for (item of nestedTree; track item.name) {
            <nxp-tree [value]="item" [childrenHandler]="getChildren" [content]="nodeTemplate" />
          }
        </div>
      </section>

      <!-- Flat list (no children) -->
      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Flat list (leaf nodes only)
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          When nodes have no children there is no toggle button — the row is
          rendered as a simple non-expandable item.
        </p>

        <div
          nxpTreeController
          class="rounded-lg border border-gray-200 bg-white px-2 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          @for (item of flatList; track item.name) {
            <nxp-tree [value]="item" [childrenHandler]="getChildren" [content]="nodeTemplate" />
          }
        </div>
      </section>
    </div>

    <!-- Shared node content template (tree component already wraps in nxp-tree-item-content) -->
    <ng-template #nodeTemplate let-item>
      {{ item.name }}
    </ng-template>
  `,
})
export class TreeDemoComponent {
  readonly fileTree = FILE_TREE;

  readonly nestedTree: FileNode[] = [
    {
      name: 'libs',
      children: [
        {
          name: 'components',
          children: [
            {
              name: 'tree',
              children: [
                { name: 'tree.component.ts' },
                { name: 'tree-item.component.ts' },
                { name: 'tree-item-content.component.ts' },
                { name: 'tree-controller.directive.ts' },
              ],
            },
          ],
        },
      ],
    },
  ];

  readonly flatList: FileNode[] = [
    { name: 'angular.json' },
    { name: 'package.json' },
    { name: 'tsconfig.base.json' },
    { name: '.eslintrc.json' },
    { name: 'nx.json' },
  ];

  readonly getChildren = (item: FileNode): readonly FileNode[] =>
    item.children ?? [];
}
