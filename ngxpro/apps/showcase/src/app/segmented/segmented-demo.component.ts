import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NxpSegmentedComponent } from '@nxp/components/segmented';
import type { NxpSegmentedSize } from '@nxp/components/segmented';

@Component({
  selector: 'app-segmented-demo',
  standalone: true,
  imports: [RouterLink, NxpSegmentedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-bg-base-alt py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Back link -->
        <a
          routerLink="/"
          class="inline-flex items-center gap-1 mb-6 text-sm font-medium text-action hover:text-primary-pressed"
        >
          &larr; Back to showcase
        </a>

        <h1 class="text-3xl font-bold text-text-primary mb-2">Segmented</h1>
        <p class="text-text-secondary mb-10">
          Pill-shaped segmented control with an animated sliding indicator.
          Place <code class="text-sm font-mono bg-bg-neutral-1 px-1 rounded">button</code>,
          <code class="text-sm font-mono bg-bg-neutral-1 px-1 rounded">a</code>, or
          <code class="text-sm font-mono bg-bg-neutral-1 px-1 rounded">label</code>
          elements directly inside. Use
          <code class="text-sm font-mono bg-bg-neutral-1 px-1 rounded">[(activeItemIndex)]</code>
          for two-way binding.
        </p>

        <!-- Basic -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-text-primary mb-1">Basic</h2>
          <p class="text-sm text-text-secondary mb-4">
            Three buttons with animated indicator.
            Active index: <strong>{{ basicIndex() }}</strong>
          </p>
          <nxp-segmented
            [activeItemIndex]="basicIndex()"
            (activeItemIndexChange)="basicIndex.set($event)"
          >
            <button>Day</button>
            <button>Week</button>
            <button>Month</button>
          </nxp-segmented>
          <div class="mt-4 p-4 rounded-lg bg-bg-base border border-border-normal text-sm text-text-primary">
            Viewing:
            <strong>{{ ['Day', 'Week', 'Month'][basicIndex()] }}</strong> data
          </div>
        </section>

        <!-- Sizes -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-text-primary mb-1">Sizes</h2>
          <p class="text-sm text-text-secondary mb-4">
            Three size variants: sm, md (default), lg.
          </p>
          <div class="flex flex-col gap-6">
            @for (s of sizes; track s) {
              <div>
                <p class="text-xs font-medium text-text-secondary mb-2">{{ s }}</p>
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
        </section>

        <!-- Four options -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-text-primary mb-1">Four options</h2>
          <p class="text-sm text-text-secondary mb-4">
            Works with any number of items.
          </p>
          <nxp-segmented
            [activeItemIndex]="viewIndex()"
            (activeItemIndexChange)="viewIndex.set($event)"
          >
            <button>1D</button>
            <button>1W</button>
            <button>1M</button>
            <button>1Y</button>
          </nxp-segmented>
        </section>

        <!-- Two options -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold text-text-primary mb-1">Two options</h2>
          <p class="text-sm text-text-secondary mb-4">
            Toggle pattern with two options.
          </p>
          <nxp-segmented
            [activeItemIndex]="toggleIndex()"
            (activeItemIndexChange)="toggleIndex.set($event)"
          >
            <button>List</button>
            <button>Grid</button>
          </nxp-segmented>
        </section>
      </div>
    </div>
  `,
})
export class SegmentedDemoComponent {
  readonly basicIndex = signal(0);
  readonly viewIndex = signal(2);
  readonly toggleIndex = signal(0);

  readonly sizes: NxpSegmentedSize[] = ['sm', 'md', 'lg'];
  readonly sizeTabs: Record<NxpSegmentedSize, ReturnType<typeof signal<number>>> = {
    sm: signal(0),
    md: signal(0),
    lg: signal(0),
  };
}
