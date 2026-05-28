import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { IconApiComponent } from './icon-api.component';

/** Remix Icon class names used in this demo (webfont: ensure remixicon.css is loaded). */
const REMIX_ICON_NAMES = [
  'ri-home-line',
  'ri-search-line',
  'ri-user-line',
  'ri-settings-line',
  'ri-heart-line',
  'ri-star-line',
  'ri-close-line',
  'ri-check-line',
  'ri-arrow-right-line',
  'ri-menu-line',
] as const;

@Component({
  selector: 'app-icon-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconApiComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    NxpIconComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Icon"
      package="cdk"
      type="component"
      path="cdk/icon"
    >
      <p class="text-base text-text-secondary mb-6">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-icon</code
        >
        — Remix Icons rendered as inline SVG (or webfont) with full Tailwind
        theming support. Pass a
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ri-*-line</code
        >
        /
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >ri-*-fill</code
        >
        class, a name resolvable by
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NXP_ICON_RESOLVER</code
        >, or a raw
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >&lt;svg&gt;</code
        >
        string.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Playground"
          description="Live preview driven by the API tab — edit the icon name, size, or class to see the changes here."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div
            class="flex items-center justify-center min-h-32 px-6 py-8 rounded-xl bg-gray-50 dark:bg-gray-800/50"
          >
            <nxp-icon [icon]="icon()" [size]="size()" [class]="iconClass()" />
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Icon Set"
          description="Remix Icon webfont classes — no registry; use any ri-*-line / ri-*-fill class from remixicon.com."
          [content]="{ HTML: iconSetHtml, TypeScript: iconSetTs }"
        >
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full"
          >
            @for (name of iconNames; track name) {
              <div
                class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <nxp-icon
                  [icon]="name"
                  size="lg"
                  class="text-gray-700 dark:text-gray-200"
                />
                <span
                  class="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight font-mono"
                  >{{ name }}</span
                >
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Sizes"
          description='Six size variants controlled by the "size" input.'
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
          <div class="flex flex-wrap items-end gap-8">
            <div class="flex flex-col items-center gap-2">
              <nxp-icon
                icon="ri-home-line"
                size="xs"
                class="text-gray-700 dark:text-gray-200"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                >xs</span
              >
              <span class="text-xs text-gray-400 dark:text-gray-500">12px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <nxp-icon
                icon="ri-home-line"
                size="sm"
                class="text-gray-700 dark:text-gray-200"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                >sm</span
              >
              <span class="text-xs text-gray-400 dark:text-gray-500">16px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <nxp-icon
                icon="ri-home-line"
                size="md"
                class="text-gray-700 dark:text-gray-200"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                >md</span
              >
              <span class="text-xs text-gray-400 dark:text-gray-500">20px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <nxp-icon
                icon="ri-home-line"
                size="lg"
                class="text-gray-700 dark:text-gray-200"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                >lg</span
              >
              <span class="text-xs text-gray-400 dark:text-gray-500">24px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <nxp-icon
                icon="ri-home-line"
                size="xl"
                class="text-gray-700 dark:text-gray-200"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                >xl</span
              >
              <span class="text-xs text-gray-400 dark:text-gray-500">32px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <nxp-icon
                icon="ri-home-line"
                size="2xl"
                class="text-gray-700 dark:text-gray-200"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                >2xl</span
              >
              <span class="text-xs text-gray-400 dark:text-gray-500">40px</span>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Colors"
          description='Icons inherit "currentColor" — style with any Tailwind text color.'
          [content]="{ HTML: colorsHtml, TypeScript: colorsTs }"
        >
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
          >
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30"
            >
              <nxp-icon
                icon="ri-search-line"
                size="lg"
                class="text-blue-500 dark:text-blue-400"
              />
              <span class="text-xs font-medium text-blue-600 dark:text-blue-400"
                >blue-500</span
              >
            </div>
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-950/30"
            >
              <nxp-icon
                icon="ri-check-line"
                size="lg"
                class="text-green-500 dark:text-green-400"
              />
              <span
                class="text-xs font-medium text-green-600 dark:text-green-400"
                >green-500</span
              >
            </div>
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30"
            >
              <nxp-icon
                icon="ri-close-line"
                size="lg"
                class="text-red-500 dark:text-red-400"
              />
              <span class="text-xs font-medium text-red-600 dark:text-red-400"
                >red-500</span
              >
            </div>
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30"
            >
              <nxp-icon
                icon="ri-star-line"
                size="lg"
                class="text-yellow-500 dark:text-yellow-400"
              />
              <span
                class="text-xs font-medium text-yellow-600 dark:text-yellow-400"
                >yellow-500</span
              >
            </div>
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30"
            >
              <nxp-icon
                icon="ri-heart-line"
                size="lg"
                class="text-purple-500 dark:text-purple-400"
              />
              <span
                class="text-xs font-medium text-purple-600 dark:text-purple-400"
                >purple-500</span
              >
            </div>
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-700/50"
            >
              <nxp-icon
                icon="ri-menu-line"
                size="lg"
                class="text-gray-500 dark:text-gray-300"
              />
              <span class="text-xs font-medium text-gray-600 dark:text-gray-300"
                >gray-500</span
              >
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Dark Mode"
          description='Icons adapt automatically via "dark:" Tailwind variants.'
          [content]="{ HTML: darkModeHtml, TypeScript: darkModeTs }"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <!-- Light panel -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <p
                class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4"
              >
                Light Mode
              </p>
              <div class="flex items-center gap-4">
                <nxp-icon icon="ri-user-line" size="xl" class="text-gray-800" />
                <nxp-icon
                  icon="ri-settings-line"
                  size="xl"
                  class="text-gray-600"
                />
                <nxp-icon
                  icon="ri-search-line"
                  size="xl"
                  class="text-blue-600"
                />
                <nxp-icon icon="ri-heart-line" size="xl" class="text-red-500" />
                <nxp-icon
                  icon="ri-star-line"
                  size="xl"
                  class="text-yellow-500"
                />
              </div>
            </div>

            <!-- Dark panel -->
            <div class="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <p
                class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4"
              >
                Dark Mode
              </p>
              <div class="flex items-center gap-4">
                <nxp-icon icon="ri-user-line" size="xl" class="text-gray-100" />
                <nxp-icon
                  icon="ri-settings-line"
                  size="xl"
                  class="text-gray-300"
                />
                <nxp-icon
                  icon="ri-search-line"
                  size="xl"
                  class="text-blue-400"
                />
                <nxp-icon icon="ri-heart-line" size="xl" class="text-red-400" />
                <nxp-icon
                  icon="ri-star-line"
                  size="xl"
                  class="text-yellow-400"
                />
              </div>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Usage in Context"
          description="Icons alongside text and interactive elements."
          [content]="{ HTML: contextHtml, TypeScript: contextTs }"
        >
          <div class="space-y-4 w-full">
            <!-- Nav links -->
            <div class="flex flex-wrap gap-2">
              @for (link of navLinks; track link.icon) {
                <a
                  href="#"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <nxp-icon [icon]="link.icon" size="sm" />
                  {{ link.label }}
                </a>
              }
            </div>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                <nxp-icon icon="ri-check-line" size="xs" />
                Success
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              >
                <nxp-icon icon="ri-close-line" size="xs" />
                Error
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                <nxp-icon icon="ri-search-line" size="xs" />
                Searching
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              >
                <nxp-icon icon="ri-star-line" size="xs" />
                Featured
              </span>
            </div>

            <!-- List items -->
            <ul
              class="mt-4 divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              @for (item of listItems; track item.label) {
                <li
                  class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <nxp-icon
                      [icon]="item.icon"
                      size="md"
                      [class]="item.color"
                    />
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >{{ item.label }}</span
                    >
                  </div>
                  <nxp-icon
                    icon="ri-arrow-right-line"
                    size="sm"
                    class="text-gray-400 dark:text-gray-500"
                  />
                </li>
              }
            </ul>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Raw SVG Bypass"
          description='Pass a raw SVG string directly — no registry needed. Detected by the leading "<svg" tag.'
          [content]="{ HTML: rawSvgHtml, TypeScript: rawSvgTs }"
        >
          <div class="flex items-center gap-6">
            <nxp-icon
              [icon]="rawSvg"
              size="xl"
              class="text-indigo-500 dark:text-indigo-400"
            />
            <nxp-icon
              [icon]="rawSvg"
              size="xl"
              class="text-pink-500 dark:text-pink-400"
            />
            <nxp-icon
              [icon]="rawSvg"
              size="xl"
              class="text-teal-500 dark:text-teal-400"
            />
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >Custom SVG, no registration required</span
            >
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-icon-api [(icon)]="icon" [(size)]="size" [(class)]="iconClass" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class IconDemoComponent {
  // ── Playground state shared with the API tab ───────────────────────────────
  readonly icon = signal<string>('ri-home-line');
  readonly size = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | undefined>(
    'lg',
  );
  readonly iconClass = signal<string>('text-gray-700 dark:text-gray-200');

  // ── Demo data ──────────────────────────────────────────────────────────────
  readonly iconNames = [...REMIX_ICON_NAMES];

  readonly navLinks = [
    { icon: 'ri-home-line', label: 'Home' },
    { icon: 'ri-user-line', label: 'Profile' },
    { icon: 'ri-settings-line', label: 'Settings' },
    { icon: 'ri-search-line', label: 'Search' },
    { icon: 'ri-menu-line', label: 'Menu' },
  ];

  readonly listItems = [
    {
      icon: 'ri-home-line',
      label: 'Dashboard',
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      icon: 'ri-user-line',
      label: 'Profile',
      color: 'text-purple-500 dark:text-purple-400',
    },
    {
      icon: 'ri-heart-line',
      label: 'Favourites',
      color: 'text-red-500 dark:text-red-400',
    },
    {
      icon: 'ri-star-line',
      label: 'Starred',
      color: 'text-yellow-500 dark:text-yellow-400',
    },
    {
      icon: 'ri-settings-line',
      label: 'Settings',
      color: 'text-gray-500 dark:text-gray-400',
    },
  ];

  // Raw SVG example — a simple diamond shape
  readonly rawSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 10-10 10L2 12z"/></svg>';

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly playgroundHtml = `<nxp-icon [icon]="icon()" [size]="size()" [class]="iconClass()" />`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-playground',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundIconExample {
  readonly icon = signal<string>('ri-home-line');
  readonly size = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | undefined>('lg');
  readonly iconClass = signal<string>('text-gray-700 dark:text-gray-200');
}`;

  readonly iconSetHtml = `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
  @for (name of iconNames; track name) {
    <div class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <nxp-icon [icon]="name" size="lg" class="text-gray-700 dark:text-gray-200" />
      <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ name }}</span>
    </div>
  }
