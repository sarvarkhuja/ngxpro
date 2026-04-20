import { DecimalPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpSlider,
  NxpSliderVisualComponent,
  NxpSliderComfortableComponent,
  type NxpKeySteps,
} from '@nxp/cdk';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-12 px-10 py-10 w-full max-w-[720px] mx-auto">
      <div class="flex flex-col gap-1">
        <a
          routerLink="/"
          class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          &larr; Back to home
        </a>
        <h1 class="text-[22px] font-bold text-gray-900 dark:text-white">
          Audio Mixer
        </h1>
        <p class="text-[14px] text-gray-500 dark:text-gray-400">
          Slider variants styled as a music production control surface.
        </p>
      </div>

      <!-- ============================================================== -->
      <!-- Channel Strip                                                   -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Channel Strip
        </h2>
        <div class="flex flex-col gap-1">
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
      </section>

      <!-- ============================================================== -->
      <!-- Parametric EQ                                                   -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Parametric EQ
        </h2>
        <div class="flex flex-col gap-1">
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
      </section>

      <!-- ============================================================== -->
      <!-- Compressor                                                      -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Compressor
        </h2>
        <div class="flex flex-col gap-1">
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
      </section>

      <!-- ============================================================== -->
      <!-- Effects Sends (tooltip mode)                                    -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Effects Sends
        </h2>
        <div class="flex flex-col gap-1">
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
      </section>

      <!-- ============================================================== -->
      <!-- Settings — Comfortable Pips (stepper)                           -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Settings
        </h2>
        <div class="flex flex-col gap-2">
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
      </section>

      <!-- ============================================================== -->
      <!-- Master Controls — Comfortable Scrubber                          -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Master Controls
        </h2>
        <div class="flex flex-col gap-2">
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
      </section>

      <!-- ============================================================== -->
      <!-- Theme Color Mode                                                -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          Theme Color
        </h2>
        <p class="text-[13px] text-gray-500 dark:text-gray-400">
          When <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-[12px]">themeColor</code>
          is true, sliders use the primary theme color instead of neutral gray.
        </p>
        <div class="flex flex-col gap-1">
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
        <div class="flex flex-col gap-2 mt-2">
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
      </section>

      <!-- ============================================================== -->
      <!-- CDK Primitive (original demo)                                   -->
      <!-- ============================================================== -->

      <section class="flex flex-col gap-4">
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-white">
          CDK Primitive
        </h2>
        <p class="text-[13px] text-gray-500 dark:text-gray-400">
          The low-level <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-[12px]">nxpSlider</code>
          attribute directive on a native range input.
        </p>
        <input
          type="range"
          nxpSlider
          [(nxpValue)]="basicValue"
          [min]="0"
          [max]="100"
          class="slider-styled w-full"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Value: {{ basicValue() }}
        </p>
      </section>
    </div>
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

  // ---------------------------------------------------------------------------
  // Format functions (matching fluidfunctionalizm page.tsx)
  // ---------------------------------------------------------------------------

  readonly fmtPercent = (v: number) => `${v}%`;
  readonly fmtHz = (v: number) => `${v} Hz`;
  readonly fmtFreq = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)} kHz` : `${v} Hz`;
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
  readonly fmtPriority = (v: number) => ['None', 'Low', 'Medium', 'High', 'Critical'][v];
}
