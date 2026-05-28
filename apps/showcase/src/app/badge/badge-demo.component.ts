import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  NxpBadgeComponent,
  NxpBadgeDirective,
  NXP_BADGE_COLORS,
  type NxpBadgeColor,
  type NxpBadgeSize,
  type NxpBadgeVariant,
} from '@ngxpro/components/badge';
import { BadgeApiComponent } from './badge-api.component';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeApiComponent,
    NxpBadgeComponent,
    NxpBadgeDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Badge"
      package="components"
      type="component"
      path="components/badge"
    >
      <p class="text-base text-text-secondary mb-6">
        Compact pill label for status, category, or metadata. Supports
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >solid</code
        >
        and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >dot</code
        >
        variants with the full Tailwind color palette. Available as the
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-badge</code
        >
        component or the
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >[nxpBadge]</code
        >
        directive for inline use.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Edit the API table below to drive this live preview — variant, size, color, and class all flow into the badge."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <nxp-badge
            [variant]="variant()"
            [size]="size()"
            [color]="color()"
            [class]="class()"
          >
            Playground
          </nxp-badge>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Solid"
          description="Default variant with a tinted color background."
          [content]="{ HTML: solidHtml, TypeScript: solidTs }"
        >
          <div class="flex flex-wrap items-center gap-2">
            @for (c of sampleColors; track c) {
              <nxp-badge [color]="c">{{ sampleLabels[c] }}</nxp-badge>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Dot"
          description="Border style with a colored dot indicator on the leading edge."
          [content]="{ HTML: dotHtml, TypeScript: dotTs }"
        >
          <div class="flex flex-wrap items-center gap-2">
            @for (c of sampleColors; track c) {
              <nxp-badge variant="dot" [color]="c">{{
                sampleLabels[c]
              }}</nxp-badge>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Three sizes — sm, md, lg — controlling height, padding, font size, and dot diameter."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex flex-wrap items-center gap-2">
            @for (s of sizes; track s) {
              <nxp-badge [size]="s" color="blue">{{ capitalize(s) }}</nxp-badge>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Colors"
          description="All 17 Tailwind palette colors, rendered in both the solid and dot variants."
          [content]="{ HTML: colorsHtml, TypeScript: colorsTs }"
        >
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-2">
              @for (c of allColors; track c) {
                <nxp-badge [color]="c">{{ capitalize(c) }}</nxp-badge>
              }
            </div>
            <div class="flex flex-wrap items-center gap-2">
              @for (c of allColors; track c) {
                <nxp-badge variant="dot" [color]="c">{{
                  capitalize(c)
                }}</nxp-badge>
              }
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Directive usage"
          description="Apply the [nxpBadge] directive to any inline element when you don't want the extra nxp-badge host element."
          [content]="{ HTML: directiveHtml, TypeScript: directiveTs }"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span nxpBadge color="green" size="sm">Active</span>
            <span nxpBadge color="red" size="md">Error</span>
            <span nxpBadge color="indigo" size="lg">Premium</span>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Inline in text"
          description="Badges placed inline with surrounding text content — use mx-1 to balance horizontal spacing."
          [content]="{ HTML: inlineHtml, TypeScript: inlineTs }"
        >
          <p class="text-gray-700 dark:text-gray-300 leading-loose">
            This feature is
            <nxp-badge variant="dot" color="amber" size="sm" class="mx-1"
              >Beta</nxp-badge
            >
            and will be generally available soon. Check the
            <nxp-badge color="violet" size="sm" class="mx-1">New</nxp-badge>
            updates in the changelog, or track
            <nxp-badge variant="dot" color="green" size="sm" class="mx-1"
              >Live</nxp-badge
            >
            status on the status page.
          </p>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-badge-api
          [(variant)]="variant"
          [(size)]="size"
          [(color)]="color"
          [(class)]="class"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class BadgeDemoComponent {
  // ── Playground state shared with the API tab via model() bindings ──────────
  readonly variant = signal<NxpBadgeVariant>('solid');
  readonly size = signal<NxpBadgeSize>('md');
  readonly color = signal<NxpBadgeColor>('gray');
  readonly class = signal<string>('');

  // ── Demo data (preserved from prior demo) ──────────────────────────────────
  readonly allColors = Object.keys(NXP_BADGE_COLORS) as NxpBadgeColor[];

  readonly sizes: NxpBadgeSize[] = ['sm', 'md', 'lg'];

  readonly sampleColors: NxpBadgeColor[] = [
    'violet',
    'amber',
    'green',
    'blue',
    'rose',
  ];

  readonly sampleLabels: Record<string, string> = {
    violet: 'Fiction',
    amber: 'Science',
    green: 'Philosophy',
    blue: 'History',
    rose: 'Poetry',
  };

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-badge
  [variant]="variant()"
  [size]="size()"
  [color]="color()"
  [class]="class()"
>
  Playground
</nxp-badge>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
  type NxpBadgeSize,
  type NxpBadgeVariant,
} from '@ngxpro/components/badge';

@Component({
  selector: 'app-playground',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundBadgeExample {
  readonly variant = signal<NxpBadgeVariant>('solid');
  readonly size = signal<NxpBadgeSize>('md');
  readonly color = signal<NxpBadgeColor>('gray');
  readonly class = signal<string>('');
}`;

  readonly solidHtml = `<div class="flex flex-wrap items-center gap-2">
  @for (c of sampleColors; track c) {
    <nxp-badge [color]="c">{{ sampleLabels[c] }}</nxp-badge>
  }
</div>`;

  readonly solidTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';

@Component({
  selector: 'app-solid',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solid.html',
})
export class SolidBadgeExample {
  readonly sampleColors: NxpBadgeColor[] = [
    'violet',
    'amber',
    'green',
    'blue',
    'rose',
  ];

  readonly sampleLabels: Record<string, string> = {
    violet: 'Fiction',
    amber: 'Science',
    green: 'Philosophy',
    blue: 'History',
    rose: 'Poetry',
  };
}`;

  readonly dotHtml = `<div class="flex flex-wrap items-center gap-2">
  @for (c of sampleColors; track c) {
    <nxp-badge variant="dot" [color]="c">{{ sampleLabels[c] }}</nxp-badge>
  }
</div>`;

  readonly dotTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';

@Component({
  selector: 'app-dot',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dot.html',
})
export class DotBadgeExample {
  readonly sampleColors: NxpBadgeColor[] = [
    'violet',
    'amber',
    'green',
    'blue',
    'rose',
  ];

  readonly sampleLabels: Record<string, string> = {
    violet: 'Fiction',
    amber: 'Science',
    green: 'Philosophy',
    blue: 'History',
    rose: 'Poetry',
  };
}`;

  readonly sizesHtml = `<div class="flex flex-wrap items-center gap-2">
  @for (s of sizes; track s) {
    <nxp-badge [size]="s" color="blue">{{ capitalize(s) }}</nxp-badge>
  }
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeSize,
} from '@ngxpro/components/badge';

@Component({
  selector: 'app-sizes',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesBadgeExample {
  readonly sizes: NxpBadgeSize[] = ['sm', 'md', 'lg'];

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}`;

  readonly colorsHtml = `<div class="flex flex-col gap-3">
  <div class="flex flex-wrap items-center gap-2">
    @for (c of allColors; track c) {
      <nxp-badge [color]="c">{{ capitalize(c) }}</nxp-badge>
    }
  </div>
  <div class="flex flex-wrap items-center gap-2">
    @for (c of allColors; track c) {
      <nxp-badge variant="dot" [color]="c">{{ capitalize(c) }}</nxp-badge>
    }
  </div>
</div>`;

  readonly colorsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  NXP_BADGE_COLORS,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';

@Component({
  selector: 'app-colors',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './colors.html',
})
export class ColorsBadgeExample {
  readonly allColors = Object.keys(NXP_BADGE_COLORS) as NxpBadgeColor[];

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}`;

  readonly directiveHtml = `<div class="flex flex-wrap items-center gap-2">
  <span nxpBadge color="green" size="sm">Active</span>
  <span nxpBadge color="red" size="md">Error</span>
  <span nxpBadge color="indigo" size="lg">Premium</span>
</div>`;

  readonly directiveTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpBadgeDirective } from '@ngxpro/components/badge';

@Component({
  selector: 'app-directive',
  imports: [NxpBadgeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './directive.html',
})
export class DirectiveBadgeExample {}`;

  readonly inlineHtml = `<p class="text-gray-700 dark:text-gray-300 leading-loose">
  This feature is
  <nxp-badge variant="dot" color="amber" size="sm" class="mx-1">Beta</nxp-badge>
  and will be generally available soon. Check the
  <nxp-badge color="violet" size="sm" class="mx-1">New</nxp-badge>
  updates in the changelog, or track
  <nxp-badge variant="dot" color="green" size="sm" class="mx-1">Live</nxp-badge>
  status on the status page.
</p>`;

  readonly inlineTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpBadgeComponent } from '@ngxpro/components/badge';

@Component({
  selector: 'app-inline',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline.html',
})
export class InlineBadgeExample {}`;
}
