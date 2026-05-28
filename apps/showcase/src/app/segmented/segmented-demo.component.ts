import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpSegmented } from '@ngxpro/components/segmented';
import type {
  NxpSegmentedOrientation,
  NxpSegmentedSize,
} from '@ngxpro/components/segmented';
import { SegmentedApiComponent } from './segmented-api.component';

// Plain SVG strings — same pattern as button.component's iconStart/iconEnd inputs.
const ICON_CALENDAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
const ICON_BAR_CHART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="13" y="8" width="3" height="10"/><rect x="19" y="5" width="3" height="13"/></svg>`;
const ICON_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
const ICON_ARROW_RIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

@Component({
  selector: 'app-segmented-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpSegmented,
    SegmentedApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Segmented"
      package="components"
      type="component"
      path="components/segmented"
    >
      <p class="text-base text-text-secondary mb-6">
        Pill-shaped segmented control with an animated sliding indicator. Place
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >button</code
        >,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">a</code
        >,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >label</code
        >, or
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-segment</code
        >
        elements directly inside. Use
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[(activeItemIndex)]</code
        >
        for two-way binding.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic"
          description="Three buttons with an animated sliding indicator. Active index is tracked via two-way [(activeItemIndex)] binding — adjust size, orientation, or active index in the API tab to see this example react."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <nxp-segmented
            [size]="size()"
            [orientation]="orientation()"
            [(activeItemIndex)]="activeItemIndex"
          >
            <button>Day</button>
            <button>Week</button>
            <button>Month</button>
          </nxp-segmented>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Three size variants — sm, md (default), lg. Container padding and item heights are tuned to match the button component (sm=h-8, md=h-10, lg=h-12)."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex flex-col gap-6">
            @for (s of sizes; track s) {
              <div>
                <p class="text-xs font-medium text-text-secondary mb-2">
                  {{ s }}
                </p>
                <nxp-segmented
                  [size]="s"
                  [activeItemIndex]="sizeTabs[s]()"
                  (activeItemIndexChange)="sizeTabs[s].set($event)"
                >
                  <button>Option A</button>
                  <button>Option B</button>
                  <button>Option C</button>
                </nxp-segmented>
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="With icons"
          description="Use nxp-segment with iconStart / iconEnd inputs (raw SVG strings, same pattern as the button component). Icons scale with the parent size."
          [content]="{ HTML: iconsHtml, TypeScript: iconsTs }"
        >
          <div class="flex flex-col gap-6">
            @for (s of sizes; track s) {
              <div>
                <p class="text-xs font-medium text-text-secondary mb-2">
                  {{ s }}
                </p>
                <nxp-segmented
                  [size]="s"
                  [activeItemIndex]="iconIndex[s]()"
                  (activeItemIndexChange)="iconIndex[s].set($event)"
                >
                  <nxp-segment [iconStart]="iconCalendar">Day</nxp-segment>
                  <nxp-segment [iconStart]="iconBarChart">Week</nxp-segment>
                  <nxp-segment
                    [iconStart]="iconSettings"
                    [iconEnd]="iconArrowRight"
                    >Month</nxp-segment
                  >
                </nxp-segmented>
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled items"
          description="Disabled items are muted and ignore clicks. Native button[disabled] blocks clicks; nxp-segment relies on the parent directive's closest('[disabled]') guard for a/label."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <nxp-segmented
            [activeItemIndex]="disabledIndex()"
            (activeItemIndexChange)="disabledIndex.set($event)"
          >
            <nxp-segment>Available</nxp-segment>
            <nxp-segment [disabled]="true">Unavailable</nxp-segment>
            <nxp-segment>Open</nxp-segment>
            <nxp-segment [disabled]="true">Locked</nxp-segment>
          </nxp-segmented>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Vertical orientation"
          description='Set orientation="vertical" to stack items column-wise. Items fill the container width and left-align content; the indicator animates top-to-bottom.'
          [content]="{ HTML: verticalHtml, TypeScript: verticalTs }"
        >
          <div class="max-w-xs">
            <nxp-segmented
              orientation="vertical"
              [activeItemIndex]="verticalIndex()"
              (activeItemIndexChange)="verticalIndex.set($event)"
            >
              <nxp-segment [iconStart]="iconCalendar">Overview</nxp-segment>
              <nxp-segment [iconStart]="iconBarChart">Analytics</nxp-segment>
              <nxp-segment [iconStart]="iconSettings">Settings</nxp-segment>
              <nxp-segment [iconStart]="iconArrowRight" [disabled]="true"
                >Reports (soon)</nxp-segment
              >
            </nxp-segmented>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-segmented-api
          [(size)]="size"
          [(orientation)]="orientation"
          [(activeItemIndex)]="activeItemIndex"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class SegmentedDemoComponent {
  // Shared with the API tab — these drive the Basic example.
  readonly size = signal<NxpSegmentedSize>('md');
  readonly orientation = signal<NxpSegmentedOrientation>('horizontal');
  readonly activeItemIndex = signal(0);

  // Per-example state for the hard-coded examples below.
  readonly disabledIndex = signal(0);
  readonly verticalIndex = signal(0);

  readonly sizes: NxpSegmentedSize[] = ['sm', 'md', 'lg'];
  readonly sizeTabs: Record<
    NxpSegmentedSize,
    ReturnType<typeof signal<number>>
  > = {
    sm: signal(0),
    md: signal(0),
    lg: signal(0),
  };
  readonly iconIndex: Record<
    NxpSegmentedSize,
    ReturnType<typeof signal<number>>
  > = {
    sm: signal(0),
    md: signal(0),
    lg: signal(0),
  };

  readonly iconCalendar = ICON_CALENDAR;
  readonly iconBarChart = ICON_BAR_CHART;
  readonly iconSettings = ICON_SETTINGS;
  readonly iconArrowRight = ICON_ARROW_RIGHT;

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────

  readonly basicHtml = `<nxp-segmented [(activeItemIndex)]="activeItemIndex">
  <button>Day</button>
  <button>Week</button>
  <button>Month</button>
