import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
  type WritableSignal,
} from '@angular/core';
import { defer, of, type Observable } from 'rxjs';
import {
  NxpDialogService,
  NxpDialogDirective,
  nxpDialog,
  type NxpDialogContext,
  type NxpDialogOptions,
  type NxpDialogSize,
} from '@ngxpro/cdk';
import { nxpInjectContext, NxpDynamicComponent } from '@ngxpro/cdk/dynamic';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import {
  DataListComponent,
  OptionDirective,
} from '@ngxpro/components/data-list';
import { DialogApiComponent } from './dialog-api.component';

// ───────────────────────────────────────────────────────────────────────────
// Shared design-system class tokens (Vercel/Geist — see design-system.md).
// Monochrome canvas, shadow-as-border, contextual status accents only.
// ───────────────────────────────────────────────────────────────────────────

const S = {
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-m bg-primary px-3.5 py-2 text-sm font-medium text-text-on-accent transition-[background-color,transform] duration-fast hover:bg-primary-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-40',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 rounded-m bg-bg-base px-3.5 py-2 text-sm font-medium text-text-primary shadow-border transition-[background-color] duration-fast hover:bg-bg-neutral-1 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
  btnGhost:
    'inline-flex items-center justify-center gap-2 rounded-m px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors duration-fast hover:bg-bg-neutral-1 hover:text-text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
  btnDanger:
    'inline-flex items-center justify-center gap-2 rounded-m bg-status-negative px-3.5 py-2 text-sm font-medium text-white transition-[filter,transform] duration-fast hover:brightness-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-negative focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-40',
  input:
    'w-full rounded-m bg-bg-base px-3 py-2 text-sm text-text-primary shadow-border outline-none transition-shadow duration-fast placeholder:text-text-quaternary focus:shadow-input-focus',
  kbd: 'inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm bg-bg-neutral-1 px-1.5 font-mono text-[11px] leading-none text-text-tertiary shadow-border-light',
  groupLabel:
    'font-mono text-[11px] font-medium uppercase tracking-wide text-text-quaternary',
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Shared data shapes
// ───────────────────────────────────────────────────────────────────────────

interface DeleteProjectData {
  readonly projectName: string;
}
interface EditorData {
  readonly initial: string;
  readonly dirty: WritableSignal<boolean>;
}
interface ConnectConfig {
  readonly source: string;
  readonly host: string;
  readonly database: string;
  readonly ssl: boolean;
}
interface Command {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly kbd?: readonly string[];
}
interface CommandGroup {
  readonly label: string;
  readonly items: readonly Command[];
}

// ═══════════════════════════════════════════════════════════════════════════
// 1 — Command menu (⌘K). Opened with appearance:'command' so the dialog frame
//     drops its default padding and the search bar sits flush to the edge.
// ═══════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-command-menu-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DataListComponent, OptionDirective],
  styles: [
    `
      nxp-dialog[data-appearance='command'] {
        padding: 0;
      }
    `,
  ],
  template: `
    <div class="flex flex-col">
      <div class="flex items-center gap-3 border-b border-border-normal px-4">
        <i
          class="ri-search-line text-lg text-text-quaternary"
          aria-hidden="true"
        ></i>
        <input
          type="text"
          [value]="query()"
          (input)="onQuery($event)"
          (keydown)="onKey($event)"
          class="w-full bg-transparent py-4 text-sm text-text-primary outline-none placeholder:text-text-quaternary"
          placeholder="Search commands…"
          aria-label="Search commands"
          autocomplete="off"
          spellcheck="false"
        />
        <kbd [class]="s.kbd">esc</kbd>
      </div>

      <nxp-data-list
        label="Commands"
        [emptyLabel]="'No commands match “' + query() + '”'"
        [class]="'max-h-[min(60vh,22rem)] overflow-y-auto p-2'"
      >
        @for (group of filteredGroups(); track group.label) {
          <div class="px-2 pb-1 pt-3 first:pt-1">
            <span [class]="s.groupLabel">{{ group.label }}</span>
          </div>
          @for (item of group.items; track item.id) {
            <button
              nxpOption
              [selected]="activeId() === item.id"
              (mouseenter)="setActive(item)"
              (click)="select(item)"
            >
              <i
                [class]="item.icon + ' text-base text-text-secondary'"
                aria-hidden="true"
              ></i>
              <span class="flex-1">{{ item.label }}</span>
              @if (item.kbd) {
                <span class="flex items-center gap-1">
                  @for (k of item.kbd; track k) {
                    <kbd [class]="s.kbd">{{ k }}</kbd>
                  }
                </span>
              }
            </button>
          }
        }
      </nxp-data-list>

      <div
        class="flex items-center gap-4 border-t border-border-normal px-4 py-2.5 text-[11px] text-text-tertiary"
      >
        <span class="flex items-center gap-1.5">
          <kbd [class]="s.kbd">↑</kbd><kbd [class]="s.kbd">↓</kbd> navigate
        </span>
        <span class="flex items-center gap-1.5">
          <kbd [class]="s.kbd">↵</kbd> select
        </span>
        <span
          class="ml-auto font-mono uppercase tracking-wide text-text-quaternary"
          >⌘K</span
        >
      </div>

      <h2 [id]="context.id" class="sr-only">Command menu</h2>
    </div>
  `,
})
class CommandMenuDialogComponent {
  protected readonly s = S;
  protected readonly context = nxpInjectContext<NxpDialogContext<string>>();

