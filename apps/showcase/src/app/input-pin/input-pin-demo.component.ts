import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpInputPinComponent } from '@ngxpro/components/input-pin';
import { InputPinApiComponent } from './input-pin-api.component';

@Component({
  selector: 'app-input-pin-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputPinApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpInputPinComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Input PIN"
      package="components"
      type="component"
      path="components/input-pin"
    >
      <p class="text-base text-text-secondary mb-6">
        PIN / OTP code input with individual visual cells backed by a single
        hidden native input. Supports numeric and alphanumeric modes, password
        masking, configurable length, and full Angular forms integration.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Drive every input from the API tab. Click any cell or use the keyboard — characters auto-advance to the next cell."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="space-y-3">
            <nxp-input-pin
              [length]="length()"
              [type]="type()"
              [mask]="mask()"
              [placeholder]="placeholder()"
              [disabled]="disabled()"
              [invalid]="invalid()"
              [class]="class()"
              (valueChange)="basicPin.set($event)"
            />
            <p class="text-xs text-text-secondary">
              Value:
              <code class="font-mono">{{ basicPin() || '(empty)' }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Forms integration"
          description="Works with both template-driven [(ngModel)] and reactive FormControl<string>."
          [content]="{ HTML: formsHtml, TypeScript: formsTs }"
        >
          <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
            <!-- ngModel -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Two-way [(ngModel)]
              </h3>
              <p class="text-sm text-text-secondary">
                Template-driven forms with two-way binding.
              </p>
              <nxp-input-pin [(ngModel)]="ngModelPin" [length]="4" />
              <p class="text-xs text-text-secondary">
                ngModel:
                <code class="font-mono">{{ ngModelPin || '(empty)' }}</code>
              </p>
            </div>

            <!-- Reactive form -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Reactive FormControl
              </h3>
              <p class="text-sm text-text-secondary">
                Works with
                <code class="font-mono text-xs">FormControl&lt;string&gt;</code
                >.
              </p>
              <nxp-input-pin [formControl]="pinControl" [length]="6" />
              <p class="text-xs text-text-secondary">
                Control:
                <code class="font-mono">{{
                  pinControl.value || '(empty)'
                }}</code>
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Lengths"
          description="Tune the [length] input to render fewer or more cells — common values are 4 for bank PINs and 6 for OTP codes."
          [content]="{ HTML: lengthsHtml, TypeScript: lengthsTs }"
        >
          <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                4-digit PIN
              </h3>
              <p class="text-sm text-text-secondary">
                Shorter length for bank PINs or short codes.
              </p>
              <nxp-input-pin
                [length]="4"
                (valueChange)="shortPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ shortPin() || '(empty)' }}</code>
              </p>
            </div>

            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                6-digit signal binding
              </h3>
              <p class="text-sm text-text-secondary">
                Default length, using the (valueChange) event with a signal.
              </p>
              <nxp-input-pin
                [length]="6"
                (valueChange)="basicPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ basicPin() || '(empty)' }}</code>
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Mask & type"
          description="mask controls whether filled cells render the typed character or a bullet. type restricts the allowed character set."
          [content]="{ HTML: maskTypeHtml, TypeScript: maskTypeTs }"
        >
          <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
            <!-- Password mask (default) -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Password mask (default)
              </h3>
              <p class="text-sm text-text-secondary">
                Filled cells show bullets (●) instead of actual characters.
              </p>
              <nxp-input-pin
                [length]="6"
                mask="password"
                (valueChange)="maskedPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ maskedPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Visible text mask -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Visible text
              </h3>
              <p class="text-sm text-text-secondary">
                <code class="font-mono text-xs">mask="text"</code> shows the
                actual characters.
              </p>
              <nxp-input-pin
                [length]="6"
                mask="text"
                (valueChange)="visiblePin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ visiblePin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Alphanumeric -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Alphanumeric
              </h3>
              <p class="text-sm text-text-secondary">
                <code class="font-mono text-xs">type="alphanumeric"</code>
                accepts letters and digits.
              </p>
              <nxp-input-pin
                [length]="6"
                type="alphanumeric"
                mask="text"
                (valueChange)="alphaPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ alphaPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Numeric only (default) -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Numeric only (default)
              </h3>
              <p class="text-sm text-text-secondary">
                <code class="font-mono text-xs">type="numeric"</code>
                strips non-digit input automatically.
              </p>
              <nxp-input-pin
                [length]="6"
                type="numeric"
                mask="text"
                (valueChange)="numericPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ numericPin() || '(empty)' }}</code>
              </p>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="States"
          description="Toggle error / disabled and customize the placeholder character shown in empty cells."
          [content]="{ HTML: statesHtml, TypeScript: statesTs }"
        >
          <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <!-- Error / invalid -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Error state
              </h3>
              <p class="text-sm text-text-secondary">
                <code class="font-mono text-xs">[invalid]="true"</code>
                shows red borders and error ring on all cells.
              </p>
              <nxp-input-pin
                [length]="6"
                [invalid]="true"
                mask="text"
                (valueChange)="errorPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{ errorPin() || '(empty)' }}</code>
              </p>
            </div>

            <!-- Disabled -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Disabled state
              </h3>
              <p class="text-sm text-text-secondary">
                Non-interactive when disabled. Cells appear muted.
              </p>
              <nxp-input-pin [length]="6" [disabled]="true" />
            </div>

            <!-- Custom placeholder -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-text-primary">
                Custom placeholder
              </h3>
              <p class="text-sm text-text-secondary">
                Override the default "·" placeholder character with a dash.
              </p>
              <nxp-input-pin
                [length]="6"
                placeholder="-"
                mask="text"
                (valueChange)="placeholderPin.set($event)"
              />
              <p class="text-xs text-text-secondary">
                Value:
                <code class="font-mono">{{
                  placeholderPin() || '(empty)'
                }}</code>
              </p>
            </div>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-input-pin-api
          [(length)]="length"
          [(type)]="type"
          [(mask)]="mask"
          [(placeholder)]="placeholder"
          [(disabled)]="disabled"
          [(invalid)]="invalid"
          [(class)]="class"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class InputPinDemoComponent {
  // ── Playground state shared with the API tab ───────────────────────────────
  readonly length = signal<number>(6);
  readonly type = signal<'numeric' | 'alphanumeric'>('numeric');
  readonly mask = signal<'password' | 'text'>('password');
  readonly placeholder = signal<string>('·');
  readonly disabled = signal<boolean>(false);
  readonly invalid = signal<boolean>(false);
  readonly class = signal<string>('');

  // ── Per-example state ──────────────────────────────────────────────────────
  readonly basicPin = signal('');
  ngModelPin = '';
  readonly pinControl = new FormControl<string>('');

  readonly shortPin = signal('');
  readonly maskedPin = signal('');
  readonly visiblePin = signal('');
  readonly alphaPin = signal('');
  readonly numericPin = signal('');
  readonly errorPin = signal('');
  readonly placeholderPin = signal('');

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-input-pin
  [length]="length()"
  [type]="type()"
  [mask]="mask()"
  [placeholder]="placeholder()"
  [disabled]="disabled()"
  [invalid]="invalid()"
  [class]="class()"
  (valueChange)="basicPin.set($event)"
/>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpInputPinComponent } from '@ngxpro/components/input-pin';

@Component({
  selector: 'app-playground',
  imports: [NxpInputPinComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundInputPinExample {
  readonly length = signal<number>(6);
  readonly type = signal<'numeric' | 'alphanumeric'>('numeric');
  readonly mask = signal<'password' | 'text'>('password');
  readonly placeholder = signal<string>('·');
  readonly disabled = signal<boolean>(false);
  readonly invalid = signal<boolean>(false);
  readonly class = signal<string>('');

  readonly basicPin = signal('');
}`;

  readonly formsHtml = `<!-- Template-driven -->
<nxp-input-pin [(ngModel)]="ngModelPin" [length]="4" />

<!-- Reactive -->
<nxp-input-pin [formControl]="pinControl" [length]="6" />`;

  readonly formsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxpInputPinComponent } from '@ngxpro/components/input-pin';

@Component({
  selector: 'app-forms',
  imports: [FormsModule, ReactiveFormsModule, NxpInputPinComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forms.html',
})
export class FormsInputPinExample {
  ngModelPin = '';
  readonly pinControl = new FormControl<string>('');
}`;

  readonly lengthsHtml = `<!-- 4-digit PIN -->
<nxp-input-pin [length]="4" (valueChange)="shortPin.set($event)" />

<!-- 6-digit (default) -->
<nxp-input-pin [length]="6" (valueChange)="basicPin.set($event)" />`;

  readonly lengthsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpInputPinComponent } from '@ngxpro/components/input-pin';

@Component({
  selector: 'app-lengths',
  imports: [NxpInputPinComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lengths.html',
})
export class LengthsInputPinExample {
  readonly shortPin = signal('');
  readonly basicPin = signal('');
}`;

  readonly maskTypeHtml = `<!-- Password mask (default) -->
<nxp-input-pin [length]="6" mask="password" (valueChange)="maskedPin.set($event)" />

<!-- Visible text -->
<nxp-input-pin [length]="6" mask="text" (valueChange)="visiblePin.set($event)" />

<!-- Alphanumeric -->
<nxp-input-pin
  [length]="6"
  type="alphanumeric"
  mask="text"
  (valueChange)="alphaPin.set($event)"
/>

<!-- Numeric only (default) -->
<nxp-input-pin
  [length]="6"
  type="numeric"
  mask="text"
  (valueChange)="numericPin.set($event)"
/>`;

  readonly maskTypeTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpInputPinComponent } from '@ngxpro/components/input-pin';

@Component({
  selector: 'app-mask-type',
  imports: [NxpInputPinComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mask-type.html',
})
export class MaskTypeInputPinExample {
  readonly maskedPin = signal('');
  readonly visiblePin = signal('');
  readonly alphaPin = signal('');
  readonly numericPin = signal('');
}`;

  readonly statesHtml = `<!-- Error / invalid -->
<nxp-input-pin
  [length]="6"
  [invalid]="true"
  mask="text"
  (valueChange)="errorPin.set($event)"
/>

<!-- Disabled -->
<nxp-input-pin [length]="6" [disabled]="true" />

<!-- Custom placeholder -->
<nxp-input-pin
  [length]="6"
  placeholder="-"
  mask="text"
  (valueChange)="placeholderPin.set($event)"
/>`;

  readonly statesTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpInputPinComponent } from '@ngxpro/components/input-pin';

@Component({
  selector: 'app-states',
  imports: [NxpInputPinComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './states.html',
})
export class StatesInputPinExample {
  readonly errorPin = signal('');
  readonly placeholderPin = signal('');
}`;
}
