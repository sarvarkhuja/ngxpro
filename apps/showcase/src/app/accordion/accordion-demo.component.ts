import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionIndicatorDirective,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';
import { AmountPipe } from '@ngxpro/core';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { AccordionApiComponent } from './accordion-api.component';

interface Operation {
  title: string;
  subtitle?: string;
  sum?: number;
  time?: string;
}

interface Faq {
  title: string;
  content: string;
  /** Remix Icon class name, e.g. `'ri-shopping-bag-line'`. */
  icon: string;
}

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KeyValuePipe,
    AccordionApiComponent,
    AccordionComponent,
    AccordionIndicatorDirective,
    AccordionTriggerComponent,
    AmountPipe,
    ExpandComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Accordion"
      package="components"
      type="component"
      path="components/accordion"
    >
      <p class="text-base text-text-secondary mb-6">
        Proximity-animated accordion with fluid motion layers — hover pill,
        focus ring, and a per-open-item background that springs with the
        content. Built on
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-accordion</code
        >
        and
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-accordion-trigger</code
        >, with content panels rendered through
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxp-expand</code
        >.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Multiple"
          description="Default mode — multiple sections can be open at once. Each trigger animates its content panel independently."
          [content]="{ HTML: multipleHtml, TypeScript: multipleTs }"
        >
          <div class="w-full max-w-md">
            <nxp-accordion [type]="type()" [closeOthers]="closeOthers()">
              <nxp-accordion-trigger nxpAccordion>
                What is ngxpro?
              </nxp-accordion-trigger>
              <nxp-expand>
                <div
                  class="px-3 pb-2 pt-1 text-[13px] text-gray-600 dark:text-gray-400"
                >
                  A production-ready Angular UI library combining Taiga UI
                  architecture patterns with Tremor Tailwind styling and fluid
                  motion.
                </div>
              </nxp-expand>

              <nxp-accordion-trigger nxpAccordion>
                Key features
              </nxp-accordion-trigger>
              <nxp-expand>
                <div
                  class="px-3 pb-2 pt-1 text-[13px] text-gray-600 dark:text-gray-400"
                >
                  <ul class="list-disc list-inside space-y-1">
                    <li>Signals-first architecture</li>
                    <li>Light / dark mode</li>
                    <li>Proximity-animated layers</li>
                    <li>Accessible by default</li>
                  </ul>
                </div>
              </nxp-expand>

              <nxp-accordion-trigger nxpAccordion>
                Installation
              </nxp-accordion-trigger>
              <nxp-expand>
                <div
                  class="px-3 pb-2 pt-1 text-[13px] text-gray-600 dark:text-gray-400"
                >
                  <pre
                    class="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-[12px]"
                  >npm install @ngxpro/components</pre>
                </div>
              </nxp-expand>
            </nxp-accordion>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Single"
          description='Set type="single" to enforce a single-open accordion — opening one section automatically collapses the others.'
          [content]="{ HTML: singleHtml, TypeScript: singleTs }"
        >
          <div class="w-full max-w-md">
            <nxp-accordion type="single">
              <nxp-accordion-trigger nxpAccordion>
                Section 1
              </nxp-accordion-trigger>
              <nxp-expand>
                <div
                  class="px-3 pb-2 pt-1 text-[13px] text-gray-600 dark:text-gray-400"
                >
                  Only one section can be open at a time in single mode.
                </div>
              </nxp-expand>

              <nxp-accordion-trigger nxpAccordion>
                Section 2
              </nxp-accordion-trigger>
              <nxp-expand>
                <div
                  class="px-3 pb-2 pt-1 text-[13px] text-gray-600 dark:text-gray-400"
                >
                  Opening this section will close the others.
                </div>
              </nxp-expand>

              <nxp-accordion-trigger nxpAccordion>
                Section 3
              </nxp-accordion-trigger>
              <nxp-expand>
                <div
                  class="px-3 pb-2 pt-1 text-[13px] text-gray-600 dark:text-gray-400"
                >
                  This keeps the reading surface focused on a single topic.
                </div>
              </nxp-expand>
            </nxp-accordion>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="FAQ with icons"
          description="Project a leading icon plus title into each trigger. Icons inherit the current text color so they follow light / dark mode."
          [content]="{ HTML: faqHtml, TypeScript: faqTs }"
        >
          <div class="w-full max-w-md">
            <nxp-accordion type="single">
              @for (item of faqs; track item.title) {
                <nxp-accordion-trigger nxpAccordion>
                  <span class="flex items-center gap-3 w-full">
                    <i
                      [class]="
                        item.icon +
                        ' shrink-0 text-lg leading-none text-text-secondary'
                      "
                      aria-hidden="true"
                    ></i>
                    <span class="text-left">{{ item.title }}</span>
                  </span>
                </nxp-accordion-trigger>
                <nxp-expand>
                  <div class="px-3 pb-2 pt-1 pl-9 text-[13px] text-text-secondary">
                    {{ item.content }}
                  </div>
                </nxp-expand>
              }
            </nxp-accordion>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Custom indicators"
          description="Two paths: pass [indicator] for a different Remix-icon class, or project a <ng-template nxpAccordionIndicator let-open> for fully custom rendering (receives the open state)."
          [content]="{ HTML: indicatorsHtml, TypeScript: indicatorsTs }"
        >
          <div class="w-full max-w-md flex flex-col gap-6">
            <!-- (1) Different chevron + rotation via [indicator] / [rotation] -->
            <nxp-accordion type="single">
              <nxp-accordion-trigger
                nxpAccordion
                indicator="ri-arrow-down-s-line"
                [rotation]="180"
              >
                Down chevron, flips on open
              </nxp-accordion-trigger>
              <nxp-expand>
                <div class="px-3 pb-2 pt-1 text-[13px] text-text-secondary">
                  The default chevron is replaced with a downward arrow; the
                  rotation angle is swapped from 90° to 180° so it flips to
                  point up when expanded.
                </div>
              </nxp-expand>
            </nxp-accordion>

            <!-- (2) Plus → minus icon swap via projected ng-template -->
            <nxp-accordion type="single">
              <nxp-accordion-trigger nxpAccordion>
                Plus / minus swap
                <ng-template nxpAccordionIndicator let-open>
                  <i
                    [class]="
                      (open ? 'ri-subtract-line' : 'ri-add-line') +
                      ' shrink-0 text-base leading-none text-text-secondary'
                    "
                    aria-hidden="true"
                  ></i>
                </ng-template>
              </nxp-accordion-trigger>
              <nxp-expand>
                <div class="px-3 pb-2 pt-1 text-[13px] text-text-secondary">
                  The projected
                  <code class="text-[12px]">nxpAccordionIndicator</code>
                  template renders different icons per state — no rotation, just
                  an icon swap when the section opens.
                </div>
              </nxp-expand>
            </nxp-accordion>

            <!-- (3) Custom HTML (text badge) — completely replaces the icon -->
            <nxp-accordion type="single">
              <nxp-accordion-trigger nxpAccordion>
                Text badge indicator
                <ng-template nxpAccordionIndicator let-open>
                  <span
                    class="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-pill bg-bg-neutral-1 text-text-secondary"
                  >
                    {{ open ? 'Hide' : 'Show' }}
                  </span>
                </ng-template>
              </nxp-accordion-trigger>
              <nxp-expand>
                <div class="px-3 pb-2 pt-1 text-[13px] text-text-secondary">
                  The indicator template can render arbitrary HTML — here a
                  pill-shaped text badge that toggles between Show / Hide.
                </div>
              </nxp-expand>
            </nxp-accordion>
          </div>
        </nxp-doc-example>

        <nxp-doc-example
          heading="Operations"
          description="Project arbitrary content into the trigger to build richer rows — counts, totals, badges. Empty groups stay collapsed."
          [content]="{ HTML: operationsHtml, TypeScript: operationsTs }"
        >
          <div class="w-full max-w-md">
            <nxp-accordion type="single">
              @for (group of operations | keyvalue; track group.key) {
                <nxp-accordion-trigger nxpAccordion>
                  <span class="flex items-baseline justify-between gap-2 w-full">
                    <span>{{ group.key }}</span>
                    <span
                      class="text-[11px] font-normal text-gray-500 dark:text-gray-400"
                    >
                      @if (group.value.length; as count) {
                        {{ count }} ·
                        {{ sum(group.value) | nxpAmount: 'USD' : 'start' }}
                      } @else {
                        Empty
                      }
                    </span>
                  </span>
                </nxp-accordion-trigger>
                <nxp-expand
                  [style.display]="group.value.length ? null : 'none'"
                >
                  <div class="px-3 pb-2 pt-1 flex flex-col gap-1">
                    @for (operation of group.value; track operation.title) {
                      <div
                        class="flex items-center justify-between gap-2 py-1 text-[12px]"
                      >
                        <span class="text-gray-700 dark:text-gray-300 truncate">
                          {{ operation.title }}
                        </span>
                        @if (operation.sum; as s) {
                          <span
                            [class]="
                              s > 0
                                ? 'text-green-600 dark:text-green-400 font-medium shrink-0'
                                : 'text-gray-600 dark:text-gray-400 shrink-0'
                            "
                          >
                            {{ s | nxpAmount: 'USD' : 'start' }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                </nxp-expand>
              }
            </nxp-accordion>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-accordion-api [(type)]="type" [(closeOthers)]="closeOthers" />
      </ng-template>
    </nxp-doc-component-page>
  `,
})
export class AccordionDemoComponent {
  readonly type = signal<'single' | 'multiple'>('multiple');
  readonly closeOthers = signal(false);

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly multipleHtml = `<nxp-accordion [type]="type()" [closeOthers]="closeOthers()">
  <nxp-accordion-trigger nxpAccordion>What is ngxpro?</nxp-accordion-trigger>
  <nxp-expand>
    <div class="px-3 pb-2 pt-1 text-[13px] text-text-secondary">
      A production-ready Angular UI library combining Taiga UI architecture
      patterns with Tremor Tailwind styling and fluid motion.
    </div>
  </nxp-expand>

  <nxp-accordion-trigger nxpAccordion>Key features</nxp-accordion-trigger>
  <nxp-expand>
    <ul class="px-3 pb-2 pt-1 text-[13px] list-disc list-inside">
      <li>Signals-first architecture</li>
      <li>Light / dark mode</li>
      <li>Proximity-animated layers</li>
    </ul>
  </nxp-expand>
</nxp-accordion>`;

  readonly multipleTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';

@Component({
  selector: 'app-multiple',
  imports: [AccordionComponent, AccordionTriggerComponent, ExpandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multiple.html',
})
export class MultipleAccordionExample {
  readonly type = signal<'single' | 'multiple'>('multiple');
  readonly closeOthers = signal(false);
}`;

  readonly faqs: Faq[] = [
    {
      title: 'How do I place an order?',
      content:
        "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
      icon: 'ri-shopping-bag-line',
    },
    {
      title: 'Can I modify or cancel my order?',
      content:
        "Yes, you can modify or cancel your order before it's shipped. Once your order is processed, you can't make changes.",
      icon: 'ri-bill-line',
    },
    {
      title: 'What payment methods do you accept?',
      content:
        'We accept all major credit cards, including Visa, Mastercard, and American Express.',
      icon: 'ri-bank-card-line',
    },
    {
      title: 'How much does shipping cost?',
      content:
        'Shipping costs vary based on your location and the size of your order. We offer free shipping for orders over $50.',
      icon: 'ri-archive-line',
    },
    {
      title: 'Do you ship internationally?',
      content:
        'Yes, we ship to most countries. Please check our shipping rates and policies for more information.',
      icon: 'ri-earth-line',
    },
    {
      title: 'How do I request a refund?',
      content:
        "If you're not satisfied with your purchase, you can request a refund within 30 days of purchase. Please contact our customer support team for assistance.",
      icon: 'ri-refresh-line',
    },
  ];

  readonly faqHtml = `<nxp-accordion type="single">
  @for (item of faqs; track item.title) {
    <nxp-accordion-trigger nxpAccordion>
      <span class="flex items-center gap-3 w-full">
        <i
          [class]="item.icon + ' shrink-0 text-lg leading-none text-text-secondary'"
          aria-hidden="true"
        ></i>
        <span class="text-left">{{ item.title }}</span>
      </span>
    </nxp-accordion-trigger>
    <nxp-expand>
      <div class="px-3 pb-2 pt-1 pl-9 text-[13px] text-text-secondary">
        {{ item.content }}
      </div>
    </nxp-expand>
  }
</nxp-accordion>`;

  readonly faqTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';

interface Faq {
  title: string;
  content: string;
  /** Remix Icon class name, e.g. 'ri-shopping-bag-line'. */
  icon: string;
}

@Component({
  selector: 'app-faq',
  imports: [AccordionComponent, AccordionTriggerComponent, ExpandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.html',
})
export class FaqAccordionExample {
  readonly faqs: Faq[] = [
    {
      title: 'How do I place an order?',
      content: "Browse our products, add items to your cart...",
      icon: 'ri-shopping-bag-line',
    },
    {
      title: 'Can I modify or cancel my order?',
      content: "Yes, you can modify or cancel your order before it's shipped...",
      icon: 'ri-bill-line',
    },
    {
      title: 'What payment methods do you accept?',
      content: 'We accept all major credit cards...',
      icon: 'ri-bank-card-line',
    },
    {
      title: 'How much does shipping cost?',
      content: 'Shipping costs vary based on your location...',
      icon: 'ri-archive-line',
    },
    {
      title: 'Do you ship internationally?',
      content: 'Yes, we ship to most countries...',
      icon: 'ri-earth-line',
    },
    {
      title: 'How do I request a refund?',
      content: "If you're not satisfied with your purchase...",
      icon: 'ri-refresh-line',
    },
  ];
}`;

  readonly singleHtml = `<nxp-accordion type="single">
  <nxp-accordion-trigger nxpAccordion>Section 1</nxp-accordion-trigger>
  <nxp-expand>
    <div class="px-3 pb-2 pt-1 text-[13px] text-text-secondary">
      Only one section can be open at a time in single mode.
    </div>
  </nxp-expand>

  <nxp-accordion-trigger nxpAccordion>Section 2</nxp-accordion-trigger>
  <nxp-expand>
    <div class="px-3 pb-2 pt-1 text-[13px] text-text-secondary">
      Opening this section will close the others.
    </div>
  </nxp-expand>
</nxp-accordion>`;

  readonly singleTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';

@Component({
  selector: 'app-single',
  imports: [AccordionComponent, AccordionTriggerComponent, ExpandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './single.html',
})
export class SingleAccordionExample {}`;

  readonly indicatorsHtml = `<!-- (1) Swap the default chevron via [indicator] / [rotation] -->
<nxp-accordion type="single">
  <nxp-accordion-trigger
    nxpAccordion
    indicator="ri-arrow-down-s-line"
    [rotation]="180"
  >
    Down chevron, flips on open
  </nxp-accordion-trigger>
  <nxp-expand>...</nxp-expand>
</nxp-accordion>

<!-- (2) Plus / minus swap via a projected indicator template -->
<nxp-accordion type="single">
  <nxp-accordion-trigger nxpAccordion>
    Plus / minus swap
    <ng-template nxpAccordionIndicator let-open>
      <i
        [class]="
          (open ? 'ri-subtract-line' : 'ri-add-line') +
          ' shrink-0 text-base leading-none text-text-secondary'
        "
        aria-hidden="true"
      ></i>
    </ng-template>
  </nxp-accordion-trigger>
  <nxp-expand>...</nxp-expand>
</nxp-accordion>

<!-- (3) Fully custom indicator content (text badge) -->
<nxp-accordion type="single">
  <nxp-accordion-trigger nxpAccordion>
    Text badge indicator
    <ng-template nxpAccordionIndicator let-open>
      <span class="text-[11px] font-medium px-2 py-0.5 rounded-pill bg-bg-neutral-1 text-text-secondary">
        {{ open ? 'Hide' : 'Show' }}
      </span>
    </ng-template>
  </nxp-accordion-trigger>
  <nxp-expand>...</nxp-expand>
</nxp-accordion>`;

  readonly indicatorsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionIndicatorDirective,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';

@Component({
  selector: 'app-custom-indicators',
  imports: [
    AccordionComponent,
    AccordionIndicatorDirective,
    AccordionTriggerComponent,
    ExpandComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-indicators.html',
})
export class CustomIndicatorsAccordionExample {}`;

  readonly operationsHtml = `<nxp-accordion type="single">
  @for (group of operations | keyvalue; track group.key) {
    <nxp-accordion-trigger nxpAccordion>
      <span class="flex items-baseline justify-between gap-2 w-full">
        <span>{{ group.key }}</span>
        <span class="text-[11px] font-normal text-text-secondary">
          @if (group.value.length; as count) {
            {{ count }} · {{ sum(group.value) | nxpAmount: 'USD' : 'start' }}
          } @else {
            Empty
          }
        </span>
      </span>
    </nxp-accordion-trigger>
    <nxp-expand [style.display]="group.value.length ? null : 'none'">
      <div class="px-3 pb-2 pt-1 flex flex-col gap-1">
        @for (op of group.value; track op.title) {
          <div class="flex items-center justify-between gap-2 py-1 text-[12px]">
            <span class="truncate">{{ op.title }}</span>
            <span>{{ op.sum | nxpAmount: 'USD' : 'start' }}</span>
          </div>
        }
      </div>
    </nxp-expand>
  }
</nxp-accordion>`;

  readonly operationsTs = `import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';
import { AmountPipe } from '@ngxpro/core';

interface Operation {
  title: string;
  sum?: number;
}

@Component({
  selector: 'app-operations',
  imports: [
    KeyValuePipe,
    AccordionComponent,
    AccordionTriggerComponent,
    AmountPipe,
    ExpandComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operations.html',
})
export class OperationsAccordionExample {
  readonly operations: Record<string, Operation[]> = {
    Income: [
      { title: 'Salary', sum: 5000 },
      { title: 'Freelance', sum: 1200 },
    ],
    Expenses: [
      { title: 'Rent', sum: -1500 },
      { title: 'Utilities', sum: -120 },
    ],
    Pending: [],
  };

  sum(items: Operation[]): number {
    return items.reduce((acc, op) => acc + (op.sum ?? 0), 0);
  }
}`;

  readonly operations: Record<string, Operation[]> = {
    Income: [
      { title: 'Salary', subtitle: 'Monthly', sum: 5000, time: 'Feb 15' },
      { title: 'Freelance', subtitle: 'Project X', sum: 1200, time: 'Feb 14' },
      { title: 'Dividends', subtitle: 'Portfolio', sum: 150, time: 'Feb 10' },
    ],
    Expenses: [
      { title: 'Rent', subtitle: 'Monthly', sum: -1500, time: 'Feb 1' },
      {
        title: 'Utilities',
        subtitle: 'Electric + Gas',
        sum: -120,
        time: 'Feb 5',
      },
    ],
    Pending: [],
  };

  sum(items: Operation[]): number {
    return items.reduce((acc, op) => acc + (op.sum ?? 0), 0);
  }
}
