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
        <nxp-doc-example
          heading="Deployment activity"
          description="A Vercel-style deployment feed — dot badges signal live pipeline status (Ready, Building, Error, Queued) across the Develop → Preview → Ship workflow, paired with Geist Mono branch and commit metadata."
          [fullsize]="true"
          [content]="{ HTML: deploymentsHtml, TypeScript: deploymentsTs }"
        >
          <div
            class="mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-bg-base shadow-card"
          >
            <div
              class="flex items-center justify-between border-b border-bg-neutral-2 px-5 py-3.5"
            >
              <div class="flex items-center gap-2.5">
                <span
                  class="text-[13px] font-semibold tracking-card text-text-primary"
                  >Deployments</span
                >
                <nxp-badge variant="dot" color="green" size="sm"
                  >Live</nxp-badge
                >
              </div>
              <span class="font-mono text-[11px] text-text-tertiary"
                >acme-web</span
              >
            </div>
            <div class="divide-y divide-bg-neutral-2">
              @for (d of deployments; track d.hash) {
                <div
                  class="flex items-center gap-4 px-5 py-3.5 transition-colors duration-normal hover:bg-bg-neutral-1"
                >
                  <div class="w-[104px] shrink-0">
                    <nxp-badge variant="dot" [color]="d.color" size="sm">{{
                      d.status
                    }}</nxp-badge>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="truncate text-[13px] font-medium text-text-primary"
                    >
                      {{ d.message }}
                    </p>
                    <p
                      class="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-text-tertiary"
                    >
                      <span>{{ d.branch }}</span>
                      <span class="text-text-quaternary">·</span>
                      <span>{{ d.hash }}</span>
                    </p>
                  </div>
                  <span
                    class="hidden shrink-0 font-mono text-[10px] uppercase tracking-wide text-text-quaternary sm:inline"
                    >{{ d.env }}</span
                  >
                  <span
                    class="w-10 shrink-0 text-right font-mono text-[11px] text-text-quaternary"
                    >{{ d.time }}</span
                  >
                </div>
              }
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Status table"
          description="The classic home for a badge — a status column. Solid badges map payment states to semantic colors (Paid, Pending, Overdue, Refunded) while a dot badge marks an unsent Draft."
          [fullsize]="true"
          [content]="{ HTML: tableHtml, TypeScript: tableTs }"
        >
          <div
            class="mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-bg-base shadow-card"
          >
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-bg-neutral-2">
                  <th
                    class="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
                  >
                    Invoice
                  </th>
                  <th
                    class="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
                  >
                    Client
                  </th>
                  <th
                    class="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
                  >
                    Status
                  </th>
                  <th
                    class="px-5 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-bg-neutral-2">
                @for (row of invoices; track row.id) {
                  <tr
                    class="transition-colors duration-normal hover:bg-bg-neutral-1"
                  >
                    <td
                      class="px-5 py-3 font-mono text-[12px] text-text-secondary"
                    >
                      {{ row.id }}
                    </td>
                    <td class="px-5 py-3 text-[13px] text-text-primary">
                      {{ row.client }}
                    </td>
                    <td class="px-5 py-3">
                      <nxp-badge
                        [variant]="row.variant"
                        [color]="row.color"
                        size="sm"
                        >{{ row.status }}</nxp-badge
                      >
                    </td>
                    <td
                      class="px-5 py-3 text-right font-mono text-[12px] tabular-nums text-text-primary"
                    >
                      {{ row.amount }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Plan cards"
          description="Badges as product metadata — a solid 'Most popular' flag pinned to the featured plan and a dot badge tier marker on every card. The highlighted card steps up to the full multi-layer card shadow."
          [fullsize]="true"
          [content]="{ HTML: plansHtml, TypeScript: plansTs }"
        >
          <div class="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            @for (plan of plans; track plan.name) {
              <div [class]="planCardClass(plan.featured)">
                @if (plan.featured) {
                  <nxp-badge
                    color="blue"
                    size="sm"
                    class="absolute right-4 top-4"
                    >Most popular</nxp-badge
                  >
                }
                <div class="flex items-center gap-2">
                  <h4
                    class="text-[15px] font-semibold tracking-card text-text-primary"
                  >
                    {{ plan.name }}
                  </h4>
                  <nxp-badge variant="dot" [color]="plan.tierColor" size="sm">{{
                    plan.tier
                  }}</nxp-badge>
                </div>
                <p class="mt-3 flex items-baseline gap-1">
                  <span
                    class="font-mono text-2xl font-semibold tracking-card text-text-primary"
                    >{{ plan.price }}</span
                  >
                  <span class="text-[12px] text-text-tertiary">/mo</span>
                </p>
                <ul class="mt-4 flex flex-col gap-2">
                  @for (f of plan.features; track f) {
                    <li
                      class="flex items-center gap-2 text-[12px] text-text-secondary"
                    >
                      <span
                        class="size-1.5 shrink-0 rounded-full bg-emerald-500"
                      ></span>
                      {{ f }}
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Repository topics"
          description="The [nxpBadge] directive turns plain inline spans into a colorful tag cloud — no extra host element — while a dot badge marks the repo Public. Pairs naturally with Geist Mono repo and language labels."
          [content]="{ HTML: repoHtml, TypeScript: repoTs }"
        >
          <div
            class="mx-auto w-full max-w-md rounded-xl bg-bg-base p-5 shadow-card"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-[13px] font-medium text-text-primary"
                >ngxpro / components</span
              >
              <span nxpBadge variant="dot" color="green" size="sm">Public</span>
            </div>
            <p class="mt-2 text-[13px] leading-relaxed text-text-secondary">
              Signal-first Angular UI primitives styled with Tailwind — 30+
              components, zero runtime CSS-in-JS.
            </p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              @for (tag of topics; track tag.label) {
                <span nxpBadge [color]="tag.color" size="sm">{{
                  tag.label
                }}</span>
              }
            </div>
            <div
              class="mt-5 flex items-center gap-4 font-mono text-[11px] text-text-tertiary"
            >
              <span class="flex items-center gap-1"
                ><span class="text-amber-500">★</span> 2.4k</span
              >
              <span>184 forks</span>
              <span class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-blue-500"></span>
                TypeScript
              </span>
            </div>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Member roster"
          description="Role tags sit beside avatars in a team list — solid badges for elevated roles (Owner, Admin) and quieter dot badges for Member and Billing. A compact, scannable real-world pattern."
          [content]="{ HTML: rosterHtml, TypeScript: rosterTs }"
        >
          <div
            class="mx-auto w-full max-w-md divide-y divide-bg-neutral-2 overflow-hidden rounded-xl bg-bg-base shadow-card"
          >
            @for (m of members; track m.email) {
              <div class="flex items-center gap-3 px-4 py-3">
                <span
                  class="grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white"
                  [style.background-color]="m.avatar"
                  >{{ m.initials }}</span
                >
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-medium text-text-primary">
                    {{ m.name }}
                  </p>
                  <p class="truncate font-mono text-[11px] text-text-tertiary">
                    {{ m.email }}
                  </p>
                </div>
                <nxp-badge
                  [variant]="m.variant"
                  [color]="m.color"
                  size="sm"
                  class="shrink-0"
                  >{{ m.role }}</nxp-badge
                >
              </div>
            }
          </div>
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

  // ── Composition demo data (real-world badge recipes) ───────────────────────
  readonly deployments: {
    status: string;
    color: NxpBadgeColor;
    message: string;
    branch: string;
    hash: string;
    env: string;
    time: string;
  }[] = [
    {
      status: 'Ready',
      color: 'green',
      message: 'feat: streaming SSR on the edge runtime',
      branch: 'main',
      hash: '3f9a1c2',
      env: 'Production',
      time: '2m',
    },
    {
      status: 'Building',
      color: 'amber',
      message: 'fix: hydration mismatch on theme toggle',
      branch: 'fix/hydration',
      hash: 'b7d4e90',
      env: 'Preview',
      time: '4m',
    },
    {
      status: 'Error',
      color: 'rose',
      message: 'chore: bump tailwind to v4.1',
      branch: 'deps/tailwind',
      hash: 'a1c8f33',
      env: 'Preview',
      time: '6m',
    },
    {
      status: 'Queued',
      color: 'gray',
      message: 'docs: rewrite badge recipes',
      branch: 'docs/badge',
      hash: '9e2b7a4',
      env: 'Preview',
      time: '8m',
    },
  ];

  readonly invoices: {
    id: string;
    client: string;
    status: string;
    color: NxpBadgeColor;
    variant: NxpBadgeVariant;
    amount: string;
  }[] = [
    {
      id: 'INV-2043',
      client: 'Linear',
      status: 'Paid',
      color: 'emerald',
      variant: 'solid',
      amount: '$2,400.00',
    },
    {
      id: 'INV-2044',
      client: 'Raycast',
      status: 'Pending',
      color: 'amber',
      variant: 'solid',
      amount: '$1,150.00',
    },
    {
      id: 'INV-2045',
      client: 'Supabase',
      status: 'Overdue',
      color: 'rose',
      variant: 'solid',
      amount: '$3,900.00',
    },
    {
      id: 'INV-2046',
      client: 'Resend',
      status: 'Refunded',
      color: 'gray',
      variant: 'solid',
      amount: '$640.00',
    },
    {
      id: 'INV-2047',
      client: 'Cursor',
      status: 'Draft',
      color: 'gray',
      variant: 'dot',
      amount: '$0.00',
    },
  ];

  readonly plans: {
    name: string;
    tier: string;
    tierColor: NxpBadgeColor;
    price: string;
    features: string[];
    featured: boolean;
  }[] = [
    {
      name: 'Hobby',
      tier: 'Free',
      tierColor: 'gray',
      price: '$0',
      features: ['1 project', 'Community support', '1 GB bandwidth'],
      featured: false,
    },
    {
      name: 'Pro',
      tier: 'Popular',
      tierColor: 'blue',
      price: '$20',
      features: [
        'Unlimited projects',
        'Email support',
        '1 TB bandwidth',
        'Preview deploys',
      ],
      featured: true,
    },
    {
      name: 'Scale',
      tier: 'Teams',
      tierColor: 'violet',
      price: '$99',
      features: [
        'SSO & SAML',
        'Priority support',
        'Usage analytics',
        '99.99% SLA',
      ],
      featured: false,
    },
  ];

  readonly topics: { label: string; color: NxpBadgeColor }[] = [
    { label: 'angular', color: 'red' },
    { label: 'typescript', color: 'blue' },
    { label: 'tailwindcss', color: 'cyan' },
    { label: 'signals', color: 'violet' },
    { label: 'rxjs', color: 'fuchsia' },
    { label: 'nx', color: 'indigo' },
    { label: 'vitest', color: 'green' },
    { label: 'ssr', color: 'amber' },
  ];

  readonly members: {
    initials: string;
    name: string;
    email: string;
    role: string;
    color: NxpBadgeColor;
    variant: NxpBadgeVariant;
    avatar: string;
  }[] = [
    {
      initials: 'SM',
      name: 'Sarah Mills',
      email: 'sarah@acme.dev',
      role: 'Owner',
      color: 'violet',
      variant: 'solid',
      avatar: '#8b5cf6',
    },
    {
      initials: 'TK',
      name: 'Tom Kessler',
      email: 'tom@acme.dev',
      role: 'Admin',
      color: 'blue',
      variant: 'solid',
      avatar: '#3b82f6',
    },
    {
      initials: 'AR',
      name: 'Ana Ruiz',
      email: 'ana@acme.dev',
      role: 'Member',
      color: 'gray',
      variant: 'dot',
      avatar: '#10b981',
    },
    {
      initials: 'JP',
      name: 'Jon Park',
      email: 'jon@acme.dev',
      role: 'Billing',
      color: 'amber',
      variant: 'dot',
      avatar: '#f59e0b',
    },
  ];

  planCardClass(featured: boolean): string {
    return featured
      ? 'relative rounded-xl bg-bg-base p-5 shadow-card-lg'
      : 'relative rounded-xl bg-bg-base p-5 shadow-border';
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

  readonly deploymentsHtml = `<div class="overflow-hidden rounded-xl bg-bg-base shadow-card">
  <div class="flex items-center justify-between border-b border-bg-neutral-2 px-5 py-3.5">
    <div class="flex items-center gap-2.5">
      <span class="text-[13px] font-semibold tracking-card text-text-primary">Deployments</span>
      <nxp-badge variant="dot" color="green" size="sm">Live</nxp-badge>
    </div>
    <span class="font-mono text-[11px] text-text-tertiary">acme-web</span>
  </div>
  <div class="divide-y divide-bg-neutral-2">
    @for (d of deployments; track d.hash) {
      <div class="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-neutral-1">
        <div class="w-[104px] shrink-0">
          <nxp-badge variant="dot" [color]="d.color" size="sm">{{ d.status }}</nxp-badge>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[13px] font-medium text-text-primary">{{ d.message }}</p>
          <p class="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-text-tertiary">
            <span>{{ d.branch }}</span>
            <span class="text-text-quaternary">·</span>
            <span>{{ d.hash }}</span>
          </p>
        </div>
        <span class="hidden font-mono text-[10px] uppercase tracking-wide text-text-quaternary sm:inline">{{ d.env }}</span>
        <span class="w-10 shrink-0 text-right font-mono text-[11px] text-text-quaternary">{{ d.time }}</span>
      </div>
    }
  </div>
</div>`;

  readonly deploymentsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';

interface Deployment {
  status: string;
  color: NxpBadgeColor;
  message: string;
  branch: string;
  hash: string;
  env: string;
  time: string;
}

@Component({
  selector: 'app-deployments',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deployments.html',
})
export class DeploymentsBadgeExample {
  readonly deployments: Deployment[] = [
    { status: 'Ready', color: 'green', message: 'feat: streaming SSR on the edge runtime', branch: 'main', hash: '3f9a1c2', env: 'Production', time: '2m' },
    { status: 'Building', color: 'amber', message: 'fix: hydration mismatch on theme toggle', branch: 'fix/hydration', hash: 'b7d4e90', env: 'Preview', time: '4m' },
    { status: 'Error', color: 'rose', message: 'chore: bump tailwind to v4.1', branch: 'deps/tailwind', hash: 'a1c8f33', env: 'Preview', time: '6m' },
    { status: 'Queued', color: 'gray', message: 'docs: rewrite badge recipes', branch: 'docs/badge', hash: '9e2b7a4', env: 'Preview', time: '8m' },
  ];
}`;

  readonly tableHtml = `<div class="overflow-hidden rounded-xl bg-bg-base shadow-card">
  <table class="w-full text-left">
    <thead>
      <tr class="border-b border-bg-neutral-2">
        <th class="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Invoice</th>
        <th class="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Client</th>
        <th class="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Status</th>
        <th class="px-5 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Amount</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-bg-neutral-2">
      @for (row of invoices; track row.id) {
        <tr class="hover:bg-bg-neutral-1">
          <td class="px-5 py-3 font-mono text-[12px] text-text-secondary">{{ row.id }}</td>
          <td class="px-5 py-3 text-[13px] text-text-primary">{{ row.client }}</td>
          <td class="px-5 py-3">
            <nxp-badge [variant]="row.variant" [color]="row.color" size="sm">{{ row.status }}</nxp-badge>
          </td>
          <td class="px-5 py-3 text-right font-mono text-[12px] tabular-nums text-text-primary">{{ row.amount }}</td>
        </tr>
      }
    </tbody>
  </table>
</div>`;

  readonly tableTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
  type NxpBadgeVariant,
} from '@ngxpro/components/badge';

interface Invoice {
  id: string;
  client: string;
  status: string;
  color: NxpBadgeColor;
  variant: NxpBadgeVariant;
  amount: string;
}

@Component({
  selector: 'app-table',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.html',
})
export class TableBadgeExample {
  readonly invoices: Invoice[] = [
    { id: 'INV-2043', client: 'Linear', status: 'Paid', color: 'emerald', variant: 'solid', amount: '$2,400.00' },
    { id: 'INV-2044', client: 'Raycast', status: 'Pending', color: 'amber', variant: 'solid', amount: '$1,150.00' },
    { id: 'INV-2045', client: 'Supabase', status: 'Overdue', color: 'rose', variant: 'solid', amount: '$3,900.00' },
    { id: 'INV-2046', client: 'Resend', status: 'Refunded', color: 'gray', variant: 'solid', amount: '$640.00' },
    { id: 'INV-2047', client: 'Cursor', status: 'Draft', color: 'gray', variant: 'dot', amount: '$0.00' },
  ];
}`;

  readonly plansHtml = `<div class="grid gap-4 sm:grid-cols-3">
  @for (plan of plans; track plan.name) {
    <div [class]="planCardClass(plan.featured)">
      @if (plan.featured) {
        <nxp-badge color="blue" size="sm" class="absolute right-4 top-4">Most popular</nxp-badge>
      }
      <div class="flex items-center gap-2">
        <h4 class="text-[15px] font-semibold tracking-card text-text-primary">{{ plan.name }}</h4>
        <nxp-badge variant="dot" [color]="plan.tierColor" size="sm">{{ plan.tier }}</nxp-badge>
      </div>
      <p class="mt-3 flex items-baseline gap-1">
        <span class="font-mono text-2xl font-semibold tracking-card text-text-primary">{{ plan.price }}</span>
        <span class="text-[12px] text-text-tertiary">/mo</span>
      </p>
      <ul class="mt-4 flex flex-col gap-2">
        @for (f of plan.features; track f) {
          <li class="flex items-center gap-2 text-[12px] text-text-secondary">
            <span class="size-1.5 shrink-0 rounded-full bg-emerald-500"></span>
            {{ f }}
          </li>
        }
      </ul>
    </div>
  }
</div>`;

  readonly plansTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';

interface Plan {
  name: string;
  tier: string;
  tierColor: NxpBadgeColor;
  price: string;
  features: string[];
  featured: boolean;
}

@Component({
  selector: 'app-plans',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans.html',
})
export class PlansBadgeExample {
  readonly plans: Plan[] = [
    { name: 'Hobby', tier: 'Free', tierColor: 'gray', price: '$0', features: ['1 project', 'Community support', '1 GB bandwidth'], featured: false },
    { name: 'Pro', tier: 'Popular', tierColor: 'blue', price: '$20', features: ['Unlimited projects', 'Email support', '1 TB bandwidth', 'Preview deploys'], featured: true },
    { name: 'Scale', tier: 'Teams', tierColor: 'violet', price: '$99', features: ['SSO & SAML', 'Priority support', 'Usage analytics', '99.99% SLA'], featured: false },
  ];

  planCardClass(featured: boolean): string {
    return featured
      ? 'relative rounded-xl bg-bg-base p-5 shadow-card-lg'
      : 'relative rounded-xl bg-bg-base p-5 shadow-border';
  }
}`;

  readonly repoHtml = `<div class="rounded-xl bg-bg-base p-5 shadow-card">
  <div class="flex items-center gap-2">
    <span class="font-mono text-[13px] font-medium text-text-primary">ngxpro / components</span>
    <span nxpBadge variant="dot" color="green" size="sm">Public</span>
  </div>
  <p class="mt-2 text-[13px] leading-relaxed text-text-secondary">
    Signal-first Angular UI primitives styled with Tailwind — 30+ components, zero runtime CSS-in-JS.
  </p>
  <div class="mt-4 flex flex-wrap gap-1.5">
    @for (tag of topics; track tag.label) {
      <span nxpBadge [color]="tag.color" size="sm">{{ tag.label }}</span>
    }
  </div>
  <div class="mt-5 flex items-center gap-4 font-mono text-[11px] text-text-tertiary">
    <span class="flex items-center gap-1"><span class="text-amber-500">★</span> 2.4k</span>
    <span>184 forks</span>
    <span class="flex items-center gap-1.5">
      <span class="size-2 rounded-full bg-blue-500"></span>
      TypeScript
    </span>
  </div>
</div>`;

  readonly repoTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeDirective,
  type NxpBadgeColor,
} from '@ngxpro/components/badge';

@Component({
  selector: 'app-repo',
  imports: [NxpBadgeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './repo.html',
})
export class RepoBadgeExample {
  readonly topics: { label: string; color: NxpBadgeColor }[] = [
    { label: 'angular', color: 'red' },
    { label: 'typescript', color: 'blue' },
    { label: 'tailwindcss', color: 'cyan' },
    { label: 'signals', color: 'violet' },
    { label: 'rxjs', color: 'fuchsia' },
    { label: 'nx', color: 'indigo' },
    { label: 'vitest', color: 'green' },
    { label: 'ssr', color: 'amber' },
  ];
}`;

  readonly rosterHtml = `<div class="divide-y divide-bg-neutral-2 overflow-hidden rounded-xl bg-bg-base shadow-card">
  @for (m of members; track m.email) {
    <div class="flex items-center gap-3 px-4 py-3">
      <span
        class="grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white"
        [style.background-color]="m.avatar"
      >{{ m.initials }}</span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-[13px] font-medium text-text-primary">{{ m.name }}</p>
        <p class="truncate font-mono text-[11px] text-text-tertiary">{{ m.email }}</p>
      </div>
      <nxp-badge [variant]="m.variant" [color]="m.color" size="sm" class="shrink-0">{{ m.role }}</nxp-badge>
    </div>
  }
</div>`;

  readonly rosterTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpBadgeComponent,
  type NxpBadgeColor,
  type NxpBadgeVariant,
} from '@ngxpro/components/badge';

interface Member {
  initials: string;
  name: string;
  email: string;
  role: string;
  color: NxpBadgeColor;
  variant: NxpBadgeVariant;
  avatar: string;
}

@Component({
  selector: 'app-roster',
  imports: [NxpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roster.html',
})
export class RosterBadgeExample {
  readonly members: Member[] = [
    { initials: 'SM', name: 'Sarah Mills', email: 'sarah@acme.dev', role: 'Owner', color: 'violet', variant: 'solid', avatar: '#8b5cf6' },
    { initials: 'TK', name: 'Tom Kessler', email: 'tom@acme.dev', role: 'Admin', color: 'blue', variant: 'solid', avatar: '#3b82f6' },
    { initials: 'AR', name: 'Ana Ruiz', email: 'ana@acme.dev', role: 'Member', color: 'gray', variant: 'dot', avatar: '#10b981' },
    { initials: 'JP', name: 'Jon Park', email: 'jon@acme.dev', role: 'Billing', color: 'amber', variant: 'dot', avatar: '#f59e0b' },
  ];
}`;
}
