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
} from '@ngxpro/cdk';
import {
  nxpInjectContext,
  NxpDynamicComponent,
  type NxpDynamicContent,
} from '@ngxpro/cdk/dynamic';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { DialogApiComponent } from './dialog-api.component';

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
  readonly context = nxpInjectContext<NxpDialogContext<boolean, DeleteData>>();
}

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NxpDialogDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DialogApiComponent,
  ],
  template: `
    <nxp-doc-component-page
      header="Dialog"
      package="cdk"
      type="component"
      path="cdk/dialog"
    >
      <p class="text-base text-text-secondary mb-6">
        Modal dialogs with backdrop, focus trap, enter/leave animations, Esc to
        close, and click-outside dismiss. Supports programmatic opening via
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >NxpDialogService</code
        >
        and template-based via the
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded"
          >nxpDialog</code
        >
        directive.
      </p>

      <ng-template nxpExamplesTab>
        <nxp-doc-example
          heading="Programmatic (NxpDialogService)"
          description="Inject NxpDialogService and call open() with a string body or a TemplateRef plus an options object. The simple text dialog, labeled dialog, and required (non-dismissible) dialog all share the same service entry point — only the options differ."
          [content]="{ HTML: programmaticHtml, TypeScript: programmaticTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Size variants"
          description="Three width scales: small (25 rem), medium (37.5 rem, default), and large (50 rem). The dialog still caps at calc(100vw - 2rem) on narrow viewports."
          [content]="{ HTML: sizesHtml, TypeScript: sizesTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Template-based (nxpDialog directive)"
          description="Use <ng-template nxpDialog> to declare inline dialog content. Two-way bind a boolean signal to control visibility; pass [nxpDialogOptions] for label, size, etc."
          [content]="{ HTML: templateHtml, TypeScript: templateTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Rich template content via service"
          description="Pass a TemplateRef to dialogService.open() for rich custom content. The confirm/cancel pattern uses context.completeWith() to emit a result back to the subscriber."
          [content]="{ HTML: richHtml, TypeScript: richTs }"
        >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Component-based dialog"
          description="Pass a standalone component as dialog content. The component injects its context via nxpInjectContext<NxpDialogContext>() and calls context.completeWith(value) to return a result. Two equivalent entry points: NxpDynamicComponent (lower-level) or the nxpDialog() factory (class-field, fully typed)."
          [content]="{ HTML: componentHtml, TypeScript: componentTs }"
        >
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- Via NxpDynamicComponent -->
            <div class="space-y-3">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Via NxpDynamicComponent
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Wrap the component with
                <code class="font-mono text-xs"
                  >new NxpDynamicComponent(MyComponent)</code
                >
                and pass it directly to
                <code class="font-mono text-xs">dialogService.open()</code>. Use
                the <code class="font-mono text-xs">data</code> option to send
                input data.
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
                <code class="font-mono text-xs"
                  >nxpDialog(MyComponent, opts)</code
                >
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
        </nxp-doc-example>

        <nxp-doc-example
          heading="Configurable playground"
          description="Edit any option in the API tab — label, size, closable, dismissible, required, appearance — then open the dialog to see the live result. Values are persisted to the URL."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="space-y-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Current options —
              <code class="font-mono text-xs">label="{{ label() }}"</code>,
              <code class="font-mono text-xs">size="{{ size() }}"</code>,
              <code class="font-mono text-xs">closable={{ closable() }}</code
              >,
              <code class="font-mono text-xs"
                >dismissible={{ dismissible() }}</code
              >, <code class="font-mono text-xs">required={{ required() }}</code
              >,
              <code class="font-mono text-xs"
                >appearance="{{ appearance() }}"</code
              >.
            </p>
            <button
              type="button"
              class="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              (click)="openConfigurable()"
            >
              Open configurable dialog
            </button>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-dialog-api
          [(label)]="label"
          [(size)]="size"
          [(closable)]="closable"
          [(dismissible)]="dismissible"
          [(required)]="required"
          [(appearance)]="appearance"
        />
      </ng-template>
    </nxp-doc-component-page>
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

  // Shared playground state — two-way bound into <app-dialog-api>
  readonly label = signal('Configurable dialog');
  readonly size = signal<NxpDialogSize>('m');
  readonly closable = signal(true);
  readonly dismissible = signal(true);
  readonly required = signal(false);
  readonly appearance = signal('default');

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
        tpl as NxpDynamicContent,
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
        tpl as NxpDynamicContent,
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
      .open<boolean>(new NxpDynamicComponent(ConfirmDeleteDialogComponent), {
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

  openConfigurable(): void {
    this.dialogService
      .open(
        'This dialog reflects the current options from the API tab. Edit the values there and reopen to see the change.',
        {
          label: this.label(),
          size: this.size(),
          closable: this.closable(),
          dismissible: this.dismissible(),
          required: this.required(),
          appearance: this.appearance(),
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe();
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ────────────
  readonly programmaticHtml = `<button type="button" (click)="openSimple()">Open simple dialog</button>
