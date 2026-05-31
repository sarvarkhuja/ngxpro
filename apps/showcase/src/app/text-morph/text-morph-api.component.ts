import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NxpDocApi } from '@ngxpro/addon-doc-lib/api';

/**
 * API table for the TextMorph demo. Inputs are exposed as two-way `model()`s so
 * the Playground example above reacts live — editing a row morphs the preview —
 * and every value is persisted to the URL via `nxpDocApiItem`.
 */
@Component({
  selector: 'app-text-morph-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NxpDocApi],
  template: `
    <p class="text-base text-text-secondary mb-6">
      The same surface ships two ways — the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >[nxpTextMorph]</code
      >
      directive for any element you already have, or the
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >&lt;nxp-text-morph&gt;</code
      >
      component when you want a drop-in element. Both accept the identical input
      set below. Edit a value to drive the Playground — changes are persisted to
      the URL query string.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-8 mb-2">Inputs</h2>
    <table nxpDocApi>
      <th class="w-[28%]">Name</th>
      <th class="w-[42%]">Type</th>
      <th class="w-[30%]">Value</th>

      <tr nxpDocApiItem name="[text]" type="string" [(value)]="text">
        The string to display and animate toward. Required — every change is
        diffed against the current value and morphed.
      </tr>
      <tr
        nxpDocApiItem
        type="number"
        name="[duration]"
        [min]="0"
        [max]="2000"
        [(value)]="duration"
      >
        Morph duration in milliseconds. Defaults to
        <code>400</code
        >. Applies on the next morph.
      </tr>
      <tr
        nxpDocApiItem
        name="[ease]"
        type="string"
        [items]="easings"
        [(value)]="ease"
      >
        CSS easing function driving the block movement. Try the springy
        <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code>
        for an overshoot.
      </tr>
      <tr nxpDocApiItem name="[scale]" type="boolean" [(value)]="scale">
        When
        <code>true</code
        >, entering and exiting glyphs add a subtle
        <code>scale(0.95)</code>
        so swaps feel like they pop.
      </tr>
      <tr nxpDocApiItem name="[disabled]" type="boolean" [(value)]="disabled">
        Disable animation entirely — text content updates instantly with no FLIP
        pass.
      </tr>
      <tr
        nxpDocApiItem
        name="[respectReducedMotion]"
        type="boolean"
        [(value)]="respectReducedMotion"
      >
        When
        <code>true</code>
        (default), honors the OS
        <code>prefers-reduced-motion</code>
        setting and skips the animation.
      </tr>
      <tr
        nxpDocApiItem
        name="[locale]"
        type="Intl.LocalesArgument"
        [items]="locales"
        [(value)]="locale"
      >
        Locale handed to
        <code>Intl.Segmenter</code
        >. Strings with spaces split by word; spaceless strings split by
        grapheme.
      </tr>
      <tr nxpDocApiItem name="[debug]" type="boolean" [(value)]="debug">
        Outlines the root (magenta) and each animated block (cyan) so you can
        watch the FLIP boxes.
      </tr>
    </table>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">Outputs</h2>
    <p class="text-sm text-text-secondary mb-2">
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >(animationStart)</code
      >
      fires the moment a morph begins;
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >(animationComplete)</code
      >
      fires once the container settles at its final size. Both emit
      <code>void</code> — the Playground wires them to the live "animating /
      idle" status pill.
    </p>

    <h2 class="text-xl font-semibold text-text-primary mt-10 mb-2">
      App-wide defaults
    </h2>
    <p class="text-sm text-text-secondary mb-2">
      Override the defaults for an entire injector with
      <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
        >provideTextMorphOptions(&#123; duration: 500, ease: 'ease', locale:
        'ja' &#125;)</code
      >. Per-element inputs always win over the provided defaults.
    </p>
  `,
})
export class TextMorphApiComponent {
  readonly text = model<string>('Ship');
  readonly duration = model<number>(400);
  readonly ease = model<string>('cubic-bezier(0.19, 1, 0.22, 1)');
  readonly scale = model<boolean>(true);
  readonly disabled = model<boolean>(false);
  readonly respectReducedMotion = model<boolean>(true);
  readonly locale = model<string>('en');
  readonly debug = model<boolean>(false);

  readonly easings = [
    'cubic-bezier(0.19, 1, 0.22, 1)',
    'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'cubic-bezier(0.65, 0, 0.35, 1)',
    'ease',
    'linear',
  ] as const;

  readonly locales = ['en', 'ja', 'zh', 'ar', 'th'] as const;
}
