import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpandComponent } from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';
import { AmountPipe } from '@ngxpro/core';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { NxpDocPageComponent } from '@ngxpro/addon-doc-lib/page';
import { NxpDocTocComponent } from '@ngxpro/addon-doc-lib/toc';

interface Operation {
  title: string;
  subtitle?: string;
  sum?: number;
  time?: string;
}

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KeyValuePipe,
    AccordionComponent,
    AccordionTriggerComponent,
    AmountPipe,
    ExpandComponent,
    NxpDocExampleComponent,
    NxpDocPageComponent,
    NxpDocTocComponent,
  ],
  template: `
    <nxp-doc-page
      header="Accordion"
      package="components"
      type="component"
      path="components/accordion"
    >
      <nxp-doc-toc />

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

      <nxp-doc-example
        heading="Multiple"
        description="Default mode — multiple sections can be open at once. Each trigger animates its content panel independently."
      >
        <div class="w-full max-w-md">
          <nxp-accordion>
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
        description="Set type=&quot;single&quot; to enforce a single-open accordion — opening one section automatically collapses the others."
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
        heading="Operations"
        description="Project arbitrary content into the trigger to build richer rows — counts, totals, badges. Empty groups stay collapsed."
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
    </nxp-doc-page>
  `,
})
export class AccordionDemoComponent {
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