<button type="button" (click)="openWithLabel()">Open labeled dialog</button>
<button type="button" (click)="openRequired()">Open required dialog</button>`;

  readonly programmaticTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NxpDialogService, type NxpDialogOptions } from '@ngxpro/cdk';

@Component({
  selector: 'app-programmatic-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './programmatic.html',
})
export class ProgrammaticDialogExample {
  private readonly dialogService = inject(NxpDialogService);

  openSimple(): void {
    this.dialogService
      .open('This is a simple dialog with text content.', {
        label: 'Simple Dialog',
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }

  openWithLabel(): void {
    this.dialogService
      .open('You can close this dialog with X, Esc, or backdrop click.', {
        label: 'Closable Dialog',
        closable: true,
        dismissible: true,
      } as Partial<NxpDialogOptions<unknown>>)
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
}`;

  readonly sizesHtml = `<button (click)="openSized('s')">Small</button>
<button (click)="openSized('m')">Medium</button>
<button (click)="openSized('l')">Large</button>`;

  readonly sizesTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NxpDialogService,
  type NxpDialogOptions,
  type NxpDialogSize,
} from '@ngxpro/cdk';

@Component({
  selector: 'app-sized-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sizes.html',
})
export class SizedDialogExample {
  private readonly dialogService = inject(NxpDialogService);

