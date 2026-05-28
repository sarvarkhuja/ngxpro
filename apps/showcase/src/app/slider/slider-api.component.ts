import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the slider demo. Inputs are exposed as two-way `model()`s
 * so the parent demo can share playground state — editing a row here updates
 * the live preview, and values persist to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-slider-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      Inputs accepted by the slider components. Edit a value to see the
      playground above react — values are persisted to the URL query string.
    </p>

    <!-- ─── nxp-slider-visual ─────────────────────────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-slider-visual</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[min]" type="number" [(value)]="visualMin">
        Minimum value of the slider. Defaults to
        <code>0</code
        >.
      </tr>
      <tr nxpDocApiItem name="[max]" type="number" [(value)]="visualMax">
        Maximum value of the slider. Defaults to
        <code>100</code
        >.
      </tr>
      <tr nxpDocApiItem name="[step]" type="number" [(value)]="visualStep">
        Step increment for snapped values. Defaults to
        <code>1</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[showSteps]"
        type="boolean"
        [(value)]="visualShowSteps"
      >
        When
        <code>true</code
        >, renders step dots along the track. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[showValue]"
        type="boolean"
        [(value)]="visualShowValue"
      >
        When
        <code>true</code
        >, renders a value display (position controlled by
        <code>valuePosition</code
        >). Defaults to
        <code>true</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[valuePosition]"
        type="'left' | 'right' | 'top' | 'bottom' | 'tooltip'"
        [items]="visualValuePositionOptions"
        [(value)]="visualValuePosition"
      >
        Where the value display is rendered relative to the track. Defaults to
        <code>'left'</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[label]"
        type="string | undefined"
        [(value)]="visualLabel"
      >
        Optional label rendered in the value display and used as
        <code>aria-label</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabled]"
        type="boolean"
        [(value)]="visualDisabled"
      >
        When
        <code>true</code
        >, disables pointer interaction and dims the slider. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[themeColor]"
        type="boolean"
        [(value)]="visualThemeColor"
      >
        When
        <code>true</code
        >, uses the theme primary color (<code>--nxp-primary</code>) instead of
        neutral gray. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[formatValue]"
        type="(v: number) => string"
        [(value)]="visualFormatValueLabel"
      >
        Function that formats the numeric value for display. Receives the
        current value and returns a string (e.g.
        <code>v =&gt; v + '%'</code
        >).
        <!-- function-typed input is shown as a label only -->
      </tr>
      <tr nxpDocApiItem name="[(value)]" type="number" [(value)]="visualValue">
        Two-way bound numeric value of the slider.
      </tr>
    </table>

    <!-- ─── nxp-slider-comfortable ────────────────────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >nxp-slider-comfortable</code
      >
    </h2>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[min]" type="number" [(value)]="comfortableMin">
        Minimum value of the slider. Defaults to
        <code>0</code
        >.
      </tr>
      <tr nxpDocApiItem name="[max]" type="number" [(value)]="comfortableMax">
        Maximum value of the slider. Defaults to
        <code>100</code
        >.
      </tr>
      <tr nxpDocApiItem name="[step]" type="number" [(value)]="comfortableStep">
        Step increment. In
        <code>pips</code>
        mode each step becomes a dot. Defaults to
        <code>1</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[variant]"
        type="'pips' | 'scrubber'"
        [items]="comfortableVariantOptions"
        [(value)]="comfortableVariant"
      >
        Visual variant —
        <code>pips</code>
        renders discrete dots,
        <code>scrubber</code>
        renders a continuous bar. Defaults to
        <code>'pips'</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[label]"
        type="string | undefined"
        [(value)]="comfortableLabel"
      >
        Optional label rendered inside the container.
      </tr>
      <tr
        nxpDocApiItem
        name="[disabled]"
        type="boolean"
        [(value)]="comfortableDisabled"
      >
        When
        <code>true</code
        >, disables pointer interaction. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[themeColor]"
        type="boolean"
        [(value)]="comfortableThemeColor"
      >
        When
        <code>true</code
        >, uses the theme primary color (<code>--nxp-primary</code>) instead of
        neutral gray. Defaults to
        <code>false</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[formatValue]"
        type="(v: number) => string"
        [(value)]="comfortableFormatValueLabel"
      >
        Function that formats the numeric value for display.
      </tr>
      <tr
        nxpDocApiItem
        name="[(value)]"
        type="number"
        [(value)]="comfortableValue"
      >
        Two-way bound numeric value of the slider.
      </tr>
    </table>

    <!-- ─── nxpSlider CDK primitive ───────────────────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[type=range][nxpSlider]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Low-level CDK slider applied as an attribute directive on a native
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;input type="range"&gt;</code
      >. Implements <code>ControlValueAccessor</code> so it composes with
      <code>[(ngModel)]</code> and <code>[formControl]</code>.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr nxpDocApiItem name="[min]" type="number" [(value)]="cdkMin">
        Minimum value of the slider. Defaults to
        <code>0</code
        >.
      </tr>
      <tr nxpDocApiItem name="[max]" type="number" [(value)]="cdkMax">
        Maximum value of the slider. Defaults to
        <code>100</code
        >.
      </tr>
      <tr nxpDocApiItem name="[step]" type="number" [(value)]="cdkStep">
        Step increment. Use
        <code>0</code>
        for continuous (<code>"any"</code>) movement. Defaults to
        <code>1</code
        >.
      </tr>
      <tr
        nxpDocApiItem
        name="[keySteps]"
        type="NxpKeySteps | undefined"
        [(value)]="cdkKeyStepsLabel"
      >
        Optional key steps for non-linear value mapping. When provided the
        underlying
        <code>&lt;input&gt;</code>
        operates on a 0–100 integer range and values are translated to/from the
        real domain automatically.
        <!-- TODO refine type — NxpKeySteps is a tuple type not editable in the playground -->
      </tr>
      <tr
        nxpDocApiItem
        name="[(disabled)]"
        type="boolean"
        [(value)]="cdkDisabled"
      >
        Whether the slider is disabled.
      </tr>
      <tr
        nxpDocApiItem
        name="[(nxpValue)]"
        type="number"
        [(value)]="cdkNxpValue"
      >
        Two-way bound model value (real domain). Prefer
        <code>[(ngModel)]</code>
        /
        <code>[formControl]</code>
        for reactive forms; this
        <code>model()</code>
        binding is available for simple template-only usage.
      </tr>
    </table>

    <!-- ─── nxpSlider readonly directive ──────────────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >input[nxpSlider][readonly]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Native <code>&lt;input type="range" readonly&gt;</code> does not actually
      prevent interaction.
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >NxpSliderReadonly</code
      >
      attaches alongside <code>nxpSlider</code> to imitate the expected readonly
      behaviour for range inputs.
    </p>
    <table nxpDocApi>
      <th class="w-[25%]">Name</th>
      <th class="w-[45%]">Type</th>
      <th class="w-[30%]">Value</th>
      <tr
        nxpDocApiItem
        name="[readonly]"
        type="boolean"
        [(value)]="readonlyReadonly"
      >
        Whether the slider is readonly. Mirrors the host
        <code>readonly</code>
        attribute. Defaults to
        <code>true</code
        >.
      </tr>
    </table>

    <!-- ─── nxpSliderThumbLabel ───────────────────────────────────────── -->
    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      <code class="text-base bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpSliderThumbLabel]</code
      >
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Wraps an <code>input[nxpSlider]</code> to render a floating label above
      the thumb showing the current value. No configurable inputs on this
      component — it reads <code>valueRatio</code> from the projected slider via
      <code>contentChild</code>.
    </p>
  `,
})
export class SliderApiComponent {
  // ─── nxp-slider-visual ─────────────────────────────────────────────────
  readonly visualMin = model(0);
  readonly visualMax = model(100);
  readonly visualStep = model(1);
  readonly visualShowSteps = model(false);
  readonly visualShowValue = model(true);
  readonly visualValuePosition = model<
    'left' | 'right' | 'top' | 'bottom' | 'tooltip'
  >('right');
  readonly visualLabel = model<string | undefined>('Volume');
  readonly visualDisabled = model(false);
  readonly visualThemeColor = model(false);
  readonly visualFormatValueLabel = model('(v) => `${v}%`');
  readonly visualValue = model(50);

  readonly visualValuePositionOptions = [
    'left',
    'right',
    'top',
    'bottom',
    'tooltip',
  ] as const;

  // ─── nxp-slider-comfortable ────────────────────────────────────────────
  readonly comfortableMin = model(0);
  readonly comfortableMax = model(100);
  readonly comfortableStep = model(1);
  readonly comfortableVariant = model<'pips' | 'scrubber'>('pips');
  readonly comfortableLabel = model<string | undefined>('Master');
  readonly comfortableDisabled = model(false);
  readonly comfortableThemeColor = model(false);
  readonly comfortableFormatValueLabel = model('(v) => `${v}%`');
  readonly comfortableValue = model(50);

  readonly comfortableVariantOptions = ['pips', 'scrubber'] as const;

  // ─── nxpSlider CDK primitive ───────────────────────────────────────────
  readonly cdkMin = model(0);
  readonly cdkMax = model(100);
  readonly cdkStep = model(1);
  readonly cdkKeyStepsLabel = model('undefined');
  readonly cdkDisabled = model(false);
  readonly cdkNxpValue = model(50);

  // ─── nxpSlider readonly directive ──────────────────────────────────────
  readonly readonlyReadonly = model(true);
}
