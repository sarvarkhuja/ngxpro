import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpLinkDirective,
  type LinkSize,
  type LinkVariant,
} from '@ngxpro/cdk/components/link';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { LinkApiComponent } from './link-api.component';

@Component({
  selector: 'app-link-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NxpLinkDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    LinkApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Link"
      package="cdk"
      type="directive"
      path="cdk/link"
    >
      <p class="text-base text-text-secondary mb-6">
        Link directive for
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;a&gt;</code
        >
        and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;button&gt;</code
        >
        elements. Four color variants, three size variants, optional underline,
        and defaults overridable via
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpLinkOptionsProvider</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live preview bound to the API table below. Tweak variant, size, or underline and watch the link update — the same controls drive deep-linked URL state."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <a
            href="#"
            nxpLink
            [variant]="variant()"
            [size]="size()"
            [underline]="underline()"
          >
            Configurable link
          </a>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Variants"
          description="Four color variants cover the most common link intents — neutral, muted secondary, brand action, and destructive."
          [content]="{ HTML: variantsHtml, TypeScript: variantsTs }"
        >
          <div class="flex flex-wrap items-center gap-4">
            @for (v of variants; track v) {
              <a href="#" nxpLink [variant]="v">{{ v }}</a>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description="Three text sizes map to xs / sm / base so links nest cleanly inside surrounding typography."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex flex-wrap items-center gap-4">
            @for (s of sizes; track s) {
              <a href="#" nxpLink [size]="s">Link {{ s }}</a>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Underline"
          description="Underline decoration is opt-in via [underline]. The default comes from NXP_LINK_OPTIONS and can be overridden at the provider level."
          [content]="{ HTML: underlineHtml, TypeScript: underlineTs }"
        >
          <div class="flex flex-wrap items-center gap-4">
            <a href="#" nxpLink [underline]="true">Underlined link</a>
            <a href="#" nxpLink [underline]="false">No underline</a>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="As anchor and button"
          description="The selector matches both a[nxpLink] and button[nxpLink], so the same directive styles plain anchors, RouterLink anchors, and buttons used as inline actions."
          [content]="{ HTML: elementsHtml, TypeScript: elementsTs }"
        >
          <div class="flex flex-wrap items-center gap-4">
            <a href="/" nxpLink variant="brand">Anchor link</a>
            <a routerLink="/" nxpLink variant="muted">Router link</a>
            <button type="button" nxpLink variant="danger">
              Button as link
            </button>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Inline in text"
          description="Links inherit line-height from the surrounding paragraph, so they sit naturally inside body copy when underline is enabled."
          [content]="{ HTML: inlineHtml, TypeScript: inlineTs }"
        >
          <p class="text-gray-700 dark:text-gray-300">
            This is a paragraph with an
            <a href="#" nxpLink variant="brand" [underline]="true"
              >inline link</a
            >
            and another
            <a href="#" nxpLink variant="muted" [underline]="true"
              >muted link</a
            >
            for comparison.
          </p>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-link-api
          [(variant)]="variant"
          [(size)]="size"
          [(underline)]="underline"
        />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class LinkDemoComponent {
  // ── Playground state shared with the API tab via two-way [(model)] ─────────
  readonly variant = signal<LinkVariant>('brand');
  readonly size = signal<LinkSize>('md');
  readonly underline = signal<boolean>(true);

  // ── Static option arrays driving the gallery sections ──────────────────────
  readonly variants: LinkVariant[] = ['default', 'muted', 'brand', 'danger'];
  readonly sizes: LinkSize[] = ['sm', 'md', 'lg'];

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<a
  href="#"
  nxpLink
  [variant]="variant()"
  [size]="size()"
  [underline]="underline()"
>
  Configurable link
</a>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NxpLinkDirective,
  type LinkSize,
  type LinkVariant,
} from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-playground',
  imports: [NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundLinkExample {
  readonly variant = signal<LinkVariant>('brand');
  readonly size = signal<LinkSize>('md');
  readonly underline = signal<boolean>(true);
}`;

  readonly variantsHtml = `<div class="flex flex-wrap items-center gap-4">
  @for (v of variants; track v) {
    <a href="#" nxpLink [variant]="v">{{ v }}</a>
  }
</div>`;

  readonly variantsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective, type LinkVariant } from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-variants',
  imports: [NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './variants.html',
})
export class VariantsLinkExample {
  readonly variants: LinkVariant[] = ['default', 'muted', 'brand', 'danger'];
}`;

  readonly sizesHtml = `<div class="flex flex-wrap items-center gap-4">
  @for (s of sizes; track s) {
    <a href="#" nxpLink [size]="s">Link {{ s }}</a>
  }
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective, type LinkSize } from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-sizes',
  imports: [NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesLinkExample {
  readonly sizes: LinkSize[] = ['sm', 'md', 'lg'];
}`;

  readonly underlineHtml = `<div class="flex flex-wrap items-center gap-4">
  <a href="#" nxpLink [underline]="true">Underlined link</a>
  <a href="#" nxpLink [underline]="false">No underline</a>
</div>`;

  readonly underlineTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-underline',
  imports: [NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './underline.html',
})
export class UnderlineLinkExample {}`;

  readonly elementsHtml = `<div class="flex flex-wrap items-center gap-4">
  <a href="/" nxpLink variant="brand">Anchor link</a>
  <a routerLink="/" nxpLink variant="muted">Router link</a>
  <button type="button" nxpLink variant="danger">Button as link</button>
</div>`;

  readonly elementsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-elements',
  imports: [RouterModule, NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './elements.html',
})
export class ElementsLinkExample {}`;

  readonly inlineHtml = `<p class="text-gray-700 dark:text-gray-300">
  This is a paragraph with an
  <a href="#" nxpLink variant="brand" [underline]="true">inline link</a>
  and another
  <a href="#" nxpLink variant="muted" [underline]="true">muted link</a>
  for comparison.
</p>`;

  readonly inlineTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-inline',
  imports: [NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline.html',
})
export class InlineLinkExample {}`;
}
