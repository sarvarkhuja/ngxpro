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
} from '@nxp/cdk';

type DropdownDirection = 'top' | 'bottom' | null;

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [CommonModule, RouterModule, ...NxpDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-5xl mx-auto space-y-12">
        <!-- Header -->
        <div>
          <a
            routerLink="/"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            &larr; Back to home
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Dropdown
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Portal-based dropdown anchored to any element. Supports click, hover,
            context menu, and selection triggers with rich positioning options.
          </p>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Backed by <code class="font-mono text-xs">NxpDropdown</code> from
            <code class="font-mono text-xs">@nxp/cdk</code>.
          </p>
        </div>

        <!-- Playground: options -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          <header class="space-y-1">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Playground
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Adjust dropdown options (align, direction, width, height, offset)
              and see them applied to the trigger button.
            </p>
          </header>

          <div
            class="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start"
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
                  {{ align() }} /
                  {{ directionLabel(direction()) }} /
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
                    (input)="updateNumber(sidedOffset, $any($event.target).value, 0, 32)"
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
                      (input)="updateNumber(minHeight, $any($event.target).value, 40, 400)"
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
                      (input)="updateNumber(maxHeight, $any($event.target).value, 80, 600)"
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
                      (input)="updateNumber(offset, $any($event.target).value, 0, 32)"
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
              <ul class="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
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
        </section>

        <!-- Hover trigger -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <header class="space-y-1">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hover trigger
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Uses <code class="font-mono text-xs">nxpDropdownHover</code> with
              configurable show/hide delays to avoid flicker.
            </p>
          </header>

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
                  (input)="updateNumber(hoverShowDelay, $any($event.target).value, 0, 1000)"
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
                  (input)="updateNumber(hoverHideDelay, $any($event.target).value, 0, 1000)"
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
        </section>

        <!-- Context menu -->
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <header class="space-y-1">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Context menu
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <code class="font-mono text-xs">nxpDropdownContext</code> opens a
              dropdown at the pointer position instead of below the host.
            </p>
          </header>

          <div
            class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40 px-6 py-10 text-center text-sm text-gray-600 dark:text-gray-300"
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
        </section>
      </div>
    </div>
  `,
})
export class DropdownDemoComponent {
  readonly alignOptions: readonly NxpDropdownAlign[] = ['start', 'center', 'end'];
  readonly widthOptions: readonly NxpDropdownWidth[] = ['auto', 'fixed', 'min'];
  readonly directionOptions: readonly DropdownDirection[] = [null, 'top', 'bottom'];

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
}

