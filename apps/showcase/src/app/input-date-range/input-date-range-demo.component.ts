import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@ngxpro/components/calendar';
import {
  createDefaultDateRangePeriods,
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';
import { InputDateRangeApiComponent } from './input-date-range-api.component';

@Component({
  selector: 'app-input-date-range-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputDateRangeComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    InputDateRangeApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Input Date Range"
      package="components"
      type="component"
      path="components/input-date-range"
    >
      <p class="text-base text-text-secondary mb-6">
        Text input with a dual-calendar range dropdown. Click once for the start
        date, again for the end date. Also accepts keyboard entry in "DD/MM/YYYY
        – DD/MM/YYYY" format. Supports preset periods, length constraints, and
        Angular forms.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Signal binding"
          description="Click to open the dual-calendar, pick start then end. Or type directly."
          [content]="{ HTML: signalHtml, TypeScript: signalTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="basicRange()"
              [placeholder]="placeholder()"
              [disabled]="disabled()"
              [minLength]="minLength()"
              [maxLength]="maxLength()"
              [hasError]="hasError()"
              (valueChange)="basicRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatRange(basicRange()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Two-way [(ngModel)]"
          description="Template-driven forms with two-way binding."
          [content]="{ HTML: ngModelHtml, TypeScript: ngModelTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range [(ngModel)]="ngModelRange" />
            <p class="text-xs text-text-secondary">
              ngModel:
              <code class="font-mono">{{ formatRange(ngModelRange) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive FormControl"
          description="Works with FormControl<[Date, Date]>."
          [content]="{ HTML: reactiveHtml, TypeScript: reactiveTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range [formControl]="rangeControl" />
            <p class="text-xs text-text-secondary">
              Control:
              <code class="font-mono">{{
                formatRange(rangeControl.value)
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled state"
          description="The input is non-interactive when disabled."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-full max-w-md">
            <nxp-input-date-range
              [value]="basicRange()"
              [disabled]="true"
              placeholder="Disabled"
            />
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Default presets sidebar"
          description="Built-in presets (Today, Yesterday, This week, This month, Last month, All time) shown in a sidebar for quick selection."
          [content]="{ HTML: defaultPresetsHtml, TypeScript: defaultPresetsTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="presetRange()"
              [items]="defaultPeriods"
              (valueChange)="presetRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatRange(presetRange()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Custom presets"
          description='Define your own named periods: "Next 7 days", "Next 30 days", "Next 90 days".'
          [content]="{ HTML: customPresetsHtml, TypeScript: customPresetsTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="customPresetRange()"
              [items]="customPeriods"
              (valueChange)="customPresetRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                formatRange(customPresetRange())
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max bounds"
          description="Only dates within ±30 days of today are selectable. Typing a date outside the range snaps each end to the nearest bound on blur."
          [content]="{ HTML: boundsHtml, TypeScript: boundsTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="boundedRange()"
              [min]="minDate"
              [max]="maxDate"
              (valueChange)="boundedRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatRange(boundedRange()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Length constraints"
          description="Minimum 3 days, maximum 14 days. Days that would violate the constraint are greyed out."
          [content]="{ HTML: lengthHtml, TypeScript: lengthTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="constrainedRange()"
              [minLength]="3"
              [maxLength]="14"
              (valueChange)="constrainedRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                formatRange(constrainedRange())
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled weekends"
          description="A custom disabledHandler prevents selection of Saturdays and Sundays."
          [content]="{ HTML: weekendsHtml, TypeScript: weekendsTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="weekdayRange()"
              [disabledHandler]="isWeekend"
              (valueChange)="weekdayRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatRange(weekdayRange()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Event markers"
          description="Coloured dots on the 5th, 10th, and 15th of each month."
          [content]="{ HTML: markersHtml, TypeScript: markersTs }"
        >
          <div class="space-y-3 w-full max-w-md">
            <nxp-input-date-range
              [value]="markerRange()"
              [markerHandler]="markerFn"
              (valueChange)="markerRange.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatRange(markerRange()) }}</code>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-input-date-range-api
          [(placeholder)]="placeholder"
          [(disabled)]="disabled"
          [(minLength)]="minLength"
          [(maxLength)]="maxLength"
          [(hasError)]="hasError"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class InputDateRangeDemoComponent {
  private static readonly DAY_MS = 86_400_000;

  // Playground state shared with the API tab.
  readonly placeholder = signal('DD/MM/YYYY – DD/MM/YYYY');
  readonly disabled = signal(false);
  readonly minLength = signal<number | null>(null);
  readonly maxLength = signal<number | null>(null);
  readonly hasError = signal(false);

  readonly basicRange = signal<[Date, Date] | null>(null);
  ngModelRange: [Date, Date] | null = null;
  readonly rangeControl = new FormControl<[Date, Date] | null>(null);

  readonly presetRange = signal<[Date, Date] | null>(null);
  readonly customPresetRange = signal<[Date, Date] | null>(null);
  readonly boundedRange = signal<[Date, Date] | null>(null);
  readonly constrainedRange = signal<[Date, Date] | null>(null);
  readonly weekdayRange = signal<[Date, Date] | null>(null);
  readonly markerRange = signal<[Date, Date] | null>(null);

  readonly defaultPeriods = createDefaultDateRangePeriods();

  readonly customPeriods: DateRangePeriod[] = (() => {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const d = InputDateRangeDemoComponent.DAY_MS;
    return [
      new DateRangePeriod(
        [start, new Date(start.getTime() + 7 * d)],
        'Next 7 days',
      ),
      new DateRangePeriod(
        [start, new Date(start.getTime() + 30 * d)],
        'Next 30 days',
      ),
      new DateRangePeriod(
        [start, new Date(start.getTime() + 90 * d)],
        'Next 90 days',
      ),
    ];
  })();

  readonly minDate = new Date(
    Date.now() - 30 * InputDateRangeDemoComponent.DAY_MS,
  );
  readonly maxDate = new Date(
    Date.now() + 30 * InputDateRangeDemoComponent.DAY_MS,
  );

  readonly isWeekend: DisabledHandler = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };

  readonly markerFn: MarkerHandler = (
    date: Date,
  ): [] | [string] | [string, string] => {
    const d = date.getDate();
    if (d % 15 === 0) return ['#3b82f6', '#ef4444'];
    if (d % 10 === 0) return ['#10b981'];
    if (d % 5 === 0) return ['#f59e0b'];
    return [];
  };

  formatRange(range: [Date, Date] | null | undefined): string {
    if (!range) return 'null';
    return `${range[0].toLocaleDateString()} – ${range[1].toLocaleDateString()}`;
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly signalHtml = `<nxp-input-date-range
  [value]="basicRange()"
  (valueChange)="basicRange.set($event)"
/>`;

  readonly signalTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-signal-binding',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal-binding.html',
})
export class SignalBindingExample {
  readonly basicRange = signal<[Date, Date] | null>(null);
}`;

  readonly ngModelHtml = `<nxp-input-date-range [(ngModel)]="ngModelRange" />`;

  readonly ngModelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-ngmodel',
  imports: [FormsModule, InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngmodel.html',
})
export class NgModelDateRangeExample {
  ngModelRange: [Date, Date] | null = null;
}`;

  readonly reactiveHtml = `<nxp-input-date-range [formControl]="rangeControl" />`;

  readonly reactiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-reactive',
  imports: [ReactiveFormsModule, InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive.html',
})
export class ReactiveDateRangeExample {
  readonly rangeControl = new FormControl<[Date, Date] | null>(null);
}`;

  readonly disabledHtml = `<nxp-input-date-range
  [value]="basicRange()"
  [disabled]="true"
  placeholder="Disabled"
/>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-disabled',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled.html',
})
export class DisabledDateRangeExample {
  readonly basicRange = signal<[Date, Date] | null>(null);
}`;

  readonly defaultPresetsHtml = `<nxp-input-date-range
  [value]="presetRange()"
  [items]="defaultPeriods"
  (valueChange)="presetRange.set($event)"
/>`;

  readonly defaultPresetsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { createDefaultDateRangePeriods } from '@ngxpro/components/calendar-range';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-default-presets',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './default-presets.html',
})
export class DefaultPresetsExample {
  readonly presetRange = signal<[Date, Date] | null>(null);
  readonly defaultPeriods = createDefaultDateRangePeriods();
}`;

  readonly customPresetsHtml = `<nxp-input-date-range
  [value]="customPresetRange()"
  [items]="customPeriods"
  (valueChange)="customPresetRange.set($event)"
/>`;

  readonly customPresetsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DateRangePeriod,
} from '@ngxpro/components/calendar-range';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

const DAY_MS = 86_400_000;

@Component({
  selector: 'app-custom-presets',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-presets.html',
})
export class CustomPresetsExample {
  readonly customPresetRange = signal<[Date, Date] | null>(null);

  readonly customPeriods: DateRangePeriod[] = (() => {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return [
      new DateRangePeriod(
        [start, new Date(start.getTime() + 7 * DAY_MS)],
        'Next 7 days',
      ),
      new DateRangePeriod(
        [start, new Date(start.getTime() + 30 * DAY_MS)],
        'Next 30 days',
      ),
      new DateRangePeriod(
        [start, new Date(start.getTime() + 90 * DAY_MS)],
        'Next 90 days',
      ),
    ];
  })();
}`;

  readonly boundsHtml = `<nxp-input-date-range
  [value]="boundedRange()"
  [min]="minDate"
  [max]="maxDate"
  (valueChange)="boundedRange.set($event)"
/>`;

  readonly boundsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

const DAY_MS = 86_400_000;

@Component({
  selector: 'app-bounds',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounds.html',
})
export class BoundsExample {
  readonly boundedRange = signal<[Date, Date] | null>(null);
  readonly minDate = new Date(Date.now() - 30 * DAY_MS);
  readonly maxDate = new Date(Date.now() + 30 * DAY_MS);
}`;

  readonly lengthHtml = `<nxp-input-date-range
  [value]="constrainedRange()"
  [minLength]="3"
  [maxLength]="14"
  (valueChange)="constrainedRange.set($event)"
/>`;

  readonly lengthTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-length',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './length.html',
})
export class LengthConstraintsExample {
  readonly constrainedRange = signal<[Date, Date] | null>(null);
}`;

  readonly weekendsHtml = `<nxp-input-date-range
  [value]="weekdayRange()"
  [disabledHandler]="isWeekend"
  (valueChange)="weekdayRange.set($event)"
/>`;

  readonly weekendsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { DisabledHandler } from '@ngxpro/components/calendar';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-weekends',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekends.html',
})
export class DisabledWeekendsExample {
  readonly weekdayRange = signal<[Date, Date] | null>(null);

  readonly isWeekend: DisabledHandler = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };
}`;

  readonly markersHtml = `<nxp-input-date-range
  [value]="markerRange()"
  [markerHandler]="markerFn"
  (valueChange)="markerRange.set($event)"
/>`;

  readonly markersTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { MarkerHandler } from '@ngxpro/components/calendar';
import { InputDateRangeComponent } from '@ngxpro/components/input-date-range';

@Component({
  selector: 'app-markers',
  imports: [InputDateRangeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './markers.html',
})
export class MarkersExample {
  readonly markerRange = signal<[Date, Date] | null>(null);

  readonly markerFn: MarkerHandler = (
    date: Date,
  ): [] | [string] | [string, string] => {
    const d = date.getDate();
    if (d % 15 === 0) return ['#3b82f6', '#ef4444'];
    if (d % 10 === 0) return ['#10b981'];
    if (d % 5 === 0) return ['#f59e0b'];
    return [];
  };
}`;
}
