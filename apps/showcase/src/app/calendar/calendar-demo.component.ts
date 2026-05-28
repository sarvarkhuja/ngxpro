import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarComponent,
  DisabledHandler,
  MarkerHandler,
} from '@ngxpro/components/calendar';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { CalendarApiComponent } from './calendar-api.component';

/**
 * Showcase demo for the CalendarComponent.
 *
 * Demonstrates:
 *  1. Single-date selection
 *  2. Range-mode selection
 *  3. Disabled dates (weekends)
 *  4. Dot markers on specific dates
 *  5. Min / Max bounds
 *  6. Hide adjacent days
 */
@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarComponent,
    CalendarApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Calendar"
      package="cdk"
      type="component"
      path="cdk/calendar"
    >
      <p class="text-base text-text-secondary mb-6">
        Full-featured calendar with single, range, and multi-date selection.
        Supports disabled dates via a handler, dot markers, min/max bounds, and
        a built-in year picker.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Single date"
          description="Click any day to select it. The currently picked date is reflected back below the calendar."
          [content]="{ HTML: singleHtml, TypeScript: singleTs }"
        >
          <section class="space-y-3">
            <nxp-calendar
              [value]="singleValue()"
              (dayClick)="singleValue.set($event)"
            />
            @if (singleValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected:
                <strong>{{ singleValue()!.toLocaleDateString() }}</strong>
              </p>
            }
          </section>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Range selection"
          description="Enable [rangeMode]='true' and click a start day then an end day. The middle days highlight with a tinted background strip."
          [content]="{ HTML: rangeHtml, TypeScript: rangeTs }"
        >
          <section class="space-y-3">
            <nxp-calendar
              [rangeMode]="true"
              [value]="rangeValue()"
              (dayClick)="onRangeClick($event)"
            />
            @if (rangeValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                @if (rangeValue()!.length === 2) {
                  From
                  <strong>{{ rangeValue()![0].toLocaleDateString() }}</strong>
                  to
                  <strong>{{ rangeValue()![1]?.toLocaleDateString() }}</strong>
                } @else {
                  Start:
                  <strong>{{ rangeValue()![0].toLocaleDateString() }}</strong> —
                  pick end date
                }
              </p>
            }
            @if (rangeValue()) {
              <button
                class="text-xs text-red-500 hover:underline"
                (click)="clearRange()"
              >
                Clear range
              </button>
            }
          </section>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled weekends"
          description="Pass a [disabledHandler] that returns true for Saturdays and Sundays — those cells become unclickable and dim."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <section class="space-y-3">
            <nxp-calendar
              [value]="disabledValue()"
              [disabledHandler]="isWeekend"
              (dayClick)="disabledValue.set($event)"
            />
            @if (disabledValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected:
                <strong>{{ disabledValue()!.toLocaleDateString() }}</strong>
              </p>
            }
          </section>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Event markers"
          description="Project a [markerHandler] that returns up to two CSS color strings per date. The dots render below the day number."
          [content]="{ HTML: markerHtml, TypeScript: markerTs }"
        >
          <section class="space-y-3">
            <nxp-calendar
              [value]="markerValue()"
              [markerHandler]="markerFn"
              (dayClick)="markerValue.set($event)"
            />
          </section>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max bounds"
          description="Set [min] and [max] Date objects to constrain the selectable range. Both the day grid and the year picker honour the bounds."
          [content]="{ HTML: boundsHtml, TypeScript: boundsTs }"
        >
          <section class="space-y-3">
            <nxp-calendar
              [value]="boundedValue()"
              [min]="minDate"
              [max]="maxDate"
              (dayClick)="boundedValue.set($event)"
            />
            @if (boundedValue()) {
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Selected:
                <strong>{{ boundedValue()!.toLocaleDateString() }}</strong>
              </p>
            }
          </section>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Hide adjacent days"
          description="Set [showAdjacent]='false' to hide days that belong to the previous / next month — the grid still keeps its 6-row height."
          [content]="{ HTML: adjacentHtml, TypeScript: adjacentTs }"
        >
          <section class="space-y-3">
            <nxp-calendar
              [value]="adjacentValue()"
              [showAdjacent]="showAdjacent()"
              (dayClick)="adjacentValue.set($event)"
            />
          </section>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-calendar-api [(showAdjacent)]="showAdjacent" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class CalendarDemoComponent {
  // 1. Single
  readonly singleValue = signal<Date | null>(null);

  // 2. Range
  readonly rangeValue = signal<[Date, Date] | [Date] | null>(null);

  onRangeClick(day: Date): void {
    const current = this.rangeValue();
    if (!current || current.length === 2) {
      // Start a new range
      this.rangeValue.set([day]);
    } else {
      const [start] = current;
      if (day < start) {
        this.rangeValue.set([day, start]);
      } else {
        this.rangeValue.set([start, day]);
      }
    }
  }

  clearRange(): void {
    this.rangeValue.set(null);
  }

  // 3. Disabled weekends
  readonly disabledValue = signal<Date | null>(null);
  readonly isWeekend: DisabledHandler = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };

  // 4. Markers
  readonly markerValue = signal<Date | null>(null);
  readonly markerFn: MarkerHandler = (
    date: Date,
  ): [] | [string] | [string, string] => {
    // Mark every 5th, 10th, 15th, 20th with coloured dots
    const d = date.getDate();
    if (d % 15 === 0) return ['#3b82f6', '#ef4444'];
    if (d % 10 === 0) return ['#10b981'];
    if (d % 5 === 0) return ['#f59e0b'];
    return [];
  };

  // 5. Bounded
  readonly boundedValue = signal<Date | null>(null);
  readonly minDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  })();
  readonly maxDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })();

  // 6. Adjacent — shared with the API tab as a model() binding
  readonly adjacentValue = signal<Date | null>(null);
  readonly showAdjacent = signal(false);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────

  readonly singleHtml = `<nxp-calendar
  [value]="singleValue()"
  (dayClick)="singleValue.set($event)"
/>
@if (singleValue()) {
  <p>Selected: <strong>{{ singleValue()!.toLocaleDateString() }}</strong></p>
}`;

  readonly singleTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent } from '@ngxpro/components/calendar';

