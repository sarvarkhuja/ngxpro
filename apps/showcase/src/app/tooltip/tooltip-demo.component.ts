import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  NxpTooltipDirective,
  NxpTooltipIconComponent,
  type NxpTooltipDirection,
  type NxpTooltipSize,
} from '@ngxpro/components/tooltip';
import { TooltipApiComponent } from './tooltip-api.component';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpTooltipDirective,
    NxpTooltipIconComponent,
    TooltipApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Tooltip"
      package="components"
      type="directive"
      path="components/tooltip"
    >
      <p class="text-base text-text-secondary mb-6">
        Portal-based tooltip with hover, focus, and touch support. Supports all
        four directions, three sizes, dark / light appearances, and polymorphic
        content (string,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >TemplateRef</code
        >, or
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NxpDynamicComponent</code
        >). Backed by
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NxpTooltipDirective</code
        >
        from
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&#64;ngxpro/components/tooltip</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Hover the trigger to see the tooltip. Adjust every input from the API tab — values persist to the URL query string."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="flex items-center justify-center min-h-32 w-full">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              [nxpTooltip]="playgroundTooltip()"
              [nxpTooltipDirection]="playgroundDirection()"
              [nxpTooltipAlign]="playgroundAlign()"
              [nxpTooltipSize]="playgroundSize()"
              [nxpTooltipAppearance]="playgroundAppearance()"
              [nxpTooltipDisabled]="playgroundDisabled()"
              [nxpTooltipShowDelay]="playgroundShowDelay()"
              [nxpTooltipHideDelay]="playgroundHideDelay()"
              [nxpTooltipDescribe]="playgroundDescribe() || null"
            >
              Hover me
            </button>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="All directions"
          description="Hover each button to see the tooltip open in the specified direction. The tooltip auto-flips when it would overflow the viewport."
          [content]="{ HTML: directionsHtml, TypeScript: directionsTs }"
        >
          <div class="flex flex-wrap gap-4 items-center justify-center py-6">
            @for (dir of directions; track dir) {
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                [nxpTooltip]="dir + ' tooltip'"
                [nxpTooltipDirection]="dir"
              >
                {{ dir }}
              </button>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Tooltip icon"
          description="nxp-tooltip-icon renders a small info icon with the tooltip built in — perfect for inline help text next to form labels."
          [content]="{ HTML: iconHtml, TypeScript: iconTs }"
        >
          <div class="flex flex-wrap gap-6 items-center py-2">
            <div
              class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Password strength
              <nxp-tooltip-icon
                [nxpTooltip]="
                  'Use at least 8 characters with a mix of letters, numbers, and symbols.'
                "
              />
            </div>

            <div
              class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Billing address
              <nxp-tooltip-icon
                [nxpTooltip]="
                  'Your billing address must match the address on file with your bank.'
                "
                nxpTooltipDirection="right"
                nxpTooltipAppearance="light"
              />
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Appearances"
          description="Dark (default) and light appearances with automatic dark mode support — the light style adds a subtle border."
          [content]="{ HTML: appearancesHtml, TypeScript: appearancesTs }"
        >
          <div class="flex flex-wrap gap-4 items-center py-4">
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              [nxpTooltip]="'Dark appearance (default)'"
              nxpTooltipAppearance="dark"
            >
              Dark
            </button>

            <button
              type="button"
              class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              [nxpTooltip]="'Light appearance with border'"
              nxpTooltipAppearance="light"
            >
              Light
            </button>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Three sizes for different information densities — sm, md (default), and lg adjust both the text size and the surrounding padding."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex flex-wrap gap-4 items-center py-4">
            @for (size of sizes; track size) {
              <button
                type="button"
                class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                [nxpTooltip]="'Size: ' + size"
                [nxpTooltipSize]="size"
              >
                {{ size }}
              </button>
            }
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-tooltip-api
          [(nxpTooltip)]="playgroundTooltip"
          [(nxpTooltipDirection)]="playgroundDirection"
          [(nxpTooltipAlign)]="playgroundAlign"
          [(nxpTooltipAppearance)]="playgroundAppearance"
          [(nxpTooltipSize)]="playgroundSize"
          [(nxpTooltipShowDelay)]="playgroundShowDelay"
          [(nxpTooltipHideDelay)]="playgroundHideDelay"
          [(nxpTooltipDisabled)]="playgroundDisabled"
          [(nxpTooltipDescribe)]="playgroundDescribe"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class TooltipDemoComponent {
  readonly directions: NxpTooltipDirection[] = [
    'top',
    'bottom',
    'left',
    'right',
  ];
  readonly sizes: NxpTooltipSize[] = ['sm', 'md', 'lg'];
  readonly appearances = ['dark', 'light'];

  // Shared playground state — bound two-way into <app-tooltip-api>.
  readonly playgroundTooltip = signal<string>('Tooltip content goes here');
  readonly playgroundDirection = signal<NxpTooltipDirection>('top');
  readonly playgroundAlign = signal<'start' | 'center' | 'end'>('center');
  readonly playgroundSize = signal<NxpTooltipSize>('md');
  readonly playgroundAppearance = signal<string>('dark');
  readonly playgroundDisabled = signal(false);
  readonly playgroundShowDelay = signal(300);
  readonly playgroundHideDelay = signal(100);
  readonly playgroundDescribe = signal<string>('');

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<button
  type="button"
  [nxpTooltip]="tooltip()"
  [nxpTooltipDirection]="direction()"
  [nxpTooltipAlign]="align()"
  [nxpTooltipSize]="size()"
  [nxpTooltipAppearance]="appearance()"
  [nxpTooltipDisabled]="disabled()"
  [nxpTooltipShowDelay]="showDelay()"
  [nxpTooltipHideDelay]="hideDelay()"
>
  Hover me
</button>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpTooltipDirective,
  type NxpTooltipDirection,
  type NxpTooltipSize,
} from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-playground',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-playground.html',
})
export class TooltipPlaygroundExample {
  readonly tooltip = signal('Tooltip content goes here');
  readonly direction = signal<NxpTooltipDirection>('top');
  readonly align = signal<'start' | 'center' | 'end'>('center');
  readonly size = signal<NxpTooltipSize>('md');
  readonly appearance = signal<string>('dark');
  readonly disabled = signal(false);
  readonly showDelay = signal(300);
  readonly hideDelay = signal(100);
}`;

  readonly directionsHtml = `<div class="flex flex-wrap gap-4 items-center justify-center">
  @for (dir of directions; track dir) {
    <button
      type="button"
      [nxpTooltip]="dir + ' tooltip'"
      [nxpTooltipDirection]="dir"
    >
      {{ dir }}
    </button>
  }
