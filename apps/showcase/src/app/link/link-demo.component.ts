import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpLinkDirective,
  type LinkSize,
  type LinkVariant,
} from '@ngxpro/cdk/components/link';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpBadge } from '@ngxpro/components/badge';
import { CardComponent } from '@ngxpro/components/card';
import { LinkApiComponent } from './link-api.component';
import { LinkProviderExampleComponent } from './link-provider-example.component';

@Component({
  selector: 'app-link-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NxpLinkDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpIconComponent,
    ...NxpBadge,
    CardComponent,
    LinkApiComponent,
    LinkProviderExampleComponent,
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

        <!-- ── Patterns gallery ─────────────────────────────────────────── -->

        <nxp-doc-example
          heading="Links with icons"
          [fullsize]="true"
          description="The directive base is inline-flex with a built-in gap, so an icon sits inline as a leading or trailing affordance — no wrapper needed. A diagonal arrow reads as external; a chevron reads as forward motion."
          [content]="{ HTML: iconLinksHtml, TypeScript: iconLinksTs }"
        >
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#" nxpLink variant="brand" [underline]="false">
              <nxp-icon icon="ri-book-2-line" size="sm" />
              Documentation
            </a>
            <a href="#" nxpLink variant="brand" [underline]="false">
              Read the guide
              <nxp-icon icon="ri-arrow-right-line" size="sm" />
            </a>
            <a href="#" nxpLink variant="default" [underline]="false">
              <nxp-icon icon="ri-github-fill" size="sm" />
              View source
            </a>
            <a href="#" nxpLink variant="muted" [underline]="false">
              Changelog
              <nxp-icon icon="ri-arrow-right-up-line" size="sm" />
            </a>
            <a href="#" nxpLink variant="brand" [underline]="false">
              <nxp-icon icon="ri-download-line" size="sm" />
              Download .zip
            </a>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Breadcrumbs"
          [fullsize]="true"
          description="Muted, small links with chevron separators. The trailing crumb is the current page — rendered as plain text so it is not actionable."
          [content]="{ HTML: breadcrumbsHtml, TypeScript: breadcrumbsTs }"
        >
          <nav aria-label="Breadcrumb">
            <ol class="flex flex-wrap items-center gap-1.5 text-xs">
              <li class="flex items-center gap-1.5">
                <a
                  href="#"
                  nxpLink
                  variant="muted"
                  size="sm"
                  [underline]="false"
                >
                  <nxp-icon icon="ri-home-line" size="xs" />
                  Home
                </a>
                <nxp-icon
                  icon="ri-arrow-right-s-line"
                  size="xs"
                  class="text-text-quaternary"
                />
              </li>
              <li class="flex items-center gap-1.5">
                <a
                  href="#"
                  nxpLink
                  variant="muted"
                  size="sm"
                  [underline]="false"
                >
                  Components
                </a>
                <nxp-icon
                  icon="ri-arrow-right-s-line"
                  size="xs"
                  class="text-text-quaternary"
                />
              </li>
              <li aria-current="page" class="font-medium text-text-primary">
                Link
              </li>
            </ol>
          </nav>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Feature card"
          [fullsize]="true"
          description="A link as the primary call-to-action inside a card. Hover the card and the trailing arrow nudges forward — the brand variant carries the accent while nxp-card supplies the shadow-as-border surface."
          [content]="{ HTML: cardHtml, TypeScript: cardTs }"
        >
          <nxp-card
            class="group max-w-sm transition-shadow duration-normal hover:shadow-card-lg"
          >
            <div class="flex items-center justify-between">
              <span
                class="flex size-9 items-center justify-center rounded-lg bg-bg-neutral-1 text-text-primary"
              >
                <nxp-icon icon="ri-flashlight-line" size="md" />
              </span>
              <span nxpBadge color="blue" size="sm">Guide</span>
            </div>
            <h3
              class="mt-4 text-base font-semibold tracking-card text-text-primary"
            >
              Deploy in seconds
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-text-secondary">
              Push to Git and ship to a global edge network. Zero configuration,
              automatic previews on every commit.
            </p>
            <a
              href="#"
              nxpLink
              variant="brand"
              [underline]="false"
              class="mt-4"
            >
              Read the guide
              <nxp-icon
                icon="ri-arrow-right-line"
                size="sm"
                class="transition-transform duration-normal group-hover:translate-x-0.5"
              />
            </a>
          </nxp-card>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Inline actions"
          [fullsize]="true"
          description="button[nxpLink] becomes a row of inline actions. The destructive action uses the danger variant; the disabled button inherits disabled:opacity-50 and pointer-events-none straight from the directive base."
          [content]="{ HTML: actionsHtml, TypeScript: actionsTs }"
        >
          <div
            class="flex w-full max-w-md items-center justify-between gap-4 rounded-lg bg-bg-base p-3 shadow-border"
          >
            <div class="flex min-w-0 items-center gap-3">
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-m bg-bg-neutral-1 text-text-secondary"
              >
                <nxp-icon icon="ri-file-text-line" size="sm" />
              </span>
              <div class="min-w-0 leading-tight">
                <p class="truncate text-sm font-medium text-text-primary">
                  requirements.pdf
                </p>
                <p class="text-xs text-text-tertiary">Edited 3 days ago</p>
              </div>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <button
                type="button"
                nxpLink
                variant="muted"
                size="sm"
                [underline]="false"
              >
                <nxp-icon icon="ri-edit-line" size="xs" />
                Edit
              </button>
              <span
                class="h-3.5 w-px bg-border-normal"
                aria-hidden="true"
              ></span>
              <button
                type="button"
                nxpLink
                variant="danger"
                size="sm"
                [underline]="false"
              >
                <nxp-icon icon="ri-delete-bin-line" size="xs" />
                Delete
              </button>
              <span
                class="h-3.5 w-px bg-border-normal"
                aria-hidden="true"
              ></span>
              <button
                type="button"
                nxpLink
                variant="muted"
                size="sm"
                [underline]="false"
                disabled
              >
                <nxp-icon icon="ri-archive-line" size="xs" />
                Archive
              </button>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Footer navigation"
          [fullsize]="true"
          [description]="footerDesc"
          [content]="{ HTML: footerHtml, TypeScript: footerTs }"
        >
          <div class="grid w-full grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            @for (col of footerColumns; track col.title) {
              <div class="flex flex-col gap-3">
                <h4
                  class="text-[11px] font-medium uppercase tracking-wider text-text-quaternary"
                >
                  {{ col.title }}
                </h4>
                <ul class="flex flex-col gap-2.5">
                  @for (item of col.links; track item) {
                    <li>
                      <a
                        href="#"
                        nxpLink
                        variant="muted"
                        size="sm"
                        [underline]="false"
                      >
                        {{ item }}
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </nxp-doc-example>
        <ng-template #footerDesc>
          Site-footer link columns at scale. The
          <code class="rounded-sm bg-bg-neutral-1 px-1 font-mono text-[0.85em]"
            >muted</code
          >
          variant recedes until hover, then settles on
          <code class="rounded-sm bg-bg-neutral-1 px-1 font-mono text-[0.85em]"
            >text-text-primary</code
          >. This description is itself a
          <a
            href="https://angular.dev/api/core/TemplateRef"
            target="_blank"
            rel="noopener"
            nxpLink
            variant="brand"
            size="sm"
            >TemplateRef</a
          >, so it carries inline code and links — not just a string.
        </ng-template>

        <nxp-doc-example
          heading="Theming a subtree"
          [fullsize]="true"
          description="nxpLinkOptionsProvider redefines the default variant and underline for an entire subtree, so links inherit a house style without per-anchor inputs. Any link can still opt back in explicitly."
          [content]="{ HTML: providerHtml, TypeScript: providerTs }"
        >
          <div class="grid w-full gap-6 sm:grid-cols-2">
            <div
              class="flex flex-col gap-3 rounded-lg bg-bg-base p-5 shadow-border"
            >
              <span
                class="text-[11px] font-medium uppercase tracking-wider text-text-quaternary"
              >
                Library default
              </span>
              <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
                <a href="#" nxpLink>Brand + underline</a>
                <a href="#" nxpLink>Another link</a>
                <a href="#" nxpLink variant="muted">Muted</a>
              </div>
            </div>
            <div
              class="flex flex-col gap-3 rounded-lg bg-bg-base p-5 shadow-border"
            >
              <span
                class="text-[11px] font-medium uppercase tracking-wider text-text-quaternary"
              >
                Provider override
              </span>
              <app-link-provider-example />
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="When to use which variant"
          [preview]="false"
          [fullsize]="true"
          description="Pick a variant by intent, not by appearance. This block is documentation-only — preview is set to false, so it renders as reference guidance with no live-demo tab."
        >
          <div
            class="grid w-full gap-px overflow-hidden rounded-lg bg-border-normal sm:grid-cols-2"
          >
            @for (g of variantGuide; track g.variant) {
              <div class="flex flex-col gap-2 bg-bg-base p-5">
                <a
                  href="#"
                  nxpLink
                  [variant]="g.variant"
                  [underline]="false"
                  class="w-fit"
                >
                  {{ g.label }}
                  <nxp-icon icon="ri-arrow-right-line" size="sm" />
                </a>
                <p class="text-sm leading-relaxed text-text-secondary">
                  {{ g.usage }}
                </p>
              </div>
            }
          </div>
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

  // ── Patterns gallery: data ─────────────────────────────────────────────────
  readonly footerColumns: ReadonlyArray<{ title: string; links: string[] }> = [
    {
      title: 'Product',
      links: ['Features', 'Integrations', 'Pricing', 'Changelog'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Guides', 'API reference', 'Status'],
    },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
  ];

  readonly variantGuide: ReadonlyArray<{
    variant: LinkVariant;
    label: string;
    usage: string;
  }> = [
    {
      variant: 'brand',
      label: 'Brand',
      usage:
        'Primary navigation and the main call-to-action in a section — the one link you most want clicked.',
    },
    {
      variant: 'default',
      label: 'Default',
      usage:
        'Neutral inline links inside body copy, where a colored link would shout.',
    },
    {
      variant: 'muted',
      label: 'Muted',
      usage:
        'Secondary and utility links — breadcrumbs, footers, metadata — that recede until hovered.',
    },
    {
      variant: 'danger',
      label: 'Danger',
      usage:
        'Destructive actions such as delete or revoke, almost always as button[nxpLink].',
    },
  ];

  // ── Patterns gallery: source snippets ──────────────────────────────────────
  readonly iconLinksHtml = `<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
  <a href="#" nxpLink variant="brand" [underline]="false">
    <nxp-icon icon="ri-book-2-line" size="sm" />
    Documentation
  </a>
  <a href="#" nxpLink variant="brand" [underline]="false">
    Read the guide
    <nxp-icon icon="ri-arrow-right-line" size="sm" />
  </a>
  <a href="#" nxpLink variant="default" [underline]="false">
    <nxp-icon icon="ri-github-fill" size="sm" />
    View source
  </a>
  <a href="#" nxpLink variant="muted" [underline]="false">
    Changelog
    <nxp-icon icon="ri-arrow-right-up-line" size="sm" />
  </a>
  <a href="#" nxpLink variant="brand" [underline]="false">
    <nxp-icon icon="ri-download-line" size="sm" />
    Download .zip
  </a>
</div>`;

  readonly iconLinksTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-icon-links',
  imports: [NxpLinkDirective, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-links.html',
})
export class IconLinksExample {}`;

  readonly breadcrumbsHtml = `<nav aria-label="Breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5 text-xs">
    <li class="flex items-center gap-1.5">
      <a href="#" nxpLink variant="muted" size="sm" [underline]="false">
        <nxp-icon icon="ri-home-line" size="xs" />
        Home
      </a>
      <nxp-icon icon="ri-arrow-right-s-line" size="xs" class="text-text-quaternary" />
    </li>
    <li class="flex items-center gap-1.5">
      <a href="#" nxpLink variant="muted" size="sm" [underline]="false">Components</a>
      <nxp-icon icon="ri-arrow-right-s-line" size="xs" class="text-text-quaternary" />
    </li>
    <li aria-current="page" class="font-medium text-text-primary">Link</li>
  </ol>
</nav>`;

  readonly breadcrumbsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-breadcrumbs',
  imports: [NxpLinkDirective, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumbs.html',
})
export class BreadcrumbsExample {}`;

  readonly cardHtml = `<nxp-card
  class="group max-w-sm transition-shadow duration-normal hover:shadow-card-lg"
>
  <div class="flex items-center justify-between">
    <span class="flex size-9 items-center justify-center rounded-lg bg-bg-neutral-1 text-text-primary">
      <nxp-icon icon="ri-flashlight-line" size="md" />
    </span>
    <span nxpBadge color="blue" size="sm">Guide</span>
  </div>
  <h3 class="mt-4 text-base font-semibold tracking-card text-text-primary">
    Deploy in seconds
  </h3>
  <p class="mt-1 text-sm leading-relaxed text-text-secondary">
    Push to Git and ship to a global edge network. Zero configuration,
    automatic previews on every commit.
  </p>
  <a href="#" nxpLink variant="brand" [underline]="false" class="mt-4">
    Read the guide
    <nxp-icon
      icon="ri-arrow-right-line"
      size="sm"
      class="transition-transform duration-normal group-hover:translate-x-0.5"
    />
  </a>
</nxp-card>`;

  readonly cardTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { CardComponent } from '@ngxpro/components/card';
import { NxpBadge } from '@ngxpro/components/badge';

@Component({
  selector: 'app-feature-card',
  imports: [NxpLinkDirective, NxpIconComponent, CardComponent, ...NxpBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-card.html',
})
export class FeatureCardExample {}`;

  readonly actionsHtml = `<div class="flex w-full max-w-md items-center justify-between gap-4 rounded-lg bg-bg-base p-3 shadow-border">
  <div class="flex min-w-0 items-center gap-3">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-m bg-bg-neutral-1 text-text-secondary">
      <nxp-icon icon="ri-file-text-line" size="sm" />
    </span>
    <div class="min-w-0 leading-tight">
      <p class="truncate text-sm font-medium text-text-primary">requirements.pdf</p>
      <p class="text-xs text-text-tertiary">Edited 3 days ago</p>
    </div>
  </div>
  <div class="flex shrink-0 items-center gap-2">
    <button type="button" nxpLink variant="muted" size="sm" [underline]="false">
      <nxp-icon icon="ri-edit-line" size="xs" />
      Edit
    </button>
    <span class="h-3.5 w-px bg-border-normal" aria-hidden="true"></span>
    <button type="button" nxpLink variant="danger" size="sm" [underline]="false">
      <nxp-icon icon="ri-delete-bin-line" size="xs" />
      Delete
    </button>
    <span class="h-3.5 w-px bg-border-normal" aria-hidden="true"></span>
    <button type="button" nxpLink variant="muted" size="sm" [underline]="false" disabled>
      <nxp-icon icon="ri-archive-line" size="xs" />
      Archive
    </button>
  </div>
</div>`;

  readonly actionsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-inline-actions',
  imports: [NxpLinkDirective, NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline-actions.html',
})
export class InlineActionsExample {}`;

  readonly footerHtml = `<div class="grid w-full grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
  @for (col of footerColumns; track col.title) {
    <div class="flex flex-col gap-3">
      <h4 class="text-[11px] font-medium uppercase tracking-wider text-text-quaternary">
        {{ col.title }}
      </h4>
      <ul class="flex flex-col gap-2.5">
        @for (item of col.links; track item) {
          <li>
            <a href="#" nxpLink variant="muted" size="sm" [underline]="false">{{ item }}</a>
          </li>
        }
      </ul>
    </div>
  }
</div>`;

  readonly footerTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpLinkDirective } from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-footer-nav',
  imports: [NxpLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer-nav.html',
})
export class FooterNavExample {
  readonly footerColumns = [
    { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
    { title: 'Resources', links: ['Documentation', 'Guides', 'API reference', 'Status'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
  ];
}`;

  readonly providerHtml = `<!-- link-provider-example.html -->
<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
  <a href="#" nxpLink>Inherits default</a>
  <a href="#" nxpLink>No underline</a>
  <a href="#" nxpLink variant="brand">Opt back into brand</a>
</div>`;

  readonly providerTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpLinkDirective,
  nxpLinkOptionsProvider,
} from '@ngxpro/cdk/components/link';

@Component({
  selector: 'app-link-provider-example',
  imports: [NxpLinkDirective],
  // Cascade a house style to every nxpLink in this subtree:
  providers: [nxpLinkOptionsProvider({ variant: 'default', underline: false })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './link-provider-example.html',
})
export class LinkProviderExample {}`;
}
