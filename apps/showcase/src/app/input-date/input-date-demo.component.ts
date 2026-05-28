import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type {
  DisabledHandler,
  MarkerHandler,
} from '@ngxpro/components/calendar';
import { InputDateComponent } from '@ngxpro/components/input-date';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { InputDateApiComponent } from './input-date-api.component';

@Component({
  selector: 'app-input-date-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputDateComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    InputDateApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Input Date"
      package="components"
      type="component"
      path="components/input-date"
    >
      <p class="text-base text-text-secondary mb-6">
        Text input with an inline calendar dropdown. Supports keyboard date
        entry (<code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >MM/DD/YYYY</code
        >,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >MM-DD-YYYY</code
        >,
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >YYYY-MM-DD</code
        >),
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >min</code
        >
        /
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >max</code
        >
        bounds, disabled dates, markers, and Angular forms via
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ControlValueAccessor</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live preview bound to the API tab — edit any row over there to see the input react. URL query string persists every value."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [(value)]="basicDate"
              [(disabled)]="playgroundDisabled"
              [placeholder]="playgroundPlaceholder()"
              [weekStart]="playgroundWeekStart()"
              [hasError]="playgroundHasError()"
              [class]="playgroundClass()"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                basicDate() ? basicDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Signal binding"
          description="Click the input to open the calendar or type a date directly. Bind the value with a signal via [value] / (valueChange) or the two-way [(value)] shortcut."
          [content]="{ HTML: signalHtml, TypeScript: signalTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [value]="signalDate()"
              (valueChange)="signalDate.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                signalDate() ? signalDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Template-driven [(ngModel)]"
          description="Two-way binding with ngModel for template-driven forms. The component implements ControlValueAccessor."
          [content]="{ HTML: ngModelHtml, TypeScript: ngModelTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date [(ngModel)]="ngModelDate" />
            <p class="text-xs text-text-secondary">
              ngModel:
              <code class="font-mono">{{
                ngModelDate ? ngModelDate.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive FormControl"
          description="Works seamlessly with FormControl<Date | null> from Angular reactive forms."
          [content]="{ HTML: reactiveHtml, TypeScript: reactiveTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date [formControl]="dateControl" />
            <p class="text-xs text-text-secondary">
              Control:
              <code class="font-mono">{{
                dateControl.value
                  ? dateControl.value.toLocaleDateString()
                  : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max bounds"
          description="Pass [min] and [max] to constrain the selectable range. Only dates within ±7 days of today are selectable here."
          [content]="{ HTML: boundsHtml, TypeScript: boundsTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [value]="boundedDate()"
              [min]="minDate"
              [max]="maxDate"
              (valueChange)="boundedDate.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                boundedDate() ? boundedDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled weekends"
          description="A custom disabledHandler prevents selection of Saturdays and Sundays."
          [content]="{ HTML: weekendHtml, TypeScript: weekendTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [value]="weekdayDate()"
              [disabledHandler]="isWeekend"
              (valueChange)="weekdayDate.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                weekdayDate() ? weekdayDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled state"
          description='Pass [disabled]="true" to make the input non-interactive. The dropdown will not open and the input cannot be edited.'
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-72">
            <nxp-input-date
              [value]="basicDate()"
              [disabled]="true"
              placeholder="Disabled"
            />
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Event markers"
          description="Project a markerHandler to render coloured dots under specific dates. Here the 5th = amber, 10th = green, 15th = blue + red."
          [content]="{ HTML: markersHtml, TypeScript: markersTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [value]="markerDate()"
              [markerHandler]="markerFn"
              (valueChange)="markerDate.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                markerDate() ? markerDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Week starts on Sunday"
          description='Pass [weekStart]="0" to start the week on Sunday instead of the default Monday.'
          [content]="{ HTML: sundayHtml, TypeScript: sundayTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [value]="sundayDate()"
              [weekStart]="0"
              (valueChange)="sundayDate.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                sundayDate() ? sundayDate()!.toLocaleDateString() : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Custom placeholder"
          description="Override the placeholder text shown when the input is empty."
          [content]="{ HTML: placeholderHtml, TypeScript: placeholderTs }"
        >
          <div class="w-72 space-y-3">
            <nxp-input-date
              [value]="placeholderDate()"
              placeholder="Pick a date…"
              (valueChange)="placeholderDate.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                placeholderDate()
                  ? placeholderDate()!.toLocaleDateString()
                  : 'null'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-input-date-api
          [(value)]="basicDate"
          [(disabled)]="playgroundDisabled"
          [(placeholder)]="playgroundPlaceholder"
          [(weekStart)]="playgroundWeekStart"
          [(hasError)]="playgroundHasError"
          [(class)]="playgroundClass"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class InputDateDemoComponent {
  // ── Playground state — shared with the API tab via two-way model() ───────
  readonly basicDate = signal<Date | null>(null);
  readonly playgroundDisabled = signal(false);
  readonly playgroundPlaceholder = signal('MM/DD/YYYY');
  readonly playgroundWeekStart = signal<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly playgroundHasError = signal(false);
  readonly playgroundClass = signal('');

  // ── Per-example state (independent so each block stays self-contained) ──
  readonly signalDate = signal<Date | null>(null);
  ngModelDate: Date | null = null;
  readonly dateControl = new FormControl<Date | null>(null);

  readonly boundedDate = signal<Date | null>(null);
  readonly weekdayDate = signal<Date | null>(null);
  readonly markerDate = signal<Date | null>(null);
  readonly sundayDate = signal<Date | null>(null);
  readonly placeholderDate = signal<Date | null>(null);

  readonly minDate = new Date(Date.now() - 7 * 86_400_000);
  readonly maxDate = new Date(Date.now() + 7 * 86_400_000);

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

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-input-date
  [(value)]="date"
  [(disabled)]="disabled"
  [placeholder]="placeholder()"
  [weekStart]="weekStart()"
  [hasError]="hasError()"
  [class]="extraClass()"
/>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-playground',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundInputDateExample {
  readonly date = signal<Date | null>(null);
  readonly disabled = signal(false);
  readonly placeholder = signal('MM/DD/YYYY');
  readonly weekStart = signal<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly hasError = signal(false);
  readonly extraClass = signal('');
}`;

  readonly signalHtml = `<nxp-input-date
  [value]="date()"
  (valueChange)="date.set($event)"
/>`;

  readonly signalTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-signal',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal.html',
})
export class SignalInputDateExample {
  readonly date = signal<Date | null>(null);
}`;

  readonly ngModelHtml = `<nxp-input-date [(ngModel)]="date" />`;

  readonly ngModelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-ng-model',
  imports: [FormsModule, InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ng-model.html',
})
export class NgModelInputDateExample {
  date: Date | null = null;
}`;

  readonly reactiveHtml = `<nxp-input-date [formControl]="dateControl" />`;

  readonly reactiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-reactive',
  imports: [ReactiveFormsModule, InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive.html',
})
export class ReactiveInputDateExample {
  readonly dateControl = new FormControl<Date | null>(null);
}`;

  readonly boundsHtml = `<nxp-input-date
  [value]="date()"
  [min]="minDate"
  [max]="maxDate"
  (valueChange)="date.set($event)"
/>`;

  readonly boundsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-bounds',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounds.html',
})
export class BoundsInputDateExample {
  readonly date = signal<Date | null>(null);
  readonly minDate = new Date(Date.now() - 7 * 86_400_000);
  readonly maxDate = new Date(Date.now() + 7 * 86_400_000);
}`;

  readonly weekendHtml = `<nxp-input-date
  [value]="date()"
  [disabledHandler]="isWeekend"
  (valueChange)="date.set($event)"
/>`;

  readonly weekendTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { DisabledHandler } from '@ngxpro/components/calendar';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-weekend',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekend.html',
})
export class WeekendInputDateExample {
  readonly date = signal<Date | null>(null);

  readonly isWeekend: DisabledHandler = (date: Date) => {
    const dow = date.getDay();
    return dow === 0 || dow === 6;
  };
}`;

  readonly disabledHtml = `<nxp-input-date
  [value]="date()"
  [disabled]="true"
  placeholder="Disabled"
/>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-disabled',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled.html',
})
export class DisabledInputDateExample {
  readonly date = signal<Date | null>(null);
}`;

  readonly markersHtml = `<nxp-input-date
  [value]="date()"
  [markerHandler]="markerFn"
  (valueChange)="date.set($event)"
/>`;

  readonly markersTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { MarkerHandler } from '@ngxpro/components/calendar';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-markers',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './markers.html',
})
export class MarkersInputDateExample {
  readonly date = signal<Date | null>(null);

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

  readonly sundayHtml = `<nxp-input-date
  [value]="date()"
  [weekStart]="0"
  (valueChange)="date.set($event)"
/>`;

  readonly sundayTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-sunday',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sunday.html',
})
export class SundayInputDateExample {
  readonly date = signal<Date | null>(null);
}`;

  readonly placeholderHtml = `<nxp-input-date
  [value]="date()"
  placeholder="Pick a date…"
  (valueChange)="date.set($event)"
/>`;

  readonly placeholderTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputDateComponent } from '@ngxpro/components/input-date';

@Component({
  selector: 'app-placeholder',
  imports: [InputDateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './placeholder.html',
})
export class PlaceholderInputDateExample {
  readonly date = signal<Date | null>(null);
}`;
}