</div>`;

  readonly iconSetTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

const REMIX_ICON_NAMES = [
  'ri-home-line',
  'ri-search-line',
  'ri-user-line',
  'ri-settings-line',
  'ri-heart-line',
  'ri-star-line',
  'ri-close-line',
  'ri-check-line',
  'ri-arrow-right-line',
  'ri-menu-line',
] as const;

@Component({
  selector: 'app-icon-set',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-set.html',
})
export class IconSetExample {
  readonly iconNames = [...REMIX_ICON_NAMES];
}`;

  readonly sizesHtml = `<div class="flex flex-wrap items-end gap-8">
  <nxp-icon icon="ri-home-line" size="xs" />
  <nxp-icon icon="ri-home-line" size="sm" />
  <nxp-icon icon="ri-home-line" size="md" />
  <nxp-icon icon="ri-home-line" size="lg" />
  <nxp-icon icon="ri-home-line" size="xl" />
  <nxp-icon icon="ri-home-line" size="2xl" />
</div>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-sizes',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizesIconExample {}`;

  readonly colorsHtml = `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
  <nxp-icon icon="ri-search-line" size="lg" class="text-blue-500" />
  <nxp-icon icon="ri-check-line" size="lg" class="text-green-500" />
  <nxp-icon icon="ri-close-line" size="lg" class="text-red-500" />
  <nxp-icon icon="ri-star-line" size="lg" class="text-yellow-500" />
  <nxp-icon icon="ri-heart-line" size="lg" class="text-purple-500" />
  <nxp-icon icon="ri-menu-line" size="lg" class="text-gray-500" />
</div>`;

  readonly colorsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-colors',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './colors.html',
})
export class ColorsIconExample {}`;

  readonly darkModeHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div class="bg-white border border-gray-200 rounded-xl p-6">
    <nxp-icon icon="ri-user-line" size="xl" class="text-gray-800" />
    <nxp-icon icon="ri-settings-line" size="xl" class="text-gray-600" />
    <nxp-icon icon="ri-search-line" size="xl" class="text-blue-600" />
  </div>
  <div class="bg-gray-900 border border-gray-700 rounded-xl p-6">
    <nxp-icon icon="ri-user-line" size="xl" class="text-gray-100" />
    <nxp-icon icon="ri-settings-line" size="xl" class="text-gray-300" />
    <nxp-icon icon="ri-search-line" size="xl" class="text-blue-400" />
  </div>
</div>`;

  readonly darkModeTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-dark-mode',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dark-mode.html',
})
export class DarkModeIconExample {}`;

  readonly contextHtml = `<!-- Nav links -->