  openSized(size: NxpDialogSize): void {
    this.dialogService
      .open(\`This is a \${size}-sized dialog.\`, {
        label: \`Size: \${size}\`,
        size,
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }
}`;

  readonly templateHtml = `<button (click)="templateOpen.set(true)">Open template dialog</button>

<ng-template
  [nxpDialog]="templateOpen()"
  (nxpDialogChange)="templateOpen.set($event)"
  [nxpDialogOptions]="{ label: 'Template Dialog' }"
>
  <p>This dialog content is declared inline using
    <code>&lt;ng-template nxpDialog&gt;</code>.
  </p>
</ng-template>

<button (click)="templateWithOptsOpen.set(true)">Open with options</button>

<ng-template
  [nxpDialog]="templateWithOptsOpen()"
  (nxpDialogChange)="templateWithOptsOpen.set($event)"
  [nxpDialogOptions]="{ label: 'Custom Options', size: 'l' }"
>
  <p>A large-sized dialog with a custom label.</p>
</ng-template>`;

  readonly templateTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDialogDirective } from '@ngxpro/cdk';

@Component({
  selector: 'app-template-dialog',
  imports: [NxpDialogDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './template.html',
})
export class TemplateDialogExample {
  readonly templateOpen = signal(false);
  readonly templateWithOptsOpen = signal(false);
}`;

  readonly richHtml = `<button (click)="openWithTemplate()">Open rich dialog</button>
<button (click)="openConfirm()">Open confirm dialog</button>

<ng-template #richTpl let-ctx>
  <p>This dialog is rendered from a TemplateRef passed to
    NxpDialogService.open().
  </p>
</ng-template>

<ng-template #confirmTpl let-ctx>
  <p>Are you sure you want to proceed?</p>
  <footer>
    <button (click)="ctx.$implicit.complete()">Cancel</button>
    <button (click)="ctx.completeWith('confirmed')">Confirm</button>
  </footer>
</ng-template>`;

  readonly richTs = `import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { NxpDialogService, type NxpDialogOptions } from '@ngxpro/cdk';
import type { NxpDynamicContent } from '@ngxpro/cdk/dynamic';

@Component({
  selector: 'app-rich-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich.html',
})
export class RichDialogExample {
  private readonly dialogService = inject(NxpDialogService);
  private readonly richTpl = viewChild<TemplateRef<unknown>>('richTpl');
  private readonly confirmTpl = viewChild<TemplateRef<unknown>>('confirmTpl');

  readonly confirmResult = signal<string>('(none)');

  openWithTemplate(): void {
    const tpl = this.richTpl();
    if (!tpl) return;
    this.dialogService
      .open(tpl as NxpDynamicContent, {
        label: 'Rich Content',
        size: 'm',
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }

  openConfirm(): void {
    const tpl = this.confirmTpl();
    if (!tpl) return;
    this.dialogService
      .open<string>(tpl as NxpDynamicContent, {
        label: 'Confirm Action',
        closable: true,
        dismissible: true,
        size: 's',
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe({
        next: (result) => this.confirmResult.set(result),
        complete: () => {
          if (this.confirmResult() === '(none)') {
            this.confirmResult.set('cancelled');
          }
        },
      });
  }
}`;

  readonly componentHtml = `<button (click)="openDeleteWithComponent()">
  Delete annual-report.pdf
</button>
<button (click)="openDeleteWithFactory()">
  Delete quarterly-data.csv
</button>`;

  readonly componentTs = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NxpDialogService,
  nxpDialog,
  type NxpDialogContext,
  type NxpDialogOptions,
} from '@ngxpro/cdk';
import { nxpInjectContext, NxpDynamicComponent } from '@ngxpro/cdk/dynamic';

interface DeleteData {
  readonly itemName: string;
}

@Component({
  selector: 'app-confirm-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>Permanently delete <strong>{{ context.data.itemName }}</strong>?</p>
    <footer>
      <button (click)="context.completeWith(false)">Cancel</button>
      <button (click)="context.completeWith(true)">Delete</button>
    </footer>
  \`,
})
class ConfirmDeleteDialogComponent {
  readonly context = nxpInjectContext<NxpDialogContext<boolean, DeleteData>>();
}

@Component({
  selector: 'app-component-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
})
export class ComponentDialogExample {
  private readonly dialogService = inject(NxpDialogService);
  readonly deleteResult = signal<string>('(none)');

  // Factory opener — typed, class-field, fully injection-context aware
  readonly openDeleteFactory = nxpDialog<DeleteData, boolean>(
    ConfirmDeleteDialogComponent,
    { label: 'Confirm Delete', size: 's' },
  );

  openDeleteWithComponent(): void {
    this.dialogService
      .open<boolean>(new NxpDynamicComponent(ConfirmDeleteDialogComponent), {
        label: 'Confirm Delete',
        size: 's',
        data: { itemName: 'annual-report.pdf' },
      } as Partial<NxpDialogOptions<DeleteData>>)
      .subscribe((confirmed) =>
        this.deleteResult.set(confirmed ? 'deleted' : 'cancelled'),
      );
  }

  openDeleteWithFactory(): void {
    this.openDeleteFactory({ itemName: 'quarterly-data.csv' }).subscribe(
      (confirmed) =>
        this.deleteResult.set(confirmed ? 'deleted' : 'cancelled'),
    );
  }
}`;

  readonly playgroundHtml = `<button (click)="openConfigurable()">Open configurable dialog</button>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NxpDialogService,
  type NxpDialogOptions,
  type NxpDialogSize,
} from '@ngxpro/cdk';

@Component({
  selector: 'app-playground-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundDialogExample {
  private readonly dialogService = inject(NxpDialogService);

  readonly label = signal('Configurable dialog');
  readonly size = signal<NxpDialogSize>('m');
  readonly closable = signal(true);
  readonly dismissible = signal(true);
  readonly required = signal(false);
  readonly appearance = signal('default');

  openConfigurable(): void {
    this.dialogService
      .open('This dialog reflects the current options.', {
        label: this.label(),
        size: this.size(),
        closable: this.closable(),
        dismissible: this.dismissible(),
        required: this.required(),
        appearance: this.appearance(),
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }
}`;
}
