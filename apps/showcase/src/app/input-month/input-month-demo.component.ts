import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import type { MonthCoord } from '@ngxpro/components/calendar-month';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import { InputMonthApiComponent } from './input-month-api.component';

@Component({
  selector: 'app-input-month-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputMonthComponent,
    InputMonthApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Input Month"
      package="components"
      type="component"
      path="components/input-month"
    >
      <p class="text-base text-text-secondary mb-6">
        Month picker input with a calendar-month dropdown. The input is
        read-only — the user selects a month from the grid. Displays the value
        as
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >Month YYYY</code
        >
        (e.g. "March 2026"). Built on
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-input-month</code
        >
        and powered by
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-calendar-month</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Signal binding"
          description="Click to open the month grid and select a month. Bind value via the [value] / (valueChange) signal pair."
          [content]="{ HTML: signalHtml, TypeScript: signalTs }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month
              [value]="basicMonth()"
              [placeholder]="placeholder()"
              [disabled]="disabled()"
              [rangeMode]="rangeMode()"
              [hasError]="hasError()"
              [class]="className()"
              [inputId]="inputId()"
              [ariaLabel]="ariaLabel()"
              [ariaLabelledBy]="ariaLabelledBy()"
              (valueChange)="basicMonth.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatCoord(basicMonth()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Two-way [(ngModel)]"
          description="Template-driven forms with two-way binding. The input writes back to the bound property whenever the user picks a month."
          [content]="{ HTML: ngModelHtml, TypeScript: ngModelTs }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month [(ngModel)]="ngModelMonth" />
            <p class="text-xs text-text-secondary">
              ngModel:
              <code class="font-mono">{{ formatCoord(ngModelMonth) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive FormControl"
          description="Works with FormControl<MonthCoord>. setValue() flows through writeValue() and updates the calendar."
          [content]="{ HTML: reactiveHtml, TypeScript: reactiveTs }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month [formControl]="monthControl" />
            <p class="text-xs text-text-secondary">
              Control:
              <code class="font-mono">{{
                formatCoord(monthControl.value)
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Min / Max bounds"
          description="Limited to Jan 2025 – Dec 2026. Months outside this range are greyed out in the dropdown."
          [content]="{ HTML: boundsHtml, TypeScript: boundsTs }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month
              [value]="boundedMonth()"
              [min]="minMonth"
              [max]="maxMonth"
              (valueChange)="boundedMonth.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatCoord(boundedMonth()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled months"
          description="A custom disabledHandler prevents Q1 months (Jan–Mar) from being selected."
          [content]="{
            HTML: disabledHandlerHtml,
            TypeScript: disabledHandlerTs,
          }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month
              [value]="disabledMonth()"
              [disabledHandler]="isQ1"
              (valueChange)="disabledMonth.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ formatCoord(disabledMonth()) }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled state"
          description="The input is non-interactive when [disabled] is true."
          [content]="{ HTML: disabledStateHtml, TypeScript: disabledStateTs }"
        >
          <div class="w-full max-w-sm">
            <nxp-input-month
              [value]="basicMonth()"
              [disabled]="true"
              placeholder="Disabled"
            />
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Custom placeholder"
          description="Override the default 'Month YYYY' placeholder with anything meaningful for your domain."
          [content]="{ HTML: placeholderHtml, TypeScript: placeholderTs }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month
              [value]="placeholderMonth()"
              placeholder="Select billing period…"
              (valueChange)="placeholderMonth.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                formatCoord(placeholderMonth())
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Pre-selected value"
          description="Seed the input with an initial value — here, the current month."
          [content]="{ HTML: preselectedHtml, TypeScript: preselectedTs }"
        >
          <div class="w-full max-w-sm space-y-3">
            <nxp-input-month
              [value]="preselectedMonth()"
              (valueChange)="preselectedMonth.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{
                formatCoord(preselectedMonth())
              }}</code>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-input-month-api
          [(placeholder)]="placeholder"
          [(disabled)]="disabled"
          [(rangeMode)]="rangeMode"
          [(hasError)]="hasError"
          [(className)]="className"
          [(inputId)]="inputId"
          [(ariaLabel)]="ariaLabel"
          [(ariaLabelledBy)]="ariaLabelledBy"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class InputMonthDemoComponent {
  private readonly now = new Date();

  // ── Shared playground state (driven by the API tab) ────────────────────────
  readonly placeholder = signal<string>('Month YYYY');
  readonly disabled = signal<boolean>(false);
  readonly rangeMode = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);
  readonly className = signal<string>('');
  readonly inputId = signal<string>('');
  readonly ariaLabel = signal<string | null>(null);
  readonly ariaLabelledBy = signal<string | null>(null);

  // ── Per-example state (preserved from the original demo) ───────────────────
  readonly basicMonth = signal<MonthCoord | null>(null);
  ngModelMonth: MonthCoord | null = null;
  readonly monthControl = new FormControl<MonthCoord | null>(null);

  readonly boundedMonth = signal<MonthCoord | null>(null);
  readonly disabledMonth = signal<MonthCoord | null>(null);
  readonly placeholderMonth = signal<MonthCoord | null>(null);
  readonly preselectedMonth = signal<MonthCoord | null>({
    year: this.now.getFullYear(),
    month: this.now.getMonth(),
  });

  readonly minMonth: MonthCoord = { year: 2025, month: 0 };
  readonly maxMonth: MonthCoord = { year: 2026, month: 11 };

  readonly isQ1 = (m: MonthCoord): boolean => m.month <= 2;

  formatCoord(m: MonthCoord | null | undefined): string {
    if (!m) return 'null';
    const names = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${names[m.month]} ${m.year}`;
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly signalHtml = `<nxp-input-month
  [value]="basicMonth()"
  (valueChange)="basicMonth.set($event)"
/>`;

  readonly signalTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-signal-binding',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal-binding.html',
})
export class SignalBindingExample {
  readonly basicMonth = signal<MonthCoord | null>(null);
}`;

  readonly ngModelHtml = `<nxp-input-month [(ngModel)]="ngModelMonth" />`;

  readonly ngModelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-ngmodel',
  imports: [FormsModule, InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngmodel.html',
})
export class NgModelInputMonthExample {
  ngModelMonth: MonthCoord | null = null;
}`;

  readonly reactiveHtml = `<nxp-input-month [formControl]="monthControl" />`;

  readonly reactiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-reactive',
  imports: [ReactiveFormsModule, InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive.html',
})
export class ReactiveInputMonthExample {
  readonly monthControl = new FormControl<MonthCoord | null>(null);
}`;

  readonly boundsHtml = `<nxp-input-month
  [value]="boundedMonth()"
  [min]="minMonth"
  [max]="maxMonth"
  (valueChange)="boundedMonth.set($event)"
/>`;

  readonly boundsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-bounds',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bounds.html',
})
export class BoundsInputMonthExample {
  readonly boundedMonth = signal<MonthCoord | null>(null);
  readonly minMonth: MonthCoord = { year: 2025, month: 0 };
  readonly maxMonth: MonthCoord = { year: 2026, month: 11 };
}`;

  readonly disabledHandlerHtml = `<nxp-input-month
  [value]="disabledMonth()"
  [disabledHandler]="isQ1"
  (valueChange)="disabledMonth.set($event)"
/>`;

  readonly disabledHandlerTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-disabled-months',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-months.html',
})
export class DisabledMonthsExample {
  readonly disabledMonth = signal<MonthCoord | null>(null);

  readonly isQ1 = (m: MonthCoord): boolean => m.month <= 2;
}`;

  readonly disabledStateHtml = `<nxp-input-month
  [value]="basicMonth()"
  [disabled]="true"
  placeholder="Disabled"
/>`;

  readonly disabledStateTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-disabled-state',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-state.html',
})
export class DisabledStateExample {
  readonly basicMonth = signal<MonthCoord | null>(null);
}`;

  readonly placeholderHtml = `<nxp-input-month
  [value]="placeholderMonth()"
  placeholder="Select billing period…"
  (valueChange)="placeholderMonth.set($event)"
/>`;

  readonly placeholderTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-custom-placeholder',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-placeholder.html',
})
export class CustomPlaceholderExample {
  readonly placeholderMonth = signal<MonthCoord | null>(null);
}`;

  readonly preselectedHtml = `<nxp-input-month
  [value]="preselectedMonth()"
  (valueChange)="preselectedMonth.set($event)"
/>`;

  readonly preselectedTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputMonthComponent } from '@ngxpro/components/input-month';
import type { MonthCoord } from '@ngxpro/components/calendar-month';

@Component({
  selector: 'app-preselected',
  imports: [InputMonthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preselected.html',
})
export class PreselectedInputMonthExample {
  private readonly now = new Date();

  readonly preselectedMonth = signal<MonthCoord | null>({
    year: this.now.getFullYear(),
    month: this.now.getMonth(),
  });
}`;
}