</div>`;

  readonly directionsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpTooltipDirective,
  type NxpTooltipDirection,
} from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-directions',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-directions.html',
})
export class TooltipDirectionsExample {
  readonly directions: NxpTooltipDirection[] = [
    'top',
    'bottom',
    'left',
    'right',
  ];
}`;

  readonly iconHtml = `<div class="flex flex-wrap gap-6 items-center">
  <div class="flex items-center gap-2 text-sm">
    Password strength
    <nxp-tooltip-icon
      [nxpTooltip]="
        'Use at least 8 characters with a mix of letters, numbers, and symbols.'
      "
    />
  </div>

  <div class="flex items-center gap-2 text-sm">
    Billing address
    <nxp-tooltip-icon
      [nxpTooltip]="
        'Your billing address must match the address on file with your bank.'
      "
      nxpTooltipDirection="right"
      nxpTooltipAppearance="light"
    />
  </div>
</div>`;

  readonly iconTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipIconComponent } from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-icon-example',
  imports: [NxpTooltipIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-icon-example.html',
})
export class TooltipIconExample {}`;

  readonly appearancesHtml = `<div class="flex flex-wrap gap-4 items-center">
  <button
    type="button"
    [nxpTooltip]="'Dark appearance (default)'"
    nxpTooltipAppearance="dark"
  >
    Dark
  </button>

  <button
    type="button"
    [nxpTooltip]="'Light appearance with border'"
    nxpTooltipAppearance="light"
  >
    Light
  </button>
</div>`;

  readonly appearancesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-appearances',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-appearances.html',
})
export class TooltipAppearancesExample {}`;

  readonly sizesHtml = `<div class="flex flex-wrap gap-4 items-center">
  @for (size of sizes; track size) {
    <button
      type="button"
      [nxpTooltip]="'Size: ' + size"
      [nxpTooltipSize]="size"
    >
      {{ size }}
    </button>
  }
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpTooltipDirective,
  type NxpTooltipSize,
} from '@ngxpro/components/tooltip';

@Component({
  selector: 'app-tooltip-sizes',
  imports: [NxpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip-sizes.html',
})
export class TooltipSizesExample {
  readonly sizes: NxpTooltipSize[] = ['sm', 'md', 'lg'];
}`;
}