</nxp-segmented>`;

  readonly basicTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSegmentedComponent } from '@ngxpro/components/segmented';

@Component({
  selector: 'app-basic',
  imports: [NxpSegmentedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic.html',
})
export class BasicSegmentedExample {
  readonly activeItemIndex = signal(0);
}`;

  readonly sizesHtml = `@for (s of sizes; track s) {
  <div>
    <p class="text-xs font-medium text-text-secondary mb-2">{{ s }}</p>
    <nxp-segmented [size]="s" [(activeItemIndex)]="sizeTabs[s]">
      <button>Option A</button>
      <button>Option B</button>
      <button>Option C</button>
    </nxp-segmented>
  </div>
}`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSegmentedComponent } from '@ngxpro/components/segmented';
import type { NxpSegmentedSize } from '@ngxpro/components/segmented';

@Component({
  selector: 'app-sizes',
  imports: [NxpSegmentedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesSegmentedExample {
  readonly sizes: NxpSegmentedSize[] = ['sm', 'md', 'lg'];
  readonly sizeTabs: Record<NxpSegmentedSize, ReturnType<typeof signal<number>>> = {
    sm: signal(0),
    md: signal(0),
    lg: signal(0),
  };
}`;

  readonly iconsHtml = `<nxp-segmented [size]="size" [(activeItemIndex)]="activeItemIndex">
  <nxp-segment [iconStart]="iconCalendar">Day</nxp-segment>
  <nxp-segment [iconStart]="iconBarChart">Week</nxp-segment>
  <nxp-segment [iconStart]="iconSettings" [iconEnd]="iconArrowRight">
    Month
  </nxp-segment>
</nxp-segmented>`;

  readonly iconsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSegmented } from '@ngxpro/components/segmented';

// Raw SVG strings — same pattern as button.component's iconStart input.
const ICON_CALENDAR = \`<svg ...>...</svg>\`;
const ICON_BAR_CHART = \`<svg ...>...</svg>\`;
const ICON_SETTINGS = \`<svg ...>...</svg>\`;
const ICON_ARROW_RIGHT = \`<svg ...>...</svg>\`;

@Component({
  selector: 'app-with-icons',
  imports: [NxpSegmented],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './with-icons.html',
})
export class WithIconsSegmentedExample {
  readonly size = 'md' as const;
  readonly activeItemIndex = signal(0);

  readonly iconCalendar = ICON_CALENDAR;
  readonly iconBarChart = ICON_BAR_CHART;
  readonly iconSettings = ICON_SETTINGS;
  readonly iconArrowRight = ICON_ARROW_RIGHT;
}`;

  readonly disabledHtml = `<nxp-segmented [(activeItemIndex)]="activeItemIndex">
  <nxp-segment>Available</nxp-segment>
  <nxp-segment [disabled]="true">Unavailable</nxp-segment>
  <nxp-segment>Open</nxp-segment>
  <nxp-segment [disabled]="true">Locked</nxp-segment>
</nxp-segmented>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSegmented } from '@ngxpro/components/segmented';

@Component({
  selector: 'app-disabled-items',
  imports: [NxpSegmented],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-items.html',
})
export class DisabledItemsSegmentedExample {
  readonly activeItemIndex = signal(0);
}`;

  readonly verticalHtml = `<nxp-segmented
  orientation="vertical"
  [(activeItemIndex)]="activeItemIndex"
>
  <nxp-segment [iconStart]="iconCalendar">Overview</nxp-segment>
  <nxp-segment [iconStart]="iconBarChart">Analytics</nxp-segment>
  <nxp-segment [iconStart]="iconSettings">Settings</nxp-segment>
  <nxp-segment [iconStart]="iconArrowRight" [disabled]="true">
    Reports (soon)
  </nxp-segment>
</nxp-segmented>`;

  readonly verticalTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSegmented } from '@ngxpro/components/segmented';

const ICON_CALENDAR = \`<svg ...>...</svg>\`;
const ICON_BAR_CHART = \`<svg ...>...</svg>\`;
const ICON_SETTINGS = \`<svg ...>...</svg>\`;
const ICON_ARROW_RIGHT = \`<svg ...>...</svg>\`;

@Component({
  selector: 'app-vertical',
  imports: [NxpSegmented],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vertical.html',
})
export class VerticalSegmentedExample {
  readonly activeItemIndex = signal(0);

  readonly iconCalendar = ICON_CALENDAR;
  readonly iconBarChart = ICON_BAR_CHART;
  readonly iconSettings = ICON_SETTINGS;
  readonly iconArrowRight = ICON_ARROW_RIGHT;
}`;
}
