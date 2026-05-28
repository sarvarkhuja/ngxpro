import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';
import type { NxpDialogSize } from '@ngxpro/cdk';

/**
 * API table for the dialog demo. Inputs are exposed as two-way `model()`s so
 * the parent demo can share playground state — editing a row here updates the
 * live "Configurable playground" preview, and values persist to the URL via
 * `nxpDocApiItem`.
 */
@Component({
  selector: 'app-dialog-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Options accepted by the dialog APIs. Edit a value to see the "Configurable
      playground" example above react — values are persisted to the URL query
      string. The same options object is consumed by
      <code>NxpDialogService.open(content, options)</code>,
      <code>nxpDialog(MyComponent, options)</code>, and the
      <code>nxpDialog</code> directive via <code>[nxpDialogOptions]</code>.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpDialogOptions</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      The shape passed as the second argument to
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpDialogService.open()</code
      >, to the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpDialog()</code
      >
      factory, and bound to
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpDialogOptions]</code
      >
      on the structural directive. Override defaults globally with
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NXP_DIALOG_DEFAULT_OPTIONS</code
      >.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[label]" type="string" [(value)]="label">
        Header title text. Rendered as the dialog's
        <code>&lt;h2&gt;</code>
        heading and linked via
        <code>aria-labelledby</code>
        on the focus trap container.
      </tr>
      <tr
        nxpDocApiItem
        name="[size]"
        type="'s' | 'm' | 'l'"
        [items]="sizeOptions"
        [(value)]="size"
      >
        Dialog width scale.
        <code>'s'</code>
        = 25 rem,
        <code>'m'</code>
        = 37.5 rem (default),
        <code>'l'</code>
        = 50 rem. The dialog is also capped to
        <code>calc(100vw - 2rem)</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[closable]"
        type="boolean | Observable<boolean>"
        [(value)]="closable"
      >
        Whether the close (×) button is rendered in the top-right corner. When
        the close button is clicked the value is checked — pass an
        <code>Observable&lt;boolean&gt;</code>
        to gate closing behind an async confirmation.
      </tr>
      <tr
        nxpDocApiItem
        name="[dismissible]"
        type="boolean | Observable<boolean>"
        [(value)]="dismissible"
      >
        Whether the dialog can be dismissed by pressing Esc or clicking outside.
        Same async-gate semantics as
        <code>closable</code
        >.
      </tr>
      <tr nxpDocApiItem name="[required]" type="boolean" [(value)]="required">
        When
        <code>true</code
        >, dismissing the dialog (close button, Esc, click outside) errors the
        result stream with
        <code>Required dialog was dismissed</code>
        instead of completing normally. Use this to force a deliberate user
        choice.
      </tr>
      <tr
        nxpDocApiItem
        name="[appearance]"
        type="string"
        [(value)]="appearance"
      >
        Free-form appearance tag set as the
        <code>data-appearance</code>
        attribute on the host. Style hook for custom variants.
      </tr>
      <tr nxpDocApiItem name="[data]" type="I" [(value)]="data">
        Arbitrary payload forwarded to the dialog content via
        <code>NxpDialogContext.data</code
        >. Components retrieve it with
        <code>nxpInjectContext&lt;NxpDialogContext&lt;O, I&gt;&gt;()</code
        >.
        <!-- TODO refine type — generic I is per-call -->
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpDialog</code
      >
      directive
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Structural directive for inline template-based dialogs. Toggle visibility
      with a boolean signal — perfect for "controlled" dialogs without reaching
      for the service.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[nxpDialog]"
        type="boolean"
        [(value)]="dialogOpen"
      >
        Two-way bound open state. Set to
        <code>true</code>
        to show the dialog,
        <code>false</code>
        to hide. Emits
        <code>(nxpDialogChange)</code>
        when the dialog closes itself.
      </tr>
      <tr
        nxpDocApiItem
        name="[nxpDialogOptions]"
        type="Partial<NxpDialogOptions<T>>"
        [(value)]="optionsJson"
      >
        Options object — same shape as documented above. Bind a literal object
        or a signal-derived value.
        <!-- TODO refine type — object editor not yet supported -->
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpDialogService</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Inject and call
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >dialogService.open(content, options)</code
      >. The first argument accepts a <code>string</code>,
      <code>TemplateRef</code>, or <code>NxpDynamicComponent</code> wrapping a
      standalone component. Returns an
      <code>Observable&lt;Result&gt;</code> that emits when the dialog completes
      via <code>context.completeWith(value)</code> or completes silently on
      cancel.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpDialog()</code
      >
      factory
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Call
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxpDialog(MyComponent, options)</code
      >
      as a class field to create a typed opener function. Invoke it with the
      data payload — no extra boilerplate, fully injection-context aware.
    </p>
  `,
})
export class DialogApiComponent {
  readonly label = model('Configurable dialog');
  readonly size = model<NxpDialogSize>('m');
  readonly closable = model(true);
  readonly dismissible = model(true);
  readonly required = model(false);
  readonly appearance = model('default');
  readonly data = model<string>('');

  // Inputs on the nxpDialog directive itself
  readonly dialogOpen = model(false);
  readonly optionsJson = model<string>('{ label: "Inline dialog" }');

  readonly sizeOptions = ['s', 'm', 'l'] as const;
}
