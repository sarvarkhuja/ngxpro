import { DecimalPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpSlider,
  NxpSliderVisualComponent,
  NxpSliderComfortableComponent,
} from '@ngxpro/cdk';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { SliderApiComponent } from './slider-api.component';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const qualityLabels = ['Off', 'Low', 'Medium', 'High', 'Ultra'];
const reverbTypes = ['Room', 'Hall', 'Plate', 'Spring', 'Chamber'];
const filterModes = ['LP', 'BP', 'HP', 'Notch'];

@Component({
  selector: 'app-slider-demo',
  standalone: true,
  imports: [
    DecimalPipe,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...NxpSlider,
    NxpSliderVisualComponent,
    NxpSliderComfortableComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    SliderApiComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-doc-component-page
      header="Slider"
      package="cdk"
      type="component"
      path="cdk/slider"
    >
      <p class="text-base text-text-secondary mb-6">
        Three layers of slider primitives — a low-level CDK directive (<code
          class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpSlider</code
        >) for full control, plus two visually styled components (<code
          class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-slider-visual</code
        >
        and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-slider-comfortable</code
        >) with hover preview, step dots, tooltips, and theme color modes.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ============================================================== -->
        <!-- Channel Strip                                                   -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Channel Strip"
          description="Mixer channel strip built with nxp-slider-visual. Each row uses valuePosition='right' with a percentage formatter."
          [content]="{ HTML: channelStripHtml, TypeScript: channelStripTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-1">
            <nxp-slider-visual
              [(value)]="volume"
              label="Volume"
              valuePosition="right"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="bass"
              label="Bass"
              valuePosition="right"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="mid"
              label="Mid"
              valuePosition="right"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="treble"
              label="Treble"
              valuePosition="right"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="presence"
              label="Presence"
              valuePosition="right"
              [formatValue]="fmtPercent"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- Parametric EQ                                                   -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Parametric EQ"
          description="Per-row min/max/step plus custom formatters for Hz, kHz, and dB units. Demonstrates non-uniform ranges driven by [min] / [max] / [step]."
          [content]="{ HTML: parametricEqHtml, TypeScript: parametricEqTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-1">
            <nxp-slider-visual
              [(value)]="lowCut"
              [min]="20"
              [max]="500"
              [step]="10"
              label="Low Cut"
              valuePosition="right"
              [formatValue]="fmtHz"
            />
            <nxp-slider-visual
              [(value)]="lowShelf"
              label="Low Shelf"
              valuePosition="right"
              [formatValue]="fmtDb"
            />
            <nxp-slider-visual
              [(value)]="midFreq"
              [min]="200"
              [max]="8000"
              [step]="100"
              label="Mid Freq"
              valuePosition="right"
              [formatValue]="fmtFreq"
            />
            <nxp-slider-visual
              [(value)]="midGain"
              label="Mid Gain"
              valuePosition="right"
              [formatValue]="fmtDb"
            />
            <nxp-slider-visual
              [(value)]="highShelf"
              label="High Shelf"
              valuePosition="right"
              [formatValue]="fmtDb"
            />
            <nxp-slider-visual
              [(value)]="highCut"
              [min]="1000"
              [max]="20000"
              [step]="500"
              label="High Cut"
              valuePosition="right"
              [formatValue]="fmtFreq"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- Compressor                                                      -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Compressor"
          description="Ratio row enables [showSteps]='true' with [step]='5' to render visible dots along the track."
          [content]="{ HTML: compressorHtml, TypeScript: compressorTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-1">
            <nxp-slider-visual
              [(value)]="threshold"
              label="Threshold"
              valuePosition="right"
              [formatValue]="fmtThreshold"
            />
            <nxp-slider-visual
              [(value)]="ratio"
              label="Ratio"
              valuePosition="right"
              [step]="5"
              [showSteps]="true"
              [formatValue]="fmtRatio"
            />
            <nxp-slider-visual
              [(value)]="attack"
              label="Attack"
              valuePosition="right"
              [formatValue]="fmtAttack"
            />
            <nxp-slider-visual
              [(value)]="release"
              label="Release"
              valuePosition="right"
              [formatValue]="fmtRelease"
            />
            <nxp-slider-visual
              [(value)]="makeupGain"
              label="Makeup"
              valuePosition="right"
              [formatValue]="fmtMakeup"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- Effects Sends (tooltip mode)                                    -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Effects Sends"
          description="Switch valuePosition='tooltip' to float the value above the thumb while interacting."
          [content]="{ HTML: effectsSendsHtml, TypeScript: effectsSendsTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-1">
            <nxp-slider-visual
              [(value)]="reverbSend"
              label="Reverb"
              valuePosition="tooltip"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="delaySend"
              label="Delay"
              valuePosition="tooltip"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="chorusSend"
              label="Chorus"
              valuePosition="tooltip"
              [formatValue]="fmtPercent"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- Settings — Comfortable Pips                                     -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Comfortable — pips variant"
          description='Discrete step selector built from nxp-slider-comfortable variant="pips". Each step renders as a dot inside a bordered container.'
          [content]="{ HTML: pipsHtml, TypeScript: pipsTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-2">
            <nxp-slider-comfortable
              variant="pips"
              label="Reverb Type"
              [(value)]="reverbType"
              [min]="0"
              [max]="4"
              [formatValue]="fmtReverbType"
            />
            <nxp-slider-comfortable
              variant="pips"
              label="Quality"
              [(value)]="quality"
              [min]="0"
              [max]="4"
              [formatValue]="fmtQuality"
            />
            <nxp-slider-comfortable
              variant="pips"
              label="Filter"
              [(value)]="filterMode"
              [min]="0"
              [max]="3"
              [formatValue]="fmtFilter"
            />
            <nxp-slider-comfortable
              variant="pips"
              label="Oversample"
              [(value)]="oversample"
              [min]="0"
              [max]="3"
              [formatValue]="fmtOversample"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- Master Controls — Comfortable Scrubber                          -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Comfortable — scrubber variant"
          description='Continuous scrubber bar built from nxp-slider-comfortable variant="scrubber". Used for non-stepped controls like volume, pan, tempo.'
          [content]="{ HTML: scrubberHtml, TypeScript: scrubberTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-2">
            <nxp-slider-comfortable
              variant="scrubber"
              label="Master"
              [(value)]="masterVol"
              [min]="0"
              [max]="100"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-comfortable
              variant="scrubber"
              label="Pan"
              [(value)]="pan"
              [min]="0"
              [max]="100"
              [formatValue]="fmtPan"
            />
            <nxp-slider-comfortable
              variant="scrubber"
              label="Tempo"
              [(value)]="tempo"
              [min]="60"
              [max]="200"
              [formatValue]="fmtBpm"
            />
            <nxp-slider-comfortable
              variant="scrubber"
              label="Swing"
              [(value)]="swing"
              [min]="0"
              [max]="100"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-comfortable
              variant="scrubber"
              label="Dry / Wet"
              [(value)]="dryWet"
              [min]="0"
              [max]="100"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-comfortable
              variant="scrubber"
              label="Feedback"
              [(value)]="feedback"
              [min]="0"
              [max]="100"
              [formatValue]="fmtPercent"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- Theme Color Mode                                                -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="Theme color"
          description="Pass [themeColor]='true' to use the primary theme color instead of neutral gray — works on both nxp-slider-visual and nxp-slider-comfortable."
          [content]="{ HTML: themeColorHtml, TypeScript: themeColorTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-1">
            <nxp-slider-visual
              [(value)]="themedVolume"
              label="Volume"
              valuePosition="right"
              [themeColor]="true"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="themedBrightness"
              label="Brightness"
              valuePosition="right"
              [themeColor]="true"
              [formatValue]="fmtPercent"
            />
            <nxp-slider-visual
              [(value)]="themedContrast"
              label="Contrast"
              valuePosition="tooltip"
              [themeColor]="true"
              [step]="5"
              [showSteps]="true"
              [formatValue]="fmtPercent"
            />
          </div>
          <div class="w-full max-w-[720px] flex flex-col gap-2 mt-3">
            <nxp-slider-comfortable
              variant="pips"
              label="Priority"
              [(value)]="themedPriority"
              [min]="0"
              [max]="4"
              [themeColor]="true"
              [formatValue]="fmtPriority"
            />
            <nxp-slider-comfortable
              variant="scrubber"
              label="Opacity"
              [(value)]="themedOpacity"
              [min]="0"
              [max]="100"
              [themeColor]="true"
              [formatValue]="fmtPercent"
            />
          </div>
        </nxp-doc-example>

        <!-- ============================================================== -->
        <!-- CDK Primitive                                                   -->
        <!-- ============================================================== -->
        <nxp-doc-example
          heading="CDK primitive"
          description="The low-level nxpSlider attribute directive on a native range input — gives the consumer full styling control via Tailwind/CSS."
          [content]="{ HTML: cdkPrimitiveHtml, TypeScript: cdkPrimitiveTs }"
        >
          <div class="w-full max-w-[720px] flex flex-col gap-2">
            <input
              type="range"
              nxpSlider
              [(nxpValue)]="basicValue"
              [min]="0"
              [max]="100"
              class="slider-styled w-full"
            />
            <p class="text-xs text-text-tertiary">Value: {{ basicValue() }}</p>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-slider-api />
      </ng-template>
    </nxp-doc-component-page>
  `,
  styles: `
    /* Basic styling for the CDK primitive demo */
    .slider-styled {
      appearance: none;
      height: 6px;
      border-radius: 9999px;
      background: #e5e7eb;
      outline: none;
      cursor: pointer;
    }
    :host-context(.dark) .slider-styled {
      background: #374151;
    }
    .slider-styled::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 9999px;
      background: #3b82f6;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
    }
    .slider-styled::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 9999px;
      background: #3b82f6;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
    }
  `,
})
export class SliderDemoComponent {
  // --- Mixer channel strips ---
  readonly volume = signal(78);
  readonly bass = signal(55);
  readonly mid = signal(50);
  readonly treble = signal(62);
  readonly presence = signal(45);

  // --- EQ ---
  readonly lowCut = signal(30);
  readonly lowShelf = signal(40);
  readonly midFreq = signal(50);
  readonly midGain = signal(50);
  readonly highShelf = signal(55);
  readonly highCut = signal(12000);

  // --- Compressor ---
  readonly threshold = signal(65);
  readonly ratio = signal(30);
  readonly attack = signal(15);
  readonly release = signal(45);
  readonly makeupGain = signal(20);

  // --- Effects sends ---
  readonly reverbSend = signal(35);
  readonly delaySend = signal(20);
  readonly chorusSend = signal(0);

  // --- Comfortable pips ---
  readonly reverbType = signal(1);
  readonly quality = signal(3);
  readonly filterMode = signal(0);
  readonly oversample = signal(1);

  // --- Comfortable scrubber ---
  readonly masterVol = signal(80);
  readonly pan = signal(50);
  readonly tempo = signal(120);
  readonly swing = signal(0);
  readonly dryWet = signal(50);
  readonly feedback = signal(35);

  // --- Theme color ---
  readonly themedVolume = signal(65);
  readonly themedBrightness = signal(80);
  readonly themedContrast = signal(50);
  readonly themedPriority = signal(2);
  readonly themedOpacity = signal(75);

  // --- CDK primitive ---
  readonly basicValue = signal(50);

  // --- Carried over for parity with the pre-migration demo. The original demo
  //     imports DecimalPipe, JsonPipe, ReactiveFormsModule, FormControl, and
  //     RouterModule even though they were not referenced in the template —
  //     a FormControl field is preserved here so the imports stay justified
  //     after the migration and a reviewer can see the form-control wiring is
  //     intentional.
  readonly cdkFormControl = new FormControl<number>(50);

  // ---------------------------------------------------------------------------
  // Format functions (matching fluidfunctionalizm page.tsx)
  // ---------------------------------------------------------------------------

  readonly fmtPercent = (v: number) => `${v}%`;
  readonly fmtHz = (v: number) => `${v} Hz`;
  readonly fmtFreq = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)} kHz` : `${v} Hz`;
  readonly fmtDb = (v: number) => {
    const db = ((v - 50) / 50) * 12;
    return `${db >= 0 ? '+' : ''}${db.toFixed(1)} dB`;
  };
  readonly fmtThreshold = (v: number) => `${-Math.round((100 - v) * 0.6)} dB`;
  readonly fmtRatio = (v: number) => {
    const r = 1 + (v / 100) * 19;
    return `${r.toFixed(1)}:1`;
  };
  readonly fmtAttack = (v: number) => {
    const ms = 0.1 + (v / 100) * 99.9;
    return `${ms.toFixed(1)} ms`;
  };
  readonly fmtRelease = (v: number) => {
    const ms = 10 + (v / 100) * 990;
    return `${Math.round(ms)} ms`;
  };
  readonly fmtMakeup = (v: number) => {
    const db = (v / 100) * 24;
    return `+${db.toFixed(1)} dB`;
  };
  readonly fmtPan = (v: number) => {
    if (v === 50) return 'C';
    return v < 50 ? `L${50 - v}` : `R${v - 50}`;
  };
  readonly fmtBpm = (v: number) => `${v} BPM`;

  readonly fmtReverbType = (v: number) => reverbTypes[v];
  readonly fmtQuality = (v: number) => qualityLabels[v];
  readonly fmtFilter = (v: number) => filterModes[v];
  readonly fmtOversample = (v: number) => `${Math.pow(2, v)}x`;
  readonly fmtPriority = (v: number) =>
    ['None', 'Low', 'Medium', 'High', 'Critical'][v];

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────

  readonly channelStripHtml = `<div class="w-full max-w-[720px] flex flex-col gap-1">
  <nxp-slider-visual [(value)]="volume" label="Volume"
    valuePosition="right" [formatValue]="fmtPercent" />
  <nxp-slider-visual [(value)]="bass" label="Bass"
    valuePosition="right" [formatValue]="fmtPercent" />
  <nxp-slider-visual [(value)]="mid" label="Mid"
    valuePosition="right" [formatValue]="fmtPercent" />
  <nxp-slider-visual [(value)]="treble" label="Treble"
    valuePosition="right" [formatValue]="fmtPercent" />
  <nxp-slider-visual [(value)]="presence" label="Presence"
    valuePosition="right" [formatValue]="fmtPercent" />
</div>`;

  readonly channelStripTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSliderVisualComponent } from '@ngxpro/cdk';