  protected readonly query = signal('');
  protected readonly active = signal(0);

  private readonly groups: readonly CommandGroup[] = [
    {
      label: 'Navigation',
      items: [
        { id: 'overview', label: 'Go to Overview', icon: 'ri-dashboard-line' },
        {
          id: 'deployments',
          label: 'Go to Deployments',
          icon: 'ri-rocket-line',
        },
        {
          id: 'analytics',
          label: 'Go to Analytics',
          icon: 'ri-line-chart-line',
        },
        {
          id: 'settings',
          label: 'Go to Settings',
          icon: 'ri-settings-3-line',
        },
      ],
    },
    {
      label: 'Actions',
      items: [
        {
          id: 'new-deployment',
          label: 'New Deployment',
          icon: 'ri-add-line',
          kbd: ['⌘', 'N'],
        },
        {
          id: 'invite',
          label: 'Invite Member',
          icon: 'ri-user-add-line',
        },
        {
          id: 'copy-id',
          label: 'Copy Project ID',
          icon: 'ri-file-copy-line',
        },
        {
          id: 'toggle-theme',
          label: 'Toggle Theme',
          icon: 'ri-contrast-2-line',
          kbd: ['⌘', '⇧', 'L'],
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          id: 'docs',
          label: 'Open Documentation',
          icon: 'ri-book-open-line',
        },
        {
          id: 'shortcuts',
          label: 'Keyboard Shortcuts',
          icon: 'ri-keyboard-line',
          kbd: ['⌘', '/'],
        },
      ],
    },
  ];

  protected readonly filteredGroups = computed<readonly CommandGroup[]>(() => {
    const q = this.query().trim().toLowerCase();
    return this.groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => !q || it.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  });

  protected readonly flat = computed<readonly Command[]>(() =>
    this.filteredGroups().flatMap((g) => g.items),
  );

  protected readonly activeId = computed(
    () => this.flat()[this.active()]?.id ?? '',
  );

  protected onQuery(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.active.set(0);
  }

  protected setActive(item: Command): void {
    this.active.set(this.flat().indexOf(item));
  }