<div class="flex flex-wrap gap-2">
  @for (link of navLinks; track link.icon) {
    <a href="#" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
      <nxp-icon [icon]="link.icon" size="sm" />
      {{ link.label }}
    </a>
  }
</div>

<!-- Status badges -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
  <nxp-icon icon="ri-check-line" size="xs" />
  Success
</span>

<!-- List items -->
<ul class="mt-4 divide-y divide-gray-100 border border-gray-200 rounded-xl">
  @for (item of listItems; track item.label) {
    <li class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <nxp-icon [icon]="item.icon" size="md" [class]="item.color" />
        <span class="text-sm font-medium">{{ item.label }}</span>
      </div>
      <nxp-icon icon="ri-arrow-right-line" size="sm" class="text-gray-400" />
    </li>
  }
</ul>`;

  readonly contextTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-usage-in-context',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usage-in-context.html',
})
export class UsageInContextIconExample {
  readonly navLinks = [
    { icon: 'ri-home-line', label: 'Home' },
    { icon: 'ri-user-line', label: 'Profile' },
    { icon: 'ri-settings-line', label: 'Settings' },
  ];

  readonly listItems = [
    { icon: 'ri-home-line', label: 'Dashboard', color: 'text-blue-500' },
    { icon: 'ri-user-line', label: 'Profile', color: 'text-purple-500' },
    { icon: 'ri-heart-line', label: 'Favourites', color: 'text-red-500' },
  ];
}`;

  readonly rawSvgHtml = `<nxp-icon [icon]="rawSvg" size="xl" class="text-indigo-500" />
<nxp-icon [icon]="rawSvg" size="xl" class="text-pink-500" />
<nxp-icon [icon]="rawSvg" size="xl" class="text-teal-500" />`;

  readonly rawSvgTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';

@Component({
  selector: 'app-raw-svg',
  imports: [NxpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './raw-svg.html',
})
export class RawSvgIconExample {
  // Diamond shape — detected as raw SVG by the leading '<' character.
  readonly rawSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 10-10 10L2 12z"/></svg>';
}`;
}
