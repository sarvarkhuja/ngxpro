import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpDropdown,
  type NxpDropdownAlign,
  type NxpDropdownWidth,
} from '@ngxpro/cdk';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DropdownApiComponent } from './dropdown-api.component';

type DropdownDirection = 'top' | 'bottom' | null;

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ...NxpDropdown,
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
      <p class="text-base text-text-secondary mb-6">
        Portal-based dropdown anchored to any element. Supports click, hover,
        context menu, and selection triggers with rich positioning options.
        Backed by
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NxpDropdown</code
        >
        from
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&#64;ngxpro/cdk</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Adjust dropdown options (align, direction, width, height, offset) and see them applied to the trigger button. Click the button to toggle; arrow keys move focus between items; Escape closes."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div
            class="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start w-full"
          >
            <!-- Trigger -->
            <div class="space-y-4">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                [nxpDropdown]="playgroundDropdown"
                nxpDropdownAuto
                [nxpDropdownAlign]="align()"
                [nxpDropdownDirection]="direction()"
                [nxpDropdownLimitWidth]="limitWidth()"
                [nxpDropdownMinHeight]="minHeight()"
                [nxpDropdownMaxHeight]="maxHeight()"
                [nxpDropdownOffset]="offset()"
                [nxpDropdownAppearance]="'solid'"
                [nxpDropdownSided]="sided()"
                [nxpDropdownSidedOffset]="sidedOffset()"
              >
                Open dropdown
                <span
                  class="inline-flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300"
                >
                  {{ align() }} / {{ directionLabel(direction()) }} /
                  {{ limitWidth() }}
                </span>
              </button>

              <p class="text-xs text-gray-500 dark:text-gray-400">
                Click the button to toggle the dropdown. Arrow keys move focus
                between items; Escape closes.
              </p>
            </div>

            <!-- Controls -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300"
            >
              <div class="space-y-2">
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  Align
                </div>
                <div class="inline-flex flex-wrap gap-2">
                  @for (option of alignOptions; track option) {
                    <button
                      type="button"
                      class="rounded-full border px-3 py-1"
                      [class.bg-blue-50]="align() === option"
                      [class.border-blue-500]="align() === option"
                      [class.text-blue-700]="align() === option"
                      [class.border-gray-300]="align() !== option"
                      [class.text-gray-700]="align() !== option"
                      (click)="align.set(option)"
                    >
                      {{ option }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  Direction
                </div>
                <div class="inline-flex flex-wrap gap-2">
                  @for (option of directionOptions; track option) {
                    <button
                      type="button"
                      class="rounded-full border px-3 py-1"
                      [class.bg-blue-50]="direction() === option"
                      [class.border-blue-500]="direction() === option"
                      [class.text-blue-700]="direction() === option"
                      [class.border-gray-300]="direction() !== option"
                      [class.text-gray-700]="direction() !== option"
                      (click)="direction.set(option)"
                    >
                      {{ directionLabel(option) }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  Width mode
                </div>
                <div class="inline-flex flex-wrap gap-2">
                  @for (option of widthOptions; track option) {
                    <button
                      type="button"
                      class="rounded-full border px-3 py-1"
                      [class.bg-blue-50]="limitWidth() === option"
                      [class.border-blue-500]="limitWidth() === option"
                      [class.text-blue-700]="limitWidth() === option"
                      [class.border-gray-300]="limitWidth() !== option"
                      [class.text-gray-700]="limitWidth() !== option"
                      (click)="limitWidth.set(option)"
                    >
                      {{ option }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  Sided
                </div>
                <div class="inline-flex items-center gap-3">
                  <label class="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      [checked]="sided()"
                      (change)="sided.set($any($event.target).checked)"
                    />
                    <span>Open to side when possible</span>
                  </label>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="w-28 text-gray-500">Sided offset</span>
                  <input
                    type="number"
                    min="0"
                    max="32"
                    class="block w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
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
                  <span class="text-gray-500">px</span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  Height &amp; offset
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="w-28 text-gray-500">Min height</span>
                    <input
                      type="number"
                      min="40"
                      max="400"
                      class="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
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
                    <span class="text-gray-500">px</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-28 text-gray-500">Max height</span>
                    <input
                      type="number"
                      min="80"
                      max="600"
                      class="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
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
                    <span class="text-gray-500">px</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-28 text-gray-500">Offset</span>
                    <input
                      type="number"
                      min="0"
                      max="32"
                      class="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
                      [value]="offset()"
                      (input)="
                        updateNumber(offset, $any($event.target).value, 0, 32)
                      "
                    />
                    <span class="text-gray-500">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ng-template #playgroundDropdown let-close>
            <div class="p-3 space-y-2">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                Dropdown playground
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                This panel is rendered through the portal system and positioned
                relative to the trigger.
              </p>
              <ul
                class="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300"
              >
                <li>
                  <strong>Align:</strong>
                  {{ align() }}
                </li>
                <li>
                  <strong>Direction:</strong>
                  {{ directionLabel(direction()) }}
                </li>
                <li>
                  <strong>Width:</strong>
                  {{ limitWidth() }}
                </li>
              </ul>
              <button
                type="button"
                class="mt-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                (click)="close()"
              >
                Close via context
              </button>
            </div>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Hover trigger"
          description="Uses nxpDropdownHover with configurable show/hide delays to avoid flicker."
          [content]="{ HTML: hoverHtml, TypeScript: hoverTs }"
        >
          <div class="flex flex-wrap items-center gap-6">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              [nxpDropdown]="hoverDropdown"
              nxpDropdownAuto
              nxpDropdownHover
              [nxpDropdownShowDelay]="hoverShowDelay()"
              [nxpDropdownHideDelay]="hoverHideDelay()"
            >
              Hover me
              <span class="text-[10px] text-gray-500">
                ({{ hoverShowDelay() }}ms / {{ hoverHideDelay() }}ms)
              </span>
            </button>

            <div class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <span class="w-28 text-gray-500">Show delay</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  class="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
                  [value]="hoverShowDelay()"
                  (input)="
                    updateNumber(
                      hoverShowDelay,
                      $any($event.target).value,
                      0,
                      1000
                    )
                  "
                />
                <span class="text-gray-500">ms</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-28 text-gray-500">Hide delay</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  class="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
                  [value]="hoverHideDelay()"
                  (input)="
                    updateNumber(
                      hoverHideDelay,
                      $any($event.target).value,
                      0,
                      1000
                    )
                  "
                />
                <span class="text-gray-500">ms</span>
              </div>
            </div>
          </div>

          <ng-template #hoverDropdown>
            <div class="p-3 text-sm text-gray-800 dark:text-gray-100">
              Opens while the trigger or dropdown is hovered. Moving focus away
              closes it after the configured hide delay.
            </div>
          </ng-template>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Context menu"
          description="nxpDropdownContext opens a dropdown at the pointer position instead of below the host."
          [content]="{ HTML: contextHtml, TypeScript: contextTs }"
        >
          <div
            class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40 px-6 py-10 text-center text-sm text-gray-600 dark:text-gray-300 w-full"
            [nxpDropdown]="contextDropdown"
            nxpDropdownContext
          >
            Right-click anywhere in this box to open a custom context menu.
          </div>

          <ng-template #contextDropdown let-close>
            <div class="p-3 space-y-2 text-sm text-gray-800 dark:text-gray-100">
              <p class="font-medium">Context actions</p>
              <button
                type="button"
                class="block w-full rounded-md px-3 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                (click)="close()"
              >
                Rename
              </button>
              <button
                type="button"
                class="block w-full rounded-md px-3 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                (click)="close()"
              >
                Duplicate
              </button>
              <button
                type="button"
                class="block w-full rounded-md px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                (click)="close()"
              >
                Delete
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
    const clamped = Math.min(Math.max(value, min), max);
    target.set(clamped);
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<button
  type="button"
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
  <div class="p-3 space-y-2">
    <p class="text-sm font-medium">Dropdown playground</p>
    <button type="button" (click)="close()">Close via context</button>
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
export class PlaygroundDropdownExample {
  readonly align = signal<NxpDropdownAlign>('start');
  readonly direction = signal<DropdownDirection>(null);
  readonly limitWidth = signal<NxpDropdownWidth>('auto');
  readonly minHeight = signal(80);
  readonly maxHeight = signal(320);
  readonly offset = signal(4);
  readonly sided = signal(false);
  readonly sidedOffset = signal(4);
}`;

  readonly hoverHtml = `<button
  type="button"
  [nxpDropdown]="hoverDropdown"
  nxpDropdownAuto
  nxpDropdownHover
  [nxpDropdownShowDelay]="hoverShowDelay()"
  [nxpDropdownHideDelay]="hoverHideDelay()"
>
  Hover me
</button>

<ng-template #hoverDropdown>
  <div class="p-3 text-sm">
    Opens while the trigger or dropdown is hovered. Moving focus away
    closes it after the configured hide delay.
  </div>
</ng-template>`;

  readonly hoverTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';

@Component({
  selector: 'app-hover-trigger',
  imports: [...NxpDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hover-trigger.html',
})
export class HoverTriggerDropdownExample {
  readonly hoverShowDelay = signal(150);
  readonly hoverHideDelay = signal(150);
}`;

  readonly contextHtml = `<div
  class="rounded-lg border border-dashed px-6 py-10 text-center"
  [nxpDropdown]="contextDropdown"
  nxpDropdownContext
>
  Right-click anywhere in this box to open a custom context menu.
</div>

<ng-template #contextDropdown let-close>
  <div class="p-3 space-y-2 text-sm">
    <p class="font-medium">Context actions</p>
    <button type="button" (click)="close()">Rename</button>
    <button type="button" (click)="close()">Duplicate</button>
    <button type="button" (click)="close()">Delete</button>
  </div>
</ng-template>`;

  readonly contextTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDropdown } from '@ngxpro/cdk';

@Component({
  selector: 'app-context-menu',
  imports: [...NxpDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-menu.html',
})
export class ContextMenuDropdownExample {}`;
}