  protected onKey(e: KeyboardEvent): void {
    const flat = this.flat();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.active.update((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.active.update((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flat[this.active()];
      if (item) this.select(item);
    }
  }

  protected select(item: Command): void {
    this.context.completeWith(item.id);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2 — Type-to-confirm destructive delete. Ship Red used contextually.
// ═══════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-delete-project-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div
        class="flex items-start gap-3 rounded-lg bg-status-negative-pale p-3 text-sm text-status-negative"
      >
        <i
          class="ri-error-warning-line mt-0.5 text-base"
          aria-hidden="true"
        ></i>
        <p class="leading-relaxed">
          This permanently deletes
          <strong class="font-semibold">{{ context.data.projectName }}</strong
          >, its <strong class="font-semibold">14 deployments</strong>, 2
          domains, and every environment variable. This
          <strong class="font-semibold">cannot</strong> be undone.
        </p>
      </div>

      <div class="space-y-1.5">
        <label [attr.for]="inputId" class="block text-sm text-text-secondary">
          Type
          <code
            class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-[13px] text-text-primary"
            >{{ context.data.projectName }}</code
          >
          to confirm.
        </label>
        <input
          [id]="inputId"
          type="text"
          [value]="confirmText()"
          (input)="onInput($event)"
          [class]="s.input"
          [attr.placeholder]="context.data.projectName"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      <footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          [class]="s.btnGhost"
          (click)="context.completeWith(false)"
        >
          Cancel
        </button>
        <button
          type="button"
          [class]="s.btnDanger"
          [disabled]="!canDelete()"
          (click)="context.completeWith(true)"
        >
          <i class="ri-delete-bin-line text-base" aria-hidden="true"></i>
          Delete project
        </button>
      </footer>
    </div>
  `,
})
class DeleteProjectDialogComponent {
  protected readonly s = S;
  // `context` must be public: it is passed to the nxpDialog() factory, whose
  // signature constrains the component to Type<{ context: unknown }> (a public
  // member). The other dialogs open via NxpDynamicComponent and can keep it
  // protected, but this one is routed through the factory.
  readonly context =
    nxpInjectContext<NxpDialogContext<boolean, DeleteProjectData>>();
  protected readonly inputId = `${this.context.id}-confirm`;

  protected readonly confirmText = signal('');
  protected readonly canDelete = computed(
    () => this.confirmText().trim() === this.context.data.projectName,
  );

  protected onInput(e: Event): void {
    this.confirmText.set((e.target as HTMLInputElement).value);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3 — Notes editor whose dismissal is guarded by a nested "Discard?" dialog.
//     Dirtiness is shared back to the opener through a signal in `data`.
// ═══════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-notes-editor-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-text-secondary">
          Shown on every deployment of this project.
        </p>
        @if (dirty()) {
          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-status-warning-pale px-2 py-0.5 text-[11px] font-medium text-status-warning"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-status-warning"></span>
            Unsaved
          </span>
        }
      </div>

      <textarea
        [value]="draft()"
        (input)="onInput($event)"
        rows="5"
        [class]="s.input + ' resize-none font-mono text-[13px] leading-relaxed'"
        placeholder="Write deployment notes…"
      ></textarea>

      <footer class="flex items-center justify-between gap-2">
        <span class="text-[11px] text-text-tertiary">
          Press <kbd [class]="s.kbd">esc</kbd> to discard
        </span>
        <button type="button" [class]="s.btnPrimary" (click)="save()">
          Save changes
        </button>
      </footer>
    </div>
  `,
})
class NotesEditorDialogComponent {
  protected readonly s = S;
  protected readonly context =
    nxpInjectContext<NxpDialogContext<string, EditorData>>();

  protected readonly draft = signal(this.context.data.initial);
  protected readonly dirty = computed(
    () => this.draft() !== this.context.data.initial,
  );

  protected onInput(e: Event): void {
    const value = (e.target as HTMLTextAreaElement).value;
    this.draft.set(value);
    this.context.data.dirty.set(value !== this.context.data.initial);
  }

  protected save(): void {
    this.context.completeWith(this.draft());
  }
}

@Component({
  selector: 'app-discard-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <p class="text-sm leading-relaxed text-text-secondary">
        You have unsaved changes to your deployment notes. If you leave now,
        your edits will be lost.
      </p>
      <footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          [class]="s.btnGhost"
          (click)="context.completeWith(false)"
        >
          Keep editing
        </button>
        <button
          type="button"
          [class]="s.btnDanger"
          (click)="context.completeWith(true)"
        >
          Discard changes
        </button>
      </footer>
    </div>
  `,
})
class DiscardConfirmDialogComponent {
  protected readonly s = S;
  protected readonly context = nxpInjectContext<NxpDialogContext<boolean>>();
}

// ═══════════════════════════════════════════════════════════════════════════
// 4 — Multi-step "Connect a data source" wizard living inside one dialog.
// ═══════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-connect-wizard-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <ol class="flex items-center gap-2" aria-label="Progress">
        @for (st of steps; track st.n; let i = $index) {
          <li class="flex items-center gap-2">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-normal"
              [class.bg-primary]="step() >= i"
              [class.text-text-on-accent]="step() >= i"
              [class.shadow-border]="step() < i"
              [class.text-text-tertiary]="step() < i"
            >
              @if (step() > i) {
                <i class="ri-check-line text-sm" aria-hidden="true"></i>
              } @else {
                {{ st.n }}
              }
            </span>
            <span
              class="text-xs font-medium"
              [class.text-text-primary]="step() === i"
              [class.text-text-tertiary]="step() !== i"
              >{{ st.label }}</span
            >
            @if (i < steps.length - 1) {
              <span class="mx-1 h-px w-6 bg-border-normal"></span>
            }
          </li>
        }
      </ol>

      @switch (step()) {
        @case (0) {
          <div class="grid grid-cols-2 gap-3">
            @for (src of sources; track src.id) {
              <button
                type="button"
                class="flex items-center gap-3 rounded-lg p-3 text-left text-sm transition-shadow duration-fast"
                [class]="
                  source() === src.id
                    ? 'shadow-input-focus'
                    : 'shadow-border hover:shadow-border-light'
                "
                (click)="source.set(src.id)"
              >
                <i
                  [class]="src.icon + ' text-xl text-text-secondary'"
                  aria-hidden="true"
                ></i>
                <span class="min-w-0">
                  <span class="block font-medium text-text-primary">{{
                    src.label
                  }}</span>
                  <span class="block text-[11px] text-text-tertiary">{{
                    src.hint
                  }}</span>
                </span>
              </button>
            }
          </div>
        }
        @case (1) {
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="block text-sm text-text-secondary"
                [attr.for]="id('host')"
                >Host</label
              >
              <input
                [id]="id('host')"
                type="text"
                [value]="host()"
                (input)="setHost($event)"
                [class]="s.input"
                placeholder="db.example.com"
                autocomplete="off"
              />
            </div>
            <div class="space-y-1.5">
              <label
                class="block text-sm text-text-secondary"
                [attr.for]="id('db')"
                >Database</label
              >
              <input
                [id]="id('db')"
                type="text"
                [value]="database()"
                (input)="setDatabase($event)"
                [class]="s.input"
                placeholder="production"
                autocomplete="off"
              />
            </div>
            <button
              type="button"
              class="flex items-center gap-2.5"
              role="switch"
              [attr.aria-checked]="ssl()"
              (click)="ssl.set(!ssl())"
            >
              <span
                class="relative h-5 w-9 rounded-full transition-colors duration-normal"
                [class]="ssl() ? 'bg-primary' : 'bg-bg-neutral-2'"
              >
                <span
                  class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-bg-base shadow-lift transition-transform duration-normal"
                  [class.translate-x-4]="ssl()"
                ></span>
              </span>
              <span class="text-sm text-text-secondary"
                >Require SSL connection</span
              >
            </button>
          </div>
        }
        @case (2) {
          <dl class="divide-y divide-border-normal rounded-lg shadow-border">
            <div class="flex items-center justify-between px-3 py-2.5">
              <dt class="text-sm text-text-tertiary">Source</dt>
              <dd class="text-sm font-medium text-text-primary">
                {{ sourceLabel() }}
              </dd>
            </div>
            <div class="flex items-center justify-between px-3 py-2.5">
              <dt class="text-sm text-text-tertiary">Host</dt>
              <dd class="font-mono text-[13px] text-text-primary">
                {{ host() }}
              </dd>
            </div>
            <div class="flex items-center justify-between px-3 py-2.5">
              <dt class="text-sm text-text-tertiary">Database</dt>
              <dd class="font-mono text-[13px] text-text-primary">
                {{ database() }}
              </dd>
            </div>
            <div class="flex items-center justify-between px-3 py-2.5">
              <dt class="text-sm text-text-tertiary">SSL</dt>
              <dd class="text-sm font-medium text-text-primary">
                {{ ssl() ? 'Enabled' : 'Disabled' }}
              </dd>
            </div>
          </dl>
        }
      }

      <footer class="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          [class]="s.btnGhost"
          [style.visibility]="step() === 0 ? 'hidden' : 'visible'"
          (click)="back()"
        >
          Back
        </button>
        @if (step() < 2) {
          <button
            type="button"
            [class]="s.btnPrimary"
            [disabled]="!canNext()"
            (click)="next()"
          >
            Continue
          </button>
        } @else {
          <button type="button" [class]="s.btnPrimary" (click)="finish()">
            <i class="ri-link text-base" aria-hidden="true"></i>
            Connect
          </button>
        }
      </footer>
    </div>
  `,
})
class ConnectWizardDialogComponent {
  protected readonly s = S;
  protected readonly context =
    nxpInjectContext<NxpDialogContext<ConnectConfig>>();

  protected readonly steps = [
    { n: 1, label: 'Source' },
    { n: 2, label: 'Connect' },
    { n: 3, label: 'Review' },
  ] as const;

  protected readonly sources = [
    {
      id: 'postgres',
      label: 'PostgreSQL',
      hint: 'Relational',
      icon: 'ri-database-2-line',
    },
    {
      id: 'mysql',
      label: 'MySQL',
      hint: 'Relational',
      icon: 'ri-database-line',
    },
    { id: 'mongo', label: 'MongoDB', hint: 'Document', icon: 'ri-leaf-line' },
    {
      id: 'redis',
      label: 'Redis',
      hint: 'Key-value',
      icon: 'ri-flashlight-line',
    },
  ] as const;

  protected readonly step = signal(0);
  protected readonly source = signal('');
  protected readonly host = signal('');
  protected readonly database = signal('');
  protected readonly ssl = signal(true);

  protected readonly sourceLabel = computed(
    () => this.sources.find((s) => s.id === this.source())?.label ?? '—',
  );

  protected readonly canNext = computed(() => {
    if (this.step() === 0) return this.source() !== '';
    if (this.step() === 1)
      return this.host().trim() !== '' && this.database().trim() !== '';
    return true;
  });

  protected id(suffix: string): string {
    return `${this.context.id}-${suffix}`;
  }

  protected setHost(e: Event): void {
    this.host.set((e.target as HTMLInputElement).value);
  }

  protected setDatabase(e: Event): void {
    this.database.set((e.target as HTMLInputElement).value);
  }

  protected back(): void {
    this.step.update((s) => Math.max(0, s - 1));
  }

  protected next(): void {
    this.step.update((s) => Math.min(2, s + 1));
  }

  protected finish(): void {
    this.context.completeWith({
      source: this.source(),
      host: this.host(),
      database: this.database(),
      ssl: this.ssl(),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Showcase page
// ═══════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NxpDialogDirective,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    DialogApiComponent,
  ],
  host: {
    '(document:keydown.meta.k)': 'onMetaK($event)',
    '(document:keydown.control.k)': 'onMetaK($event)',
  },
  template: `
    <nxp-doc-component-page
      header="Dialog"
      package="cdk"
      type="component"
      path="cdk/dialog"
      [tags]="['overlay', 'focus-trap', 'rxjs', 'a11y']"
    >
      <p class="mb-6 text-base text-text-secondary">
        Modal dialogs with a focus trap, dimmed backdrop, staggered enter/leave
        animation, Esc-to-close and click-outside dismissal — opened three ways:
        programmatically through
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >NxpDialogService</code
        >, declaratively with the
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >nxpDialog</code
        >
        structural directive, or as a typed component opener via the
        <code class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-sm"
          >nxpDialog()</code
        >
        factory. Content can be a string, a <code>TemplateRef</code>, or any
        standalone component, and every dialog resolves to a typed
        <code>Observable</code> result.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ── 1. Command menu ─────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Command menu (⌘K)"
          description="A command palette opened as a dialog. The content is a standalone component resolved via NxpDynamicComponent; arrow keys move the selection, ↵ runs it, and the chosen command id returns through context.completeWith(). The appearance:'command' hook removes the dialog's default padding so the search bar sits flush to the frame. Try ⌘K / Ctrl+K anywhere on this page."
          [content]="{ TypeScript: commandTs, HTML: commandHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <button
              type="button"
              [class]="s.btnPrimary"
              (click)="openCommandMenu()"
            >
              <i class="ri-command-line text-base" aria-hidden="true"></i>
              Open command menu
              <span class="ml-1 flex items-center gap-1">
                <kbd [class]="s.kbd">⌘</kbd><kbd [class]="s.kbd">K</kbd>
              </span>
            </button>
            <p class="text-sm text-text-tertiary">
              Last command:
              <code class="font-mono text-text-secondary">{{
                commandResult()
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── 2. Type-to-confirm delete ───────────────────────────────── -->
        <nxp-doc-example
          heading="Type-to-confirm delete"
          description="A destructive dialog where the Delete button stays disabled until you retype the project name. The component injects its context via nxpInjectContext, reads the project name from the data payload, and emits a boolean through completeWith(). Shown opened two equivalent ways — the typed nxpDialog() factory and a raw NxpDialogService.open() call."
          [content]="{ TypeScript: deleteTs, HTML: deleteHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                [class]="s.btnSecondary"
                (click)="openDeleteFactoryClick()"
              >
                <i
                  class="ri-delete-bin-line text-base text-status-negative"
                  aria-hidden="true"
                ></i>
                Delete “acme-marketing-site”
              </button>
              <button
                type="button"
                [class]="s.btnGhost"
                (click)="openDeleteService()"
              >
                Open via service
              </button>
            </div>
            <p class="text-sm text-text-tertiary">
              Result:
              <code class="font-mono text-text-secondary">{{
                deleteResult()
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── 3. Guarded close ────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Guarded close — unsaved changes"
          description="closable and dismissible accept an Observable<boolean>, not just a boolean — return false to veto the close. Here every Esc / × / backdrop attempt is routed through a nested 'Discard changes?' dialog while the editor is dirty. The editor shares its dirty state back to the opener through a signal passed in data. This is the dialog's most powerful, least-known capability."
          [content]="{ TypeScript: editorTs, HTML: editorHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <button type="button" [class]="s.btnPrimary" (click)="openEditor()">
              <i class="ri-edit-line text-base" aria-hidden="true"></i>
              Edit deployment notes
            </button>
            <p class="text-sm text-text-tertiary">
              Outcome:
              <code class="font-mono text-text-secondary">{{
                editorResult()
              }}</code>
              · Saved notes:
              <code class="font-mono text-text-secondary">{{
                notes() || '(empty)'
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── 4. Connect wizard ───────────────────────────────────────── -->
        <nxp-doc-example
          heading="Multi-step connect wizard"
          description="A dialog is a full, stateful surface. This component holds its own step / source / credentials signals, walks through a three-step flow with a progress indicator, and assembles a typed config object returned via completeWith() on the final step."
          [content]="{ TypeScript: wizardTs, HTML: wizardHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <button type="button" [class]="s.btnPrimary" (click)="openWizard()">
              <i class="ri-add-line text-base" aria-hidden="true"></i>
              Connect a data source
            </button>
            <p class="text-sm text-text-tertiary">
              Returned config:
              <code class="font-mono text-text-secondary">{{
                wizardResult()
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── 5. Core API ─────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Core API — service, sizes & required"
          description="The everyday surface: open() with a string body, the three width scales (s = 25rem, m = 37.5rem, l = 50rem), and required:true — which routes a dismissal (Esc / × / backdrop) to the Observable's error channel instead of completing, forcing a deliberate choice."
          [content]="{ TypeScript: coreTs, HTML: coreHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                [class]="s.btnSecondary"
                (click)="openSimple()"
              >
                Simple message
              </button>
              <button
                type="button"
                [class]="s.btnSecondary"
                (click)="openSized('s')"
              >
                Small
              </button>
              <button
                type="button"
                [class]="s.btnSecondary"
                (click)="openSized('m')"
              >
                Medium
              </button>
              <button
                type="button"
                [class]="s.btnSecondary"
                (click)="openSized('l')"
              >
                Large
              </button>
              <button
                type="button"
                [class]="s.btnSecondary"
                (click)="openRequired()"
              >
                Required (blocking)
              </button>
            </div>
            <p class="text-sm text-text-tertiary">
              Approval result:
              <code class="font-mono text-text-secondary">{{
                requiredResult()
              }}</code>
            </p>
          </div>
        </nxp-doc-example>

        <!-- ── 6. Template directive ───────────────────────────────────── -->
        <nxp-doc-example
          heading="Template directive (controlled)"
          description="For inline content without touching the service: declare <ng-template nxpDialog>, two-way bind a boolean signal to control visibility, and pass [nxpDialogOptions] for label, size, etc."
          [content]="{ TypeScript: directiveTs, HTML: directiveHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <button
              type="button"
              [class]="s.btnSecondary"
              (click)="templateOpen.set(true)"
            >
              Open inline dialog
            </button>
            <p class="text-sm text-text-tertiary">
              open =
              <code class="font-mono text-text-secondary">{{
                templateOpen()
              }}</code>
            </p>
          </div>

          <ng-template
            [nxpDialog]="templateOpen()"
            (nxpDialogChange)="templateOpen.set($event)"
            [nxpDialogOptions]="{ label: 'Inline dialog', size: 's' }"
          >
            <p class="text-sm leading-relaxed text-text-secondary">
              Declared with
              <code
                class="rounded-xs bg-bg-neutral-1 px-1 font-mono text-[13px]"
                >&lt;ng-template nxpDialog&gt;</code
              >
              and toggled by a boolean signal — no service needed. Close with ×,
              Esc, or the backdrop.
            </p>
          </ng-template>
        </nxp-doc-example>

        <!-- ── 7. Playground ───────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Configurable playground"
          description="Edit any option in the API tab, then reopen — values persist to the URL query string."
          [content]="{ TypeScript: playgroundTs, HTML: playgroundHtml }"
        >
          <div class="flex flex-col items-start gap-4">
            <p class="text-sm text-text-tertiary">
              <code class="font-mono">label="{{ label() }}"</code> ·
              <code class="font-mono">size="{{ size() }}"</code> ·
              <code class="font-mono">closable={{ closable() }}</code> ·
              <code class="font-mono">dismissible={{ dismissible() }}</code> ·
              <code class="font-mono">required={{ required() }}</code> ·
              <code class="font-mono">appearance="{{ appearance() }}"</code>
            </p>
            <button
              type="button"
              [class]="s.btnPrimary"
              (click)="openConfigurable()"
            >
              Open configured dialog
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
  protected readonly s = S;
  private readonly dialog = inject(NxpDialogService);

  // ── Live result state ─────────────────────────────────────────────────────
  protected readonly menuOpen = signal(false);
  protected readonly commandResult = signal('(none)');
  protected readonly deleteResult = signal('(none)');
  protected readonly editorResult = signal('(none)');
  protected readonly notes = signal('Ship the build before standup.');
  protected readonly wizardResult = signal('(none)');
  protected readonly requiredResult = signal('(none)');
  protected readonly templateOpen = signal(false);

  // ── Playground state — two-way bound into <app-dialog-api> ────────────────
  protected readonly label = signal('Configurable dialog');
  protected readonly size = signal<NxpDialogSize>('m');
  protected readonly closable = signal(true);
  protected readonly dismissible = signal(true);
  protected readonly required = signal(false);
  protected readonly appearance = signal('default');

  // ── Typed factory opener — created once in injection context ──────────────
  private readonly openDelete = nxpDialog<DeleteProjectData, boolean>(
    DeleteProjectDialogComponent,
    { label: 'Delete project', size: 's' },
  );

  // ── 1. Command menu ───────────────────────────────────────────────────────
  protected onMetaK(e: Event): void {
    e.preventDefault();
    this.openCommandMenu();
  }

  protected openCommandMenu(): void {
    if (this.menuOpen()) return;
    this.menuOpen.set(true);
    this.dialog
      .open<string>(new NxpDynamicComponent(CommandMenuDialogComponent), {
        label: '',
        size: 'm',
        appearance: 'command',
        closable: false,
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe({
        next: (id) => this.commandResult.set(id),
        complete: () => this.menuOpen.set(false),
      });
  }

  // ── 2. Type-to-confirm delete ─────────────────────────────────────────────
  protected openDeleteFactoryClick(): void {
    this.settleBool(
      this.openDelete({ projectName: 'acme-marketing-site' }),
      this.deleteResult,
      'deleted',
      'kept',
    );
  }

  protected openDeleteService(): void {
    this.settleBool(
      this.dialog.open<boolean>(
        new NxpDynamicComponent(DeleteProjectDialogComponent),
        {
          label: 'Delete project',
          size: 's',
          data: { projectName: 'billing-dashboard' },
        } as Partial<NxpDialogOptions<DeleteProjectData>>,
      ),
      this.deleteResult,
      'deleted',
      'kept',
    );
  }

  // ── 3. Guarded close ──────────────────────────────────────────────────────
  protected openEditor(): void {
    const dirty = signal(false);
    let saved = false;
    this.dialog
      .open<string>(new NxpDynamicComponent(NotesEditorDialogComponent), {
        label: 'Edit deployment notes',
        size: 'm',
        data: { initial: this.notes(), dirty },
        dismissible: defer(() => (dirty() ? this.confirmDiscard() : of(true))),
        closable: defer(() => (dirty() ? this.confirmDiscard() : of(true))),
      } as Partial<NxpDialogOptions<EditorData>>)
      .subscribe({
        next: (value) => {
          saved = true;
          this.notes.set(value);
          this.editorResult.set('saved');
        },
        complete: () => {
          if (!saved) this.editorResult.set(dirty() ? 'discarded' : 'closed');
        },
      });
  }

  private confirmDiscard(): Observable<boolean> {
    return this.dialog.open<boolean>(
      new NxpDynamicComponent(DiscardConfirmDialogComponent),
      { label: 'Discard changes?', size: 's' },
    );
  }

  // ── 4. Connect wizard ─────────────────────────────────────────────────────
  protected openWizard(): void {
    let done = false;
    this.dialog
      .open<ConnectConfig>(
        new NxpDynamicComponent(ConnectWizardDialogComponent),
        { label: 'Connect a data source', size: 'm' },
      )
      .subscribe({
        next: (cfg) => {
          done = true;
          this.wizardResult.set(
            `${cfg.source} · ${cfg.host}/${cfg.database}${
              cfg.ssl ? ' · ssl' : ''
            }`,
          );
        },
        complete: () => {
          if (!done) this.wizardResult.set('cancelled');
        },
      });
  }

  // ── 5. Core API ───────────────────────────────────────────────────────────
  protected openSimple(): void {
    this.dialog
      .open('A lightweight message dialog with a title and an OK button.', {
        label: 'Heads up',
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }

  protected openSized(size: NxpDialogSize): void {
    this.dialog
      .open(`This dialog uses the ${size} width scale.`, {
        label: `Size — ${size}`,
        size,
      } as Partial<NxpDialogOptions<unknown>>)
      .subscribe();
  }

  protected openRequired(): void {
    this.dialog
      .open(
        'Approve this deployment to production? Dismissing this dialog (Esc / × / backdrop) rejects the action.',
        {
          label: 'Approval required',
          size: 's',
          required: true,
          data: 'Approve',
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe({
        complete: () => this.requiredResult.set('approved'),
        error: () => this.requiredResult.set('rejected'),
      });
  }

  // ── 7. Playground ─────────────────────────────────────────────────────────
  protected openConfigurable(): void {
    this.dialog
      .open(
        'This dialog reflects the options from the API tab. Tweak them and reopen.',
        {
          label: this.label(),
          size: this.size(),
          closable: this.closable(),
          dismissible: this.dismissible(),
          required: this.required(),
          appearance: this.appearance(),
        } as Partial<NxpDialogOptions<unknown>>,
      )
      .subscribe({ error: () => {} });
  }

  // ── Helper — map a boolean dialog result to a status label ────────────────
  private settleBool(
    obs: Observable<boolean>,
    sig: WritableSignal<string>,
    truthy: string,
    falsy: string,
  ): void {
    let emitted = false;
    obs.subscribe({
      next: (v) => {
        emitted = true;
        sig.set(v ? truthy : falsy);
      },
      complete: () => {
        if (!emitted) sig.set('cancelled');
      },
    });
  }

  // ── Source snippets shown inside each <nxp-doc-example> code tab ──────────
  protected readonly commandTs = `import { ChangeDetectionStrategy, Component, computed, signal, ViewEncapsulation } from '@angular/core';
import { type NxpDialogContext } from '@ngxpro/cdk';
import { nxpInjectContext, NxpDynamicComponent } from '@ngxpro/cdk/dynamic';

@Component({
  selector: 'app-command-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // appearance:'command' zeroes the dialog's default 2rem padding
  styles: [\`nxp-dialog[data-appearance='command'] { padding: 0 }\`],
  templateUrl: './command-menu.html',
})
export class CommandMenuDialogComponent {
  readonly context = nxpInjectContext<NxpDialogContext<string>>();
  readonly query = signal('');
  readonly active = signal(0);
  // …filter + ArrowUp/ArrowDown/Enter handling…
  select(id: string): void {
    this.context.completeWith(id); // returns the chosen command id
  }
}

// open it (⌘K):
openCommandMenu(): void {
  this.dialog
    .open<string>(new NxpDynamicComponent(CommandMenuDialogComponent), {
      label: '',
      appearance: 'command',
      closable: false,
    })
    .subscribe((id) => this.commandResult.set(id));
}`;

  protected readonly commandHtml = `<button (click)="openCommandMenu()">
  Open command menu <kbd>⌘</kbd><kbd>K</kbd>
</button>`;

  protected readonly deleteTs = `import { computed, signal } from '@angular/core';
import { nxpDialog, type NxpDialogContext } from '@ngxpro/cdk';
import { nxpInjectContext, NxpDynamicComponent } from '@ngxpro/cdk/dynamic';

interface DeleteProjectData { readonly projectName: string; }

@Component({ /* … */ })
class DeleteProjectDialogComponent {
  readonly context =
    nxpInjectContext<NxpDialogContext<boolean, DeleteProjectData>>();
  readonly confirmText = signal('');
  readonly canDelete = computed(
    () => this.confirmText().trim() === this.context.data.projectName,
  );
}

// 1 — typed factory opener (class field, injection-context aware)
readonly openDelete = nxpDialog<DeleteProjectData, boolean>(
  DeleteProjectDialogComponent,
  { label: 'Delete project', size: 's' },
);
this.openDelete({ projectName: 'acme-marketing-site' })
  .subscribe((deleted) => { /* … */ });

// 2 — the equivalent call straight through the service
this.dialog.open<boolean>(
  new NxpDynamicComponent(DeleteProjectDialogComponent),
  { label: 'Delete project', size: 's', data: { projectName: 'billing-dashboard' } },
).subscribe((deleted) => { /* … */ });`;

  protected readonly deleteHtml = `<input [value]="confirmText()" (input)="onInput($event)" />

<button [disabled]="!canDelete()" (click)="context.completeWith(true)">
  Delete project
</button>
<button (click)="context.completeWith(false)">Cancel</button>`;

  protected readonly editorTs = `import { defer, of, type Observable } from 'rxjs';
import { signal } from '@angular/core';
import { type NxpDialogOptions } from '@ngxpro/cdk';

// closable / dismissible accept Observable<boolean> — emit false to VETO the
// close. Here a nested "Discard changes?" dialog gates every dismiss while the
// editor is dirty. \`defer\` re-runs the guard on each attempt.
openEditor(): void {
  const dirty = signal(false); // shared with the editor via \`data\`
  this.dialog
    .open<string>(new NxpDynamicComponent(NotesEditorDialogComponent), {
      label: 'Edit deployment notes',
      data: { initial: this.notes(), dirty },
      dismissible: defer(() => (dirty() ? this.confirmDiscard() : of(true))),
      closable: defer(() => (dirty() ? this.confirmDiscard() : of(true))),
    } as Partial<NxpDialogOptions<unknown>>)
    .subscribe((saved) => this.notes.set(saved));
}

confirmDiscard(): Observable<boolean> {
  return this.dialog.open<boolean>(
    new NxpDynamicComponent(DiscardConfirmDialogComponent),
    { label: 'Discard changes?', size: 's' },
  );
}`;

  protected readonly editorHtml = `<textarea [value]="draft()" (input)="onInput($event)"></textarea>
<button (click)="save()">Save changes</button>
<!-- Esc / × / backdrop → routed through confirmDiscard() while dirty -->`;

  protected readonly wizardTs = `import { computed, signal } from '@angular/core';
import { type NxpDialogContext } from '@ngxpro/cdk';
import { nxpInjectContext, NxpDynamicComponent } from '@ngxpro/cdk/dynamic';

interface ConnectConfig {
  readonly source: string; readonly host: string;
  readonly database: string; readonly ssl: boolean;
}

@Component({ /* step indicator + @switch (step()) body */ })
class ConnectWizardDialogComponent {
  readonly context = nxpInjectContext<NxpDialogContext<ConnectConfig>>();
  readonly step = signal(0);
  readonly source = signal('');
  // …host, database, ssl signals + canNext()…
  finish(): void {
    this.context.completeWith({
      source: this.source(), host: this.host(),
      database: this.database(), ssl: this.ssl(),
    });
  }
}

// a stateful component is a full dialog surface
this.dialog
  .open<ConnectConfig>(new NxpDynamicComponent(ConnectWizardDialogComponent), {
    label: 'Connect a data source',
  })
  .subscribe((config) => this.wizardResult.set(config));`;

  protected readonly wizardHtml = `<button (click)="openWizard()">Connect a data source</button>`;

  protected readonly coreTs = `import { inject } from '@angular/core';
import { NxpDialogService, type NxpDialogOptions, type NxpDialogSize } from '@ngxpro/cdk';

private readonly dialog = inject(NxpDialogService);

openSimple(): void {
  this.dialog.open('A lightweight message with an OK button.', { label: 'Heads up' }).subscribe();
}

openSized(size: NxpDialogSize): void {
  this.dialog.open(\`This dialog uses the \${size} width scale.\`, { label: \`Size — \${size}\`, size }).subscribe();
}

// required:true → a dismissal (Esc / × / backdrop) ERRORS the stream
openRequired(): void {
  this.dialog
    .open('Approve this deployment? Dismissing rejects it.', {
      label: 'Approval required', required: true, data: 'Approve', size: 's',
    } as Partial<NxpDialogOptions<unknown>>)
    .subscribe({
      complete: () => this.result.set('approved'),
      error: () => this.result.set('rejected'),
    });
}`;

  protected readonly coreHtml = `<button (click)="openSimple()">Simple message</button>
<button (click)="openSized('l')">Large</button>
<button (click)="openRequired()">Required (blocking)</button>`;

  protected readonly directiveTs = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NxpDialogDirective } from '@ngxpro/cdk';

@Component({
  selector: 'app-inline-dialog',
  imports: [NxpDialogDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline-dialog.html',
})
export class InlineDialogExample {
  readonly open = signal(false);
}`;

  protected readonly directiveHtml = `<button (click)="open.set(true)">Open inline dialog</button>

<ng-template
  [nxpDialog]="open()"
  (nxpDialogChange)="open.set($event)"
  [nxpDialogOptions]="{ label: 'Inline dialog', size: 's' }"
>
  <p>Declared inline and toggled by a boolean signal — no service needed.</p>
</ng-template>`;

  protected readonly playgroundTs = `openConfigurable(): void {
  this.dialog
    .open('This dialog reflects the options from the API tab.', {
      label: this.label(),
      size: this.size(),
      closable: this.closable(),
      dismissible: this.dismissible(),
      required: this.required(),
      appearance: this.appearance(),
    } as Partial<NxpDialogOptions<unknown>>)
    .subscribe({ error: () => {} });
}`;

  protected readonly playgroundHtml = `<button (click)="openConfigurable()">Open configured dialog</button>`;
}
