import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpMenu } from '@ngxpro/components/menu';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { MenuApiComponent } from './menu-api.component';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    ...NxpDropdown,
    ...NxpMenu,
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
      <p class="text-base text-text-secondary mb-6">
        Animated menu surface with proximity-hover tracking. Three layered
        indicators (selected, hover, focus ring) animate over menu items using
        the shared
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NxpAnimatedProximityBase</code
        >
        from
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&#64;ngxpro/cdk</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Inside a dropdown"
          description="Click the trigger to open; use arrow keys to move focus and notice the blue focus ring."
          [content]="{ HTML: dropdownHtml, TypeScript: dropdownTs }"
        >
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            [nxpDropdown]="panel"
            nxpDropdownAuto
          >
            Open menu
            <span
              class="inline-flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300"
            >
              {{ labels[checkedIndex() ?? 0] }}
            </span>
          </button>

          <ng-template #panel>
            <nxp-menu
              class="w-56"
              [checkedIndex]="checkedIndex()"
              (checkedIndexChange)="checkedIndex.set($event)"
            >
              @for (label of labels; track label; let i = $index) {
                <button nxpMenuItem>{{ label }}</button>
              }
            </nxp-menu>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Standalone"
          description="Rendered directly in the page — hover items to see the proximity tracking, and click to change the selected row."
          [content]="{ HTML: standaloneHtml, TypeScript: standaloneTs }"
        >
          <div class="flex flex-col gap-2">
            <nxp-menu
              class="w-72"
              [checkedIndex]="inlineSelected()"
              (checkedIndexChange)="inlineSelected.set($event)"
            >
              @for (label of inlineLabels; track label) {
                <button nxpMenuItem>{{ label }}</button>
              }
            </nxp-menu>

            <p class="text-xs text-gray-500 dark:text-gray-400">
              Selected:
              <strong>{{ inlineLabels[inlineSelected() ?? 0] }}</strong>
            </p>
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
  readonly labels = ['Profile', 'Billing', 'Team', 'Sign out'];
  readonly inlineLabels = [
    'Overview',
    'Analytics',
    'Reports',
    'Notifications',
    'Integrations',
  ];

  readonly checkedIndex = signal<number | null>(0);
  readonly inlineSelected = signal<number | null>(1);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly dropdownHtml = `<button
  type="button"
  [nxpDropdown]="panel"
  nxpDropdownAuto
>
  Open menu
  <span>{{ labels[checkedIndex() ?? 0] }}</span>
</button>

<ng-template #panel>
  <nxp-menu
    class="w-56"
    [checkedIndex]="checkedIndex()"
    (checkedIndexChange)="checkedIndex.set($event)"
  >
    @for (label of labels; track label) {
      <button nxpMenuItem>{{ label }}</button>
    }
  </nxp-menu>
</ng-template>`;

  readonly dropdownTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';
import { NxpMenu } from '@ngxpro/components/menu';

@Component({
  selector: 'app-menu-dropdown',
  imports: [...NxpDropdown, ...NxpMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-dropdown.html',
})
export class MenuDropdownExample {
  readonly labels = ['Profile', 'Billing', 'Team', 'Sign out'];
  readonly checkedIndex = signal<number | null>(0);
}`;

  readonly standaloneHtml = `<nxp-menu
  class="w-72"
  [checkedIndex]="inlineSelected()"
  (checkedIndexChange)="inlineSelected.set($event)"
>
  @for (label of inlineLabels; track label) {
    <button nxpMenuItem>{{ label }}</button>
  }
</nxp-menu>

<p>Selected: <strong>{{ inlineLabels[inlineSelected() ?? 0] }}</strong></p>`;

  readonly standaloneTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpMenu } from '@ngxpro/components/menu';

@Component({
  selector: 'app-menu-standalone',
  imports: [...NxpMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-standalone.html',
})
export class MenuStandaloneExample {
  readonly inlineLabels = [
    'Overview',
    'Analytics',
    'Reports',
    'Notifications',
    'Integrations',
  ];

  readonly inlineSelected = signal<number | null>(1);
}`;
}