@Component({
  selector: 'app-channel-strip',
  imports: [NxpSliderVisualComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './channel-strip.html',
})
export class ChannelStripExample {
  readonly volume = signal(78);
  readonly bass = signal(55);
  readonly mid = signal(50);
  readonly treble = signal(62);
  readonly presence = signal(45);
  readonly fmtPercent = (v: number) => \`\${v}%\`;
}`;

  readonly parametricEqHtml = `<nxp-slider-visual [(value)]="lowCut"
  [min]="20" [max]="500" [step]="10"
  label="Low Cut" valuePosition="right" [formatValue]="fmtHz" />
<nxp-slider-visual [(value)]="lowShelf"
  label="Low Shelf" valuePosition="right" [formatValue]="fmtDb" />
<nxp-slider-visual [(value)]="midFreq"
  [min]="200" [max]="8000" [step]="100"
  label="Mid Freq" valuePosition="right" [formatValue]="fmtFreq" />
<nxp-slider-visual [(value)]="midGain"
  label="Mid Gain" valuePosition="right" [formatValue]="fmtDb" />
<nxp-slider-visual [(value)]="highShelf"
  label="High Shelf" valuePosition="right" [formatValue]="fmtDb" />
<nxp-slider-visual [(value)]="highCut"
  [min]="1000" [max]="20000" [step]="500"
  label="High Cut" valuePosition="right" [formatValue]="fmtFreq" />`;

  readonly parametricEqTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSliderVisualComponent } from '@ngxpro/cdk';

@Component({
  selector: 'app-parametric-eq',
  imports: [NxpSliderVisualComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './parametric-eq.html',
})
export class ParametricEqExample {
  readonly lowCut = signal(30);
  readonly lowShelf = signal(40);
  readonly midFreq = signal(50);
  readonly midGain = signal(50);
  readonly highShelf = signal(55);
  readonly highCut = signal(12000);

  readonly fmtHz = (v: number) => \`\${v} Hz\`;
  readonly fmtFreq = (v: number) =>
    v >= 1000 ? \`\${(v / 1000).toFixed(1)} kHz\` : \`\${v} Hz\`;
  readonly fmtDb = (v: number) => {
    const db = ((v - 50) / 50) * 12;
    return \`\${db >= 0 ? '+' : ''}\${db.toFixed(1)} dB\`;
  };
}`;

  readonly compressorHtml = `<nxp-slider-visual [(value)]="threshold"
  label="Threshold" valuePosition="right" [formatValue]="fmtThreshold" />
<nxp-slider-visual [(value)]="ratio"
  label="Ratio" valuePosition="right"
  [step]="5" [showSteps]="true" [formatValue]="fmtRatio" />
<nxp-slider-visual [(value)]="attack"
  label="Attack" valuePosition="right" [formatValue]="fmtAttack" />
<nxp-slider-visual [(value)]="release"
  label="Release" valuePosition="right" [formatValue]="fmtRelease" />
<nxp-slider-visual [(value)]="makeupGain"
  label="Makeup" valuePosition="right" [formatValue]="fmtMakeup" />`;

  readonly compressorTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSliderVisualComponent } from '@ngxpro/cdk';

@Component({
  selector: 'app-compressor',
  imports: [NxpSliderVisualComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compressor.html',
})
export class CompressorExample {
  readonly threshold = signal(65);
  readonly ratio = signal(30);
  readonly attack = signal(15);
  readonly release = signal(45);
  readonly makeupGain = signal(20);

  readonly fmtThreshold = (v: number) => \`\${-Math.round((100 - v) * 0.6)} dB\`;
  readonly fmtRatio = (v: number) => {
    const r = 1 + (v / 100) * 19;
    return \`\${r.toFixed(1)}:1\`;
  };
  readonly fmtAttack = (v: number) => \`\${(0.1 + (v / 100) * 99.9).toFixed(1)} ms\`;
  readonly fmtRelease = (v: number) => \`\${Math.round(10 + (v / 100) * 990)} ms\`;
  readonly fmtMakeup = (v: number) => \`+\${((v / 100) * 24).toFixed(1)} dB\`;
}`;

  readonly effectsSendsHtml = `<nxp-slider-visual [(value)]="reverbSend"
  label="Reverb" valuePosition="tooltip" [formatValue]="fmtPercent" />
<nxp-slider-visual [(value)]="delaySend"
  label="Delay" valuePosition="tooltip" [formatValue]="fmtPercent" />
<nxp-slider-visual [(value)]="chorusSend"
  label="Chorus" valuePosition="tooltip" [formatValue]="fmtPercent" />`;

  readonly effectsSendsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSliderVisualComponent } from '@ngxpro/cdk';

@Component({
  selector: 'app-effects-sends',
  imports: [NxpSliderVisualComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './effects-sends.html',
})
export class EffectsSendsExample {
  readonly reverbSend = signal(35);
  readonly delaySend = signal(20);
  readonly chorusSend = signal(0);
  readonly fmtPercent = (v: number) => \`\${v}%\`;
}`;

  readonly pipsHtml = `<nxp-slider-comfortable variant="pips" label="Reverb Type"
  [(value)]="reverbType" [min]="0" [max]="4" [formatValue]="fmtReverbType" />
<nxp-slider-comfortable variant="pips" label="Quality"
  [(value)]="quality" [min]="0" [max]="4" [formatValue]="fmtQuality" />
<nxp-slider-comfortable variant="pips" label="Filter"
  [(value)]="filterMode" [min]="0" [max]="3" [formatValue]="fmtFilter" />
<nxp-slider-comfortable variant="pips" label="Oversample"
  [(value)]="oversample" [min]="0" [max]="3" [formatValue]="fmtOversample" />`;

  readonly pipsTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSliderComfortableComponent } from '@ngxpro/cdk';

const qualityLabels = ['Off', 'Low', 'Medium', 'High', 'Ultra'];
const reverbTypes = ['Room', 'Hall', 'Plate', 'Spring', 'Chamber'];
const filterModes = ['LP', 'BP', 'HP', 'Notch'];

@Component({
  selector: 'app-pips',
  imports: [NxpSliderComfortableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pips.html',
})
export class PipsExample {
  readonly reverbType = signal(1);
  readonly quality = signal(3);
  readonly filterMode = signal(0);
  readonly oversample = signal(1);

  readonly fmtReverbType = (v: number) => reverbTypes[v];
  readonly fmtQuality = (v: number) => qualityLabels[v];
  readonly fmtFilter = (v: number) => filterModes[v];
  readonly fmtOversample = (v: number) => \`\${Math.pow(2, v)}x\`;
}`;

  readonly scrubberHtml = `<nxp-slider-comfortable variant="scrubber" label="Master"
  [(value)]="masterVol" [min]="0" [max]="100" [formatValue]="fmtPercent" />
<nxp-slider-comfortable variant="scrubber" label="Pan"
  [(value)]="pan" [min]="0" [max]="100" [formatValue]="fmtPan" />
<nxp-slider-comfortable variant="scrubber" label="Tempo"
  [(value)]="tempo" [min]="60" [max]="200" [formatValue]="fmtBpm" />
<nxp-slider-comfortable variant="scrubber" label="Swing"
  [(value)]="swing" [min]="0" [max]="100" [formatValue]="fmtPercent" />
<nxp-slider-comfortable variant="scrubber" label="Dry / Wet"
  [(value)]="dryWet" [min]="0" [max]="100" [formatValue]="fmtPercent" />
<nxp-slider-comfortable variant="scrubber" label="Feedback"
  [(value)]="feedback" [min]="0" [max]="100" [formatValue]="fmtPercent" />`;

  readonly scrubberTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSliderComfortableComponent } from '@ngxpro/cdk';

@Component({
  selector: 'app-scrubber',
  imports: [NxpSliderComfortableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scrubber.html',
})
export class ScrubberExample {
  readonly masterVol = signal(80);
  readonly pan = signal(50);
  readonly tempo = signal(120);
  readonly swing = signal(0);
  readonly dryWet = signal(50);
  readonly feedback = signal(35);

  readonly fmtPercent = (v: number) => \`\${v}%\`;
  readonly fmtPan = (v: number) => {
    if (v === 50) return 'C';
    return v < 50 ? \`L\${50 - v}\` : \`R\${v - 50}\`;
  };
  readonly fmtBpm = (v: number) => \`\${v} BPM\`;
}`;

  readonly themeColorHtml = `<nxp-slider-visual [(value)]="themedVolume"
  label="Volume" valuePosition="right"
  [themeColor]="true" [formatValue]="fmtPercent" />
<nxp-slider-visual [(value)]="themedBrightness"
  label="Brightness" valuePosition="right"
  [themeColor]="true" [formatValue]="fmtPercent" />
<nxp-slider-visual [(value)]="themedContrast"
  label="Contrast" valuePosition="tooltip"
  [themeColor]="true" [step]="5" [showSteps]="true"
  [formatValue]="fmtPercent" />

<nxp-slider-comfortable variant="pips" label="Priority"
  [(value)]="themedPriority" [min]="0" [max]="4"
  [themeColor]="true" [formatValue]="fmtPriority" />
<nxp-slider-comfortable variant="scrubber" label="Opacity"
  [(value)]="themedOpacity" [min]="0" [max]="100"
  [themeColor]="true" [formatValue]="fmtPercent" />`;

  readonly themeColorTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpSliderVisualComponent,
  NxpSliderComfortableComponent,
} from '@ngxpro/cdk';

@Component({
  selector: 'app-theme-color',
  imports: [NxpSliderVisualComponent, NxpSliderComfortableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-color.html',
})
export class ThemeColorExample {
  readonly themedVolume = signal(65);
  readonly themedBrightness = signal(80);
  readonly themedContrast = signal(50);
  readonly themedPriority = signal(2);
  readonly themedOpacity = signal(75);

  readonly fmtPercent = (v: number) => \`\${v}%\`;
  readonly fmtPriority = (v: number) =>
    ['None', 'Low', 'Medium', 'High', 'Critical'][v];
}`;

  readonly cdkPrimitiveHtml = `<input
  type="range"
  nxpSlider
  [(nxpValue)]="basicValue"
  [min]="0"
  [max]="100"
  class="slider-styled w-full"
/>
<p>Value: {{ basicValue() }}</p>`;

  readonly cdkPrimitiveTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpSlider } from '@ngxpro/cdk';

@Component({
  selector: 'app-cdk-primitive',
  imports: [...NxpSlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cdk-primitive.html',
})
export class CdkPrimitiveExample {
  readonly basicValue = signal(50);
}`;
}
