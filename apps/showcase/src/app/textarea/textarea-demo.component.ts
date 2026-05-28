import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import {
  NxpTextareaComponent,
  NxpTextareaLimitDirective,
} from '@ngxpro/components/textarea';
import { TextareaApiComponent } from './textarea-api.component';

@Component({
  selector: 'app-textarea-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpLabelDirective,
    NxpTextareaComponent,
    NxpTextareaLimitDirective,
    NxpTextfieldComponent,
    TextareaApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Textarea"
      package="components"
      type="component"
      path="components/textarea"
    >
      <p class="text-base text-text-secondary mb-6">
        An auto-resizing textarea that grows between a configurable minimum and
        maximum number of rows. Most demos use
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-textfield</code
        >
        with
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >class="h-auto"</code
        >
        so the wrapper grows with the control, plus
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >label[nxpLabel]</code
        >. Supports character limits, error states, disabled state, and Angular
        forms.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Basic"
          description="textarea[nxpTextarea] inside nxp-textfield auto-resizes between 2 and 6 rows by default. The API tab controls drive the [min], [max], [hasError], and [class] bindings live."
          [content]="{ HTML: basicHtml, TypeScript: basicTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-textfield class="h-auto" [hasError]="hasError()">
              <label nxpLabel for="textarea-basic">Message</label>
              <textarea
                nxpTextarea
                id="textarea-basic"
                placeholder="Start typing..."
                [min]="min()"
                [max]="max()"
                [class]="class()"
                [(ngModel)]="basicValue"
              ></textarea>
            </nxp-textfield>
            <p class="text-xs text-text-tertiary">
              Length: {{ basicValue.length }} chars
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Custom rows"
          description='Set [min]="3" [max]="10" to lock the minimum height at 3 rows and scroll after 10 — useful for long-form input fields.'
          [content]="{ HTML: customRowsHtml, TypeScript: customRowsTs }"
        >
          <div class="w-full max-w-md">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="textarea-custom-rows">Long form</label>
              <textarea
                nxpTextarea
                id="textarea-custom-rows"
                [min]="3"
                [max]="10"
                placeholder="More room to write..."
                [(ngModel)]="customRowsValue"
              ></textarea>
            </nxp-textfield>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Floating label"
          description='Use placeholder=" " on the textarea inside nxp-textfield to get the floating-label treatment — the label slides to the border edge on focus or when the field has content.'
          [content]="{ HTML: floatingHtml, TypeScript: floatingTs }"
        >
          <div class="w-full max-w-md">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="description">Description</label>
              <textarea
                nxpTextarea
                id="description"
                placeholder=" "
                [(ngModel)]="floatingValue"
              ></textarea>
            </nxp-textfield>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Error state"
          description='Pass [hasError]="true" to nxp-textfield to show the error ring and red label.'
          [content]="{ HTML: errorHtml, TypeScript: errorTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-textfield class="h-auto" [hasError]="true">
              <label nxpLabel for="notes">Notes</label>
              <textarea
                nxpTextarea
                id="notes"
                placeholder=" "
                [(ngModel)]="errorValue"
              ></textarea>
            </nxp-textfield>
            <p class="text-xs text-status-negative">This field is required.</p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Character limit (200)"
          description="Add the [limit] input to render a live character counter beneath the textarea and apply maxlength validation to the bound form control. The counter turns red once the limit is exceeded."
          [content]="{ HTML: limit200Html, TypeScript: limit200Ts }"
        >
          <div class="w-full max-w-md">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="textarea-limit-200">Message</label>
              <textarea
                nxpTextarea
                id="textarea-limit-200"
                [limit]="limit()"
                placeholder="Type a message (max 200 chars)..."
                [(ngModel)]="limitValue"
              ></textarea>
            </nxp-textfield>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Short limit (50)"
          description="With a tight limit the counter turns red immediately when you go over. Same directive, different value."
          [content]="{ HTML: limit50Html, TypeScript: limit50Ts }"
        >
          <div class="w-full max-w-md">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="textarea-limit-50">Short message</label>
              <textarea
                nxpTextarea
                id="textarea-limit-50"
                [limit]="50"
                placeholder="Short message..."
                [(ngModel)]="shortLimitValue"
              ></textarea>
            </nxp-textfield>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Disabled"
          description="Native disabled attribute applies the disabled styling — the textarea becomes non-interactive while keeping its current content visible."
          [content]="{ HTML: disabledHtml, TypeScript: disabledTs }"
        >
          <div class="w-full max-w-md">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="textarea-disabled">Read-only note</label>
              <textarea
                nxpTextarea
                id="textarea-disabled"
                disabled
                placeholder="This textarea is disabled..."
              >
This content cannot be edited.</textarea
              >
            </nxp-textfield>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Reactive FormControl"
          description='Bind with [formControl]="ctrl". The directive plugs into Angular&apos;s reactive forms system via NxpTextfieldAccessor.'
          [content]="{ HTML: formControlHtml, TypeScript: formControlTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="textarea-comments">Comments</label>
              <textarea
                nxpTextarea
                id="textarea-comments"
                [formControl]="formCtrl"
                placeholder="Write your comments..."
              ></textarea>
            </nxp-textfield>
            <p class="text-xs text-text-tertiary">
              Value: <code class="font-mono">{{ formCtrl.value | json }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Two-way [(ngModel)]"
          description="Template-driven binding via FormsModule — the textarea exposes the same NxpTextfieldAccessor contract as reactive forms."
          [content]="{ HTML: ngModelHtml, TypeScript: ngModelTs }"
        >
          <div class="w-full max-w-md space-y-2">
            <nxp-textfield class="h-auto">
              <label nxpLabel for="feedback">Feedback</label>
              <textarea
                nxpTextarea
                id="feedback"
                placeholder=" "
                [(ngModel)]="ngModelValue"
              ></textarea>
            </nxp-textfield>
            <p class="text-xs text-text-tertiary">
              Value:
              <code class="font-mono break-all">{{ ngModelValue }}</code>
            </p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-textarea-api
          [(min)]="min"
          [(max)]="max"
          [(hasError)]="hasError"
          [(class)]="class"
          [(limit)]="limit"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class TextareaDemoComponent {
  // Playground state shared with the API tab via two-way bindings
  readonly min = signal<number | null>(null);
  readonly max = signal<number | null>(null);
  readonly hasError = signal(false);
  readonly class = signal('');
  readonly limit = signal<number>(200);

  // Basic
  basicValue = '';
  customRowsValue = '';

  // Inside textfield
  floatingValue = '';
  errorValue = '';

  // Character limit
  limitValue = '';
  shortLimitValue = '';

  // Reactive forms
  readonly formCtrl = new FormControl('');
  ngModelValue = '';

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly basicHtml = `<nxp-textfield class="h-auto" [hasError]="hasError()">
  <label nxpLabel for="textarea-basic">Message</label>
  <textarea
    nxpTextarea
    id="textarea-basic"
    placeholder="Start typing..."
    [min]="min()"
    [max]="max()"
    [class]="class()"
    [(ngModel)]="basicValue"
  ></textarea>
</nxp-textfield>`;

  readonly basicTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-basic',
  imports: [FormsModule, NxpLabelDirective, NxpTextareaComponent, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-basic.html',
})
export class TextareaBasicExample {
  readonly min = signal<number | null>(null);
  readonly max = signal<number | null>(null);
  readonly hasError = signal(false);
  readonly class = signal('');
  basicValue = '';
}`;

  readonly customRowsHtml = `<nxp-textfield class="h-auto">
  <label nxpLabel for="textarea-custom-rows">Long form</label>
  <textarea
    nxpTextarea
    id="textarea-custom-rows"
    [min]="3"
    [max]="10"
    placeholder="More room to write..."
    [(ngModel)]="customRowsValue"
  ></textarea>
</nxp-textfield>`;

  readonly customRowsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-custom-rows',
  imports: [FormsModule, NxpLabelDirective, NxpTextareaComponent, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-custom-rows.html',
})
export class TextareaCustomRowsExample {
  customRowsValue = '';
}`;

  readonly floatingHtml = `<nxp-textfield class="h-auto">
  <label nxpLabel for="description">Description</label>
  <textarea
    nxpTextarea
    id="description"
    placeholder=" "
    [(ngModel)]="floatingValue"
  ></textarea>
</nxp-textfield>`;

  readonly floatingTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-floating',
  imports: [FormsModule, NxpLabelDirective, NxpTextareaComponent, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-floating.html',
})
export class TextareaFloatingExample {
  floatingValue = '';
}`;

  readonly errorHtml = `<nxp-textfield class="h-auto" [hasError]="true">
  <label nxpLabel for="notes">Notes</label>
  <textarea
    nxpTextarea
    id="notes"
    placeholder=" "
    [(ngModel)]="errorValue"
  ></textarea>
</nxp-textfield>
<p class="text-xs text-status-negative">This field is required.</p>`;

  readonly errorTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-error',
  imports: [FormsModule, NxpLabelDirective, NxpTextareaComponent, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-error.html',
})
export class TextareaErrorExample {
  errorValue = '';
}`;

  readonly limit200Html = `<nxp-textfield class="h-auto">
  <label nxpLabel for="textarea-limit-200">Message</label>
  <textarea
    nxpTextarea
    id="textarea-limit-200"
    [limit]="200"
    placeholder="Type a message (max 200 chars)..."
    [(ngModel)]="limitValue"
  ></textarea>
</nxp-textfield>`;

  readonly limit200Ts = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import {
  NxpTextareaComponent,
  NxpTextareaLimitDirective,
} from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-limit-200',
  imports: [
    FormsModule,
    NxpLabelDirective,
    NxpTextareaComponent,
    NxpTextareaLimitDirective,
    NxpTextfieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-limit-200.html',
})
export class TextareaLimit200Example {
  limitValue = '';
}`;

  readonly limit50Html = `<nxp-textfield class="h-auto">
  <label nxpLabel for="textarea-limit-50">Short message</label>
  <textarea
    nxpTextarea
    id="textarea-limit-50"
    [limit]="50"
    placeholder="Short message..."
    [(ngModel)]="shortLimitValue"
  ></textarea>
</nxp-textfield>`;

  readonly limit50Ts = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import {
  NxpTextareaComponent,
  NxpTextareaLimitDirective,
} from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-limit-50',
  imports: [
    FormsModule,
    NxpLabelDirective,
    NxpTextareaComponent,
    NxpTextareaLimitDirective,
    NxpTextfieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-limit-50.html',
})
export class TextareaLimit50Example {
  shortLimitValue = '';
}`;

  readonly disabledHtml = `<nxp-textfield class="h-auto">
  <label nxpLabel for="textarea-disabled">Read-only note</label>
  <textarea
    nxpTextarea
    id="textarea-disabled"
    disabled
    placeholder="This textarea is disabled..."
  >This content cannot be edited.</textarea>
</nxp-textfield>`;

  readonly disabledTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-disabled',
  imports: [NxpLabelDirective, NxpTextareaComponent, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-disabled.html',
})
export class TextareaDisabledExample {}`;

  readonly formControlHtml = `<nxp-textfield class="h-auto">
  <label nxpLabel for="textarea-comments">Comments</label>
  <textarea
    nxpTextarea
    id="textarea-comments"
    [formControl]="formCtrl"
    placeholder="Write your comments..."
  ></textarea>
</nxp-textfield>
<p class="text-xs text-text-tertiary">
  Value: <code>{{ formCtrl.value | json }}</code>
</p>`;

  readonly formControlTs = `import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-form-control',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NxpLabelDirective,
    NxpTextareaComponent,
    NxpTextfieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-form-control.html',
})
export class TextareaFormControlExample {
  readonly formCtrl = new FormControl('');
}`;

  readonly ngModelHtml = `<nxp-textfield class="h-auto">
  <label nxpLabel for="feedback">Feedback</label>
  <textarea
    nxpTextarea
    id="feedback"
    placeholder=" "
    [(ngModel)]="ngModelValue"
  ></textarea>
</nxp-textfield>
<p class="text-xs text-text-tertiary">
  Value: <code>{{ ngModelValue }}</code>
</p>`;

  readonly ngModelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
import { NxpTextareaComponent } from '@ngxpro/components/textarea';

@Component({
  selector: 'app-textarea-ng-model',
  imports: [FormsModule, NxpLabelDirective, NxpTextareaComponent, NxpTextfieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea-ng-model.html',
})
export class TextareaNgModelExample {
  ngModelValue = '';
}`;
}
