import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpDialogService,
  NxpDialogDirective,
  nxpDialog,
  type NxpDialogContext,
  type NxpDialogOptions,
  type NxpDialogSize,
} from '@nxp/cdk';
import {
  injectContext,
  PolymorpheusComponent,
  type PolymorpheusContent,
} from '@taiga-ui/polymorpheus';

// ---------------------------------------------------------------------------
// Inline component used by the "Open with component" demo section
// ---------------------------------------------------------------------------

interface DeleteData {
  readonly itemName: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="text-gray-700 dark:text-gray-300 mb-6">
      Are you sure you want to permanently delete
      <strong class="font-semibold">{{ context.data.itemName }}</strong
      >? This action cannot be undone.
    </p>
    <footer class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
        (click)="context.completeWith(false)"
      >
        Cancel
      </button>
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
        (click)="context.completeWith(true)"
      >
        Delete
      </button>
    </footer>
  `,
})
class ConfirmDeleteDialogComponent {
  readonly context = injectContext<NxpDialogContext<boolean, DeleteData>>();
}

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NxpDialogDirective],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto space-y-16">
        <!-- Page header -->
        <div>
          <a routerLink="/" class="text-sm text-blue-500 hover:underline"
            >← Back to home</a
          >
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Dialog
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Modal dialogs with backdrop, focus trap, enter/leave animations, Esc
            to close, and click-outside dismiss. Supports programmatic opening
            via
            <code class="font-mono text-xs">NxpDialogService</code>
            and template-based via the
            <code class="font-mono text-xs">nxpDialog</code> directive.
          </p>
        </div>

        <!-- Section: Programmatic (NxpDialogService) -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Programmatic (NxpDialogService)
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Basic string content -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Simple text dialog
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Opens a dialog with a string label and text body.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                (click)="openSimple()"
              >
                Open simple dialog
              </button>
            </div>

            <!-- Closable with label -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                With label & close button
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Shows a header label and X close button.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                (click)="openWithLabel()"
              >
                Open labeled dialog
              </button>
            </div>

            <!-- Non-dismissible (required) -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Non-dismissible (required)
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">required: true</code> — the
                dialog cannot be closed by Esc or backdrop click. Use the OK
                button.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                (click)="openRequired()"
              >
                Open required dialog
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Size: small -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Size: small
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">size: 's'</code>
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                (click)="openSized('s')"
              >
                Small
              </button>
            </div>

            <!-- Size: medium -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Size: medium (default)
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">size: 'm'</code>
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                (click)="openSized('m')"
              >
                Medium
              </button>
            </div>

            <!-- Size: large -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Size: large
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <code class="font-mono text-xs">size: 'l'</code>
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                (click)="openSized('l')"
              >
                Large
              </button>
            </div>
          </div>
        </section>

        <!-- Section: Template-based (nxpDialog directive) -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Template-based (nxpDialog directive)
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Template dialog -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Structural directive
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Use
                <code class="font-mono text-xs"
                  >&lt;ng-template nxpDialog&gt;</code
                >
                to declare inline dialog content. Toggle via a boolean signal.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                (click)="templateOpen.set(true)"
              >
                Open template dialog
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Open:
                <code class="font-mono">{{ templateOpen() }}</code>
              </p>
            </div>

            <!-- Template dialog with options -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                With options
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Pass options like
                <code class="font-mono text-xs">label</code> and
                <code class="font-mono text-xs">size</code> via
                <code class="font-mono text-xs">[nxpDialogOptions]</code>.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                (click)="templateWithOptsOpen.set(true)"
              >
                Open with options
              </button>
            </div>
          </div>

          <ng-template
            [nxpDialog]="templateOpen()"
            (nxpDialogChange)="templateOpen.set($event)"
            [nxpDialogOptions]="{ label: 'Template Dialog' }"
          >
            <p class="text-gray-700 dark:text-gray-300">
              This dialog content is declared inline using
              <code class="font-mono text-xs"
                >&lt;ng-template nxpDialog&gt;</code
              >. Close it with the X button, Esc, or clicking outside.
            </p>
          </ng-template>

          <ng-template
            [nxpDialog]="templateWithOptsOpen()"
            (nxpDialogChange)="templateWithOptsOpen.set($event)"
            [nxpDialogOptions]="{ label: 'Custom Options', size: 'l' }"
          >
            <p class="text-gray-700 dark:text-gray-300">
              This is a large-sized dialog opened via the template directive
              with custom options. It demonstrates passing
              <code class="font-mono text-xs">[nxpDialogOptions]</code>.
            </p>
            <div
              class="mt-4 p-4 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400"
            >
              You can put any arbitrary template content here — forms, tables,
              rich layouts, etc.
            </div>
          </ng-template>
        </section>

        <!-- Section: With template content via service -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Rich template content via service
          </h2>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Template ref
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Pass a
                <code class="font-mono text-xs">TemplateRef</code> to
                <code class="font-mono text-xs">dialogService.open()</code> for
                rich custom content.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                (click)="openWithTemplate()"
              >
                Open rich dialog
              </button>
            </div>

            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Confirm / Cancel pattern
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                A dialog that emits a result via
                <code class="font-mono text-xs">completeWith()</code>.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                (click)="openConfirm()"
              >
                Open confirm dialog
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Last result:
                <code class="font-mono">{{ confirmResult() }}</code>
              </p>
            </div>
          </div>

          <ng-template #richTpl let-ctx>
            <div class="space-y-4">
              <p class="text-gray-700 dark:text-gray-300">
                This dialog is rendered from a
                <code class="font-mono text-xs">TemplateRef</code> passed
                programmatically to
                <code class="font-mono text-xs">NxpDialogService.open()</code>.
              </p>
              <div
                class="p-3 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300"
              >
                You can place forms, tables, charts — anything you want here.
              </div>
            </div>
          </ng-template>

          <ng-template #confirmTpl let-ctx>
            <div class="space-y-4">
              <p class="text-gray-700 dark:text-gray-300">
                Are you sure you want to proceed? This action cannot be undone.
              </p>
              <footer class="flex justify-end gap-2">
                <button
                  type="button"
                  class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  (click)="ctx.$implicit.complete()"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                  (click)="ctx.completeWith('confirmed')"
                >
                  Confirm
                </button>
              </footer>
            </div>
          </ng-template>
        </section>

        <!-- Section: Component-based dialog -->
        <section class="space-y-8">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            Component-based dialog
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Pass a standalone component as dialog content. The component injects
            its context via
            <code class="font-mono text-xs">injectContext&lt;NxpDialogContext&gt;()</code>
            and calls
            <code class="font-mono text-xs">context.completeWith(value)</code>
            to return a result.
          </p>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Via PolymorpheusComponent -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Via PolymorpheusComponent
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Wrap the component with
                <code class="font-mono text-xs">new PolymorpheusComponent(MyComponent)</code>
                and pass it directly to
                <code class="font-mono text-xs">dialogService.open()</code>.
                Use the <code class="font-mono text-xs">data</code> option to
                send input data.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                (click)="openDeleteWithComponent()"
              >
                Delete annual-report.pdf
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Last result:
                <code class="font-mono">{{ deleteResult() }}</code>
              </p>
            </div>

            <!-- Via nxpDialog() factory -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Via nxpDialog() factory
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Call
                <code class="font-mono text-xs">nxpDialog(MyComponent, opts)</code>
                as a class field to create a typed opener function. Invoke it
                with the data payload — no extra boilerplate needed.
              </p>
              <button
                type="button"
                class="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                (click)="openDeleteWithFactory()"
              >
                Delete quarterly-data.csv
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Last result:
                <code class="font-mono">{{ deleteResult() }}</code>
              </p>
            </div>
          </div>

          <!-- Code snippet -->
          <div class="rounded-lg bg-gray-900 text-gray-100 text-xs font-mono p-4 overflow-x-auto space-y-1 leading-relaxed">
            <p class="text-gray-500">// 1. Define a standalone component</p>
            <p><span class="text-purple-400">&#64;Component</span>(&#123; standalone: <span class="text-blue-400">true</span>, template: <span class="text-green-400">&#96;...&#96;</span> &#125;)</p>
            <p><span class="text-yellow-300">class</span> ConfirmDialogComponent &#123;</p>
            <p class="pl-4">readonly context = <span class="text-cyan-400">injectContext</span>&lt;<span class="text-yellow-200">NxpDialogContext</span>&lt;<span class="text-yellow-200">boolean</span>, &#123; itemName: <span class="text-yellow-200">string</span> &#125;&gt;&gt;();</p>
            <p>&#125;</p>
            <br />
            <p class="text-gray-500">// 2a. Open via PolymorpheusComponent</p>
            <p>dialogService.<span class="text-cyan-400">open</span>(<span class="text-yellow-300">new</span> <span class="text-cyan-400">PolymorpheusComponent</span>(ConfirmDialogComponent), &#123;</p>
            <p class="pl-4">label: <span class="text-green-400">'Confirm Delete'</span>, data: &#123; itemName: <span class="text-green-400">'file.pdf'</span> &#125;</p>
            <p>&#125;).<span class="text-cyan-400">subscribe</span>(confirmed => &#123; ... &#125;);</p>
            <br />
            <p class="text-gray-500">// 2b. Open via nxpDialog() factory (class field)</p>
            <p>readonly openDelete = <span class="text-cyan-400">nxpDialog</span>(ConfirmDialogComponent, &#123; label: <span class="text-green-400">'Confirm Delete'</span> &#125;);</p>
            <p><span class="text-gray-500">// then call:</span></p>
            <p><span class="text-purple-400">this</span>.openDelete(&#123; itemName: <span class="text-green-400">'file.pdf'</span> &#125;).<span class="text-cyan-400">subscribe</span>(confirmed => &#123; ... &#125;);</p>
          </div>
        </section>

        <!-- Section: API reference -->
        <section class="space-y-6">
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            API reference
          </h2>

          <h3 class="text-base font-medium text-gray-900 dark:text-white">
            NxpDialogOptions
          </h3>
          <div class="overflow-x-auto">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Option</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Default</th>
                  <th class="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">label</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2 font-mono">''</td>
                  <td class="px-4 py-2">Header title text</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">size</td>
                  <td class="px-4 py-2 font-mono">'s' | 'm' | 'l'</td>
                  <td class="px-4 py-2 font-mono">'m'</td>
                  <td class="px-4 py-2">Dialog width scale</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">closable</td>
                  <td class="px-4 py-2 font-mono">boolean | Observable</td>
                  <td class="px-4 py-2 font-mono">true</td>
                  <td class="px-4 py-2">
                    Show close button; allow close via button click
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">dismissible</td>
                  <td class="px-4 py-2 font-mono">boolean | Observable</td>
                  <td class="px-4 py-2 font-mono">true</td>
                  <td class="px-4 py-2">
                    Allow dismiss via Esc / click outside
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">required</td>
                  <td class="px-4 py-2 font-mono">boolean</td>
                  <td class="px-4 py-2 font-mono">false</td>
                  <td class="px-4 py-2">
                    If true, dismissing throws an error instead of completing
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">appearance</td>
                  <td class="px-4 py-2 font-mono">string</td>
                  <td class="px-4 py-2 font-mono">'default'</td>
                  <td class="px-4 py-2">
                    Custom appearance string (set as data attribute)
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">data</td>
                  <td class="px-4 py-2 font-mono">I</td>
                  <td class="px-4 py-2 font-mono">undefined</td>
                  <td class="px-4 py-2">
                    Arbitrary data passed to dialog content
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3
            class="text-base font-medium text-gray-900 dark:text-white mt-6"
          >
            Usage patterns
          </h3>
          <div class="overflow-x-auto">
            <table
              class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300"
            >
              <thead
                class="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-2">Pattern</th>
                  <th class="px-4 py-2">Usage</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-2 font-mono">NxpDialogService</td>
                  <td class="px-4 py-2">
                    Inject and call
                    <code class="font-mono text-xs"
                      >dialogService.open(content, options)</code
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">nxpDialog directive</td>
                  <td class="px-4 py-2">
                    <code class="font-mono text-xs"
                      >&lt;ng-template [nxpDialog]="open"&gt;</code
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">nxpDialog() factory</td>
                  <td class="px-4 py-2">
                    <code class="font-mono text-xs"
                      >const open = nxpDialog(MyComponent)</code
                    >
                    — returns a typed opener function
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">PolymorpheusComponent</td>
                  <td class="px-4 py-2">
                    <code class="font-mono text-xs"
                      >dialogService.open(new PolymorpheusComponent(MyComponent), opts)</code
                    >
                    — lower-level, full control over injector
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3
            class="text-base font-medium text-gray-900 dark:text-white mt-8"
          >
            Internals: NxpModal (CDK)
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            All dialogs, alerts and other overlays are built on top of the low-level
            modal portal from
            <code class="font-mono text-xs">@nxp/cdk/portals/modal</code>.
            You usually do not use it directly, but extend
            <code class="font-mono text-xs">NxpModalService</code> instead.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p class="font-medium text-gray-900 dark:text-white">
                <code class="font-mono text-xs">NxpModalComponent</code>
              </p>
              <ul class="list-disc list-inside space-y-1">
                <li>Renders a full-screen backdrop and centred modal panel.</li>
                <li>Uses <code class="font-mono text-xs">NxpFocusTrap</code> to keep focus inside.</li>
                <li>Uses <code class="font-mono text-xs">NxpActiveZone</code> to restore focus to the opener.</li>
                <li>Exposes a <code class="font-mono text-xs">component</code> signal with polymorphic content.</li>
              </ul>

              <p class="mt-4 font-medium text-gray-900 dark:text-white">
                <code class="font-mono text-xs">NxpModalService&lt;T, K&gt;</code>
              </p>
              <ul class="list-disc list-inside space-y-1">
                <li>Abstract CDK service that extends <code class="font-mono text-xs">NxpPortal&lt;T, K&gt;</code>.</li>
                <li>Subclasses provide a concrete <code class="font-mono text-xs">content</code> component and options.</li>
                <li>Handles enter/leave animations via <code class="font-mono text-xs">NXP_LEAVE</code> and <code class="font-mono text-xs">getAnimations()</code>.</li>
                <li>Used by <code class="font-mono text-xs">NxpDialogService</code> and other high-level APIs.</li>
              </ul>
            </div>

            <div
              class="rounded-lg bg-gray-900 text-gray-100 text-xs font-mono p-4 overflow-x-auto space-y-1 leading-relaxed"
            >
              <p class="text-gray-500">// cd k: libs/cdk/src/lib/portals/modal</p>
              <p><span class="text-purple-400">&#64;Injectable</span>()</p>
              <p>
                <span class="text-yellow-300">abstract class</span>
                NxpModalService&lt;T, K = void&gt;
                <span class="text-yellow-300">extends</span>
                NxpPortal&lt;T, K&gt;
                &#123;
              </p>
              <p class="pl-4">
                <span class="text-yellow-300">protected abstract readonly</span>
                content:
                <span class="text-yellow-200">Type</span>&lt;unknown&gt;;
              </p>
              <p class="pl-4">
                <span class="text-yellow-300">protected readonly</span>
                component =
                NxpModalComponent<span class="text-gray-500"> as </span>
                <span class="text-yellow-200">Type</span>&lt;NxpModalComponent&lt;T&gt;&gt;;
              </p>
              <p>&#125;</p>
              <br />
              <p>
                <span class="text-yellow-300">export class</span>
                NxpModalComponent&lt;T&gt; &#123;
              </p>
              <p class="pl-4">
                <span class="text-yellow-300">readonly</span>
                context =
                injectContext&lt;NxpPortalContext&lt;T&gt;&gt;();
              </p>
              <p class="pl-4">
                <span class="text-yellow-300">readonly</span>
                component =
                signal&lt;PolymorpheusContent&lt;NxpPortalContext&lt;T&gt;&gt; |
                null&gt;(<span class="text-blue-400">null</span>);
              </p>
              <p>&#125;</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class DialogDemoComponent {
  private readonly dialogService = inject(NxpDialogService);
  private readonly richTpl = viewChild<TemplateRef<unknown>>('richTpl');
  private readonly confirmTpl = viewChild<TemplateRef<unknown>>('confirmTpl');

  readonly templateOpen = signal(false);
  readonly templateWithOptsOpen = signal(false);
  readonly confirmResult = signal<string>('(none)');
  readonly deleteResult = signal<string>('(none)');

  // Factory-based opener — created once in injection context as a class field
  readonly openDeleteFactory = nxpDialog<DeleteData, boolean>(
    ConfirmDeleteDialogComponent,
    { label: 'Confirm Delete', size: 's' },
  );

  openSimple(): void {
    this.dialogService
      .open('This is a simple dialog with text content.', {
        label: 'Simple Dialog',
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }

  openWithLabel(): void {
    this.dialogService
      .open(
        'You can close this dialog with the X button, Esc key, or clicking the backdrop.',
        {
          label: 'Closable Dialog',
          closable: true,
          dismissible: true,
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe();
  }

  openRequired(): void {
    this.dialogService
      .open('This dialog cannot be dismissed. You must click OK.', {
        label: 'Required Action',
        closable: false,
        dismissible: false,
        required: true,
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }

  openSized(size: NxpDialogSize): void {
    this.dialogService
      .open(
        `This is a ${size === 's' ? 'small' : size === 'm' ? 'medium' : 'large'}-sized dialog.`,
        {
          label: `Size: ${size}`,
          size,
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe();
  }

  openWithTemplate(): void {
    const tpl = this.richTpl();
    if (!tpl) return;
    this.dialogService
      .open(
        tpl as PolymorpheusContent,
        {
          label: 'Rich Content',
          size: 'm',
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe();
  }

  openConfirm(): void {
    const tpl = this.confirmTpl();
    if (!tpl) return;
    this.dialogService
      .open<string>(
        tpl as PolymorpheusContent,
        {
          label: 'Confirm Action',
          closable: true,
          dismissible: true,
          size: 's',
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe({
        next: (result) => this.confirmResult.set(result),
        complete: () => {
          if (this.confirmResult() === '(none)') {
            this.confirmResult.set('cancelled');
          }
        },
      });
  }

  openDeleteWithComponent(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(ConfirmDeleteDialogComponent), {
        label: 'Confirm Delete',
        size: 's',
        data: { itemName: 'annual-report.pdf' },
      } as Partial<NxpDialogOptions<DeleteData>>)
      .subscribe({
        next: (confirmed) =>
          this.deleteResult.set(confirmed ? 'deleted' : 'cancelled'),
        complete: () => {
          if (this.deleteResult() === '(none)') {
            this.deleteResult.set('cancelled');
          }
        },
      });
  }

  openDeleteWithFactory(): void {
    this.openDeleteFactory({ itemName: 'quarterly-data.csv' }).subscribe({
      next: (confirmed) =>
        this.deleteResult.set(confirmed ? 'deleted' : 'cancelled'),
      complete: () => {
        if (this.deleteResult() === '(none)') {
          this.deleteResult.set('cancelled');
        }
      },
    });
  }
}