@Component({
  selector: 'app-single-date',
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './single-date.html',
})
export class SingleDateCalendarExample {
  readonly singleValue = signal<Date | null>(null);
}`;

  readonly rangeHtml = `<nxp-calendar
  [rangeMode]="true"
  [value]="rangeValue()"
  (dayClick)="onRangeClick($event)"
/>
@if (rangeValue()) {
  <p>
    @if (rangeValue()!.length === 2) {
      From <strong>{{ rangeValue()![0].toLocaleDateString() }}</strong>
      to   <strong>{{ rangeValue()![1]?.toLocaleDateString() }}</strong>
    } @else {
      Start: <strong>{{ rangeValue()![0].toLocaleDateString() }}</strong> — pick end date
    }
  </p>
}`;

  readonly rangeTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent } from '@ngxpro/components/calendar';

@Component({
  selector: 'app-range-calendar',
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-calendar.html',
})
export class RangeCalendarExample {
  readonly rangeValue = signal<[Date, Date] | [Date] | null>(null);

  onRangeClick(day: Date): void {
    const current = this.rangeValue();
    if (!current || current.length === 2) {
      this.rangeValue.set([day]);
    } else {
      const [start] = current;
      this.rangeValue.set(day < start ? [day, start] : [start, day]);
    }
  }
}`;

  readonly disabledHtml = `<nxp-calendar
  [value]="disabledValue()"
  [disabledHandler]="isWeekend"
  (dayClick)="disabledValue.set($event)"
/>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarComponent,
  DisabledHandler,
} from '@ngxpro/components/calendar';

@Component({
  selector: 'app-disabled-weekends',
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-weekends.html',
})
export class DisabledWeekendsCalendarExample {
  readonly disabledValue = signal<Date | null>(null);

  readonly isWeekend: DisabledHandler = (date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };
}`;

  readonly markerHtml = `<nxp-calendar
  [value]="markerValue()"
  [markerHandler]="markerFn"
  (dayClick)="markerValue.set($event)"
/>`;

  readonly markerTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CalendarComponent,
  MarkerHandler,
} from '@ngxpro/components/calendar';

@Component({
  selector: 'app-markers',
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './markers.html',
})
export class MarkersCalendarExample {
  readonly markerValue = signal<Date | null>(null);

  readonly markerFn: MarkerHandler = (date) => {
    const d = date.getDate();
    if (d % 15 === 0) return ['#3b82f6', '#ef4444'];
    if (d % 10 === 0) return ['#10b981'];
    if (d % 5 === 0) return ['#f59e0b'];
    return [];
  };
}`;

  readonly boundsHtml = `<nxp-calendar
  [value]="boundedValue()"
  [min]="minDate"
  [max]="maxDate"
  (dayClick)="boundedValue.set($event)"
/>`;

  readonly boundsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent } from '@ngxpro/components/calendar';

@Component({
  selector: 'app-bounded',
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounded.html',
})
export class BoundedCalendarExample {
  readonly boundedValue = signal<Date | null>(null);

  readonly minDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  })();

  readonly maxDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })();
}`;

  readonly adjacentHtml = `<nxp-calendar
  [value]="adjacentValue()"
  [showAdjacent]="false"
  (dayClick)="adjacentValue.set($event)"
/>`;

  readonly adjacentTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent } from '@ngxpro/components/calendar';

@Component({
  selector: 'app-hide-adjacent',
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hide-adjacent.html',
})
export class HideAdjacentCalendarExample {
  readonly adjacentValue = signal<Date | null>(null);
}`;
}
