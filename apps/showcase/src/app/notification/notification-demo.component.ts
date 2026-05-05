import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  InjectionToken,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, take } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  NxpNotificationOptions,
} from '@nxp/cdk';

type Appearance = NxpNotificationOptions['appearance'];

// ─────────────────────────────────────────────────────────────────────────────
// Rich toast bodies — each rendered via PolymorpheusComponent.
// Per-toast data is supplied through dedicated InjectionTokens and a custom
// Injector passed as the 2nd argument of `new PolymorpheusComponent(C, injector)`.
// ─────────────────────────────────────────────────────────────────────────────

interface UndoData {
  readonly filename: string;
  readonly onUndo: () => void;
}
const UNDO_DATA = new InjectionToken<UndoData>('UNDO_DATA');

@Component({
  selector: 'app-undo-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-3 w-full">
      <div class="min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {{ data.filename }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Moved to trash</p>
      </div>
      <button
        type="button"
        (click)="data.onUndo()"
        class="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-gray-900 dark:text-white hover:underline underline-offset-4 decoration-2"
      >
        <i class="ri-arrow-go-back-line" aria-hidden="true"></i> Undo
      </button>
    </div>
  `,
})
class UndoToastComponent {
  protected readonly data = inject(UNDO_DATA);
}

interface UploadData {
  readonly filename: string;
  readonly bytes: number;
}
const UPLOAD_DATA = new InjectionToken<UploadData>('UPLOAD_DATA');

@Component({
  selector: 'app-upload-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-2">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <i class="ri-file-line text-gray-500" aria-hidden="true"></i>
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ data.filename }}
          </p>
        </div>
        <p class="text-xs font-mono tabular-nums text-gray-500 dark:text-gray-400">
          {{ progress() }}%
        </p>
      </div>
      <div class="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div
          class="h-full bg-gray-900 dark:bg-white transition-all duration-200 ease-out"
          [style.width.%]="progress()"
        ></div>
      </div>
      <p class="text-[11px] text-gray-500 dark:text-gray-400">
        {{ uploaded() }} of {{ formatBytes(data.bytes) }}
      </p>
    </div>
  `,
})
class UploadToastComponent {
  protected readonly data = inject(UPLOAD_DATA);
  protected readonly progress = signal(0);

  constructor() {
    interval(120)
      .pipe(take(40), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((tick) => this.progress.set(Math.min((tick + 1) * 2.5, 100)));
  }

  protected uploaded(): string {
    return this.formatBytes((this.data.bytes * this.progress()) / 100);
  }

  protected formatBytes(b: number): string {
    if (b < 1024) return `${b.toFixed(0)} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  }
}

interface MessageData {
  readonly initials: string;
  readonly name: string;
  readonly channel: string;
  readonly preview: string;
  readonly tone: 'rose' | 'sky' | 'violet' | 'emerald';
  readonly onReply: () => void;
}
const MESSAGE_DATA = new InjectionToken<MessageData>('MESSAGE_DATA');

@Component({
  selector: 'app-message-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start gap-3 w-full">
      <div [class]="avatarClasses()">{{ data.initials }}</div>
      <div class="flex-1 min-w-0 space-y-1">
        <p class="text-sm">
          <span class="font-semibold text-gray-900 dark:text-white">{{ data.name }}</span>
          <span class="text-gray-500 dark:text-gray-400"> in </span>
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ data.channel }}</span>
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
          {{ data.preview }}
        </p>
      </div>
      <button
        type="button"
        (click)="data.onReply()"
        class="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <i class="ri-reply-line" aria-hidden="true"></i> Reply
      </button>
    </div>
  `,
})
class MessageToastComponent {
  protected readonly data = inject(MESSAGE_DATA);

  protected avatarClasses(): string {
    const map: Record<MessageData['tone'], string> = {
      rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
      sky: 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
      violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    };
    return `inline-flex items-center justify-center size-9 rounded-full text-xs font-semibold shrink-0 ${map[this.data.tone]}`;
  }
}

interface InviteData {
  readonly inviter: string;
  readonly workspace: string;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
}
const INVITE_DATA = new InjectionToken<InviteData>('INVITE_DATA');

@Component({
  selector: 'app-invite-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-3">
      <div class="space-y-0.5">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          <span class="font-semibold text-gray-900 dark:text-white">{{ data.inviter }}</span>
          invited you to join
        </p>
        <p class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ data.workspace }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          (click)="data.onAccept()"
          class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >Accept</button>
        <button
          type="button"
          (click)="data.onDecline()"
          class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >Decline</button>
      </div>
    </div>
  `,
})
class InviteToastComponent {
  protected readonly data = inject(INVITE_DATA);
}

interface ReleaseData {
  readonly version: string;
  readonly hash: string;
  readonly branch: string;
  readonly onCopy: (hash: string) => void;
}
const RELEASE_DATA = new InjectionToken<ReleaseData>('RELEASE_DATA');

@Component({
  selector: 'app-release-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-2">
      <div class="flex items-center gap-2">
        <i class="ri-rocket-2-line text-emerald-500" aria-hidden="true"></i>
        <p class="text-sm font-semibold text-gray-900 dark:text-white">
          Released {{ data.version }}
        </p>
      </div>
      <div class="flex items-center gap-1.5">
        <code class="font-mono text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {{ data.branch }}
        </code>
        <span class="text-gray-300 dark:text-gray-600">·</span>
        <code class="font-mono text-[11px] text-gray-500 dark:text-gray-400">
          {{ data.hash }}
        </code>
        <button
          type="button"
          (click)="copy()"
          [attr.aria-label]="'Copy ' + data.hash"
          class="ml-auto shrink-0 inline-flex items-center justify-center size-6 rounded text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <i [class]="copied() ? 'ri-check-line' : 'ri-file-copy-line'" class="text-xs" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `,
})
class ReleaseToastComponent {
  protected readonly data = inject(RELEASE_DATA);
  protected readonly copied = signal(false);

  protected copy(): void {
    this.data.onCopy(this.data.hash);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1400);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo page
// ─────────────────────────────────────────────────────────────────────────────

interface RichDemo {
  readonly key: 'undo' | 'upload' | 'message' | 'invite' | 'release';
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly tone: 'emerald' | 'rose' | 'sky' | 'violet' | 'amber';
}

@Component({
  selector: 'app-notification-demo',
  standalone: true,
  imports: [RouterModule, TitleCasePipe, NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-notification-host />

    <div class="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <!-- Header -->
        <header class="space-y-4">
          <a routerLink="/" class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <span aria-hidden="true">←</span> Back to home
          </a>
          <div class="space-y-2 max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Notifications
              </h1>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900">
                <i class="ri-component-line" aria-hidden="true"></i>
                PolymorpheusComponent
              </span>
            </div>
            <p class="text-base text-gray-600 dark:text-gray-400">
              Pass any Angular component as toast content. Each rich body below is a
              standalone <code class="font-mono text-[13px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">PolymorpheusComponent</code>
              with its own state, layout, and actions — provided per-toast via a custom <code class="font-mono text-[13px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Injector</code>.
            </p>
          </div>
        </header>

        <!-- ── Rich component-based toasts ─────────────────────────── -->
        <section class="space-y-4">
          <div class="flex items-baseline justify-between">
            <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Component bodies
            </h2>
            <span class="text-xs text-gray-400 dark:text-gray-500">Click a card to fire</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (d of richDemos; track d.key) {
              <button
                type="button"
                (click)="fireRich(d.key)"
                class="group relative text-left p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all"
              >
                <div class="flex items-start gap-3">
                  <span [class]="iconBadgeClass(d.tone)">
                    <i [class]="d.icon" aria-hidden="true"></i>
                  </span>
                  <div class="flex-1 min-w-0 space-y-1">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ d.title }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-snug">{{ d.description }}</p>
                  </div>
                </div>
                <p class="mt-3 text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  Fire toast →
                </p>
              </button>
            }
          </div>
        </section>

        <!-- ── String vs Component compare ───────────────────────── -->
        <section class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            <div class="p-6 sm:p-8 space-y-4">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">String content</p>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">Plain text body</h3>
              </div>
              <pre class="text-[12px] font-mono leading-relaxed bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto"><code>service.<span class="text-cyan-300">open</span>(<span class="text-emerald-300">'Saved.'</span>, &#123;
  appearance: <span class="text-emerald-300">'success'</span>,
  label: <span class="text-emerald-300">'All done'</span>,
&#125;);</code></pre>
              <button
                type="button"
                (click)="fireString()"
                class="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >Fire string toast</button>
            </div>
            <div class="p-6 sm:p-8 space-y-4 bg-gray-50 dark:bg-gray-950/40">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Component content</p>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">PolymorpheusComponent</h3>
              </div>
              <pre class="text-[12px] font-mono leading-relaxed bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto"><code><span class="text-gray-500">// Per-toast data via custom Injector</span>
<span class="text-purple-300">const</span> injector = Injector.<span class="text-cyan-300">create</span>(&#123;
  parent: <span class="text-purple-300">this</span>.injector,
  providers: [&#123; provide: UNDO_DATA, useValue: data &#125;],
&#125;);

service.<span class="text-cyan-300">open</span>(
  <span class="text-purple-300">new</span> <span class="text-cyan-300">PolymorpheusComponent</span>(UndoToast, injector),
  &#123; appearance: <span class="text-emerald-300">'neutral'</span> &#125;,
);</code></pre>
              <button
                type="button"
                (click)="fireRich('undo')"
                class="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >Fire component toast</button>
            </div>
          </div>
        </section>

        <!-- ── Appearance variants (string content) ─────────────── -->
        <section class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 space-y-4">
          <div class="space-y-1.5">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance & label</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Five built-in appearances, each with its own colour palette and default icon.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            @for (a of appearances; track a) {
              <button
                type="button"
                (click)="fireAppearance(a)"
                [class]="appearancePillClass(a)"
              >{{ a | titlecase }}</button>
            }
          </div>
        </section>

        <!-- ── Sizes & timing & stack ─────────────────────────── -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Sizes</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Compact, default, and roomy.</p>
            <div class="flex gap-1.5 pt-1">
              @for (s of sizes; track s) {
                <button
                  type="button"
                  (click)="fireSize(s)"
                  class="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >{{ s }}</button>
              }
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Auto-close</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pauses on hover, resumes on leave.</p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              @for (d of durations; track d.value) {
                <button
                  type="button"
                  (click)="fireAutoClose(d.value)"
                  class="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >{{ d.label }}</button>
              }
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Stack</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Open many. Hover to expand.</p>
            <div class="flex gap-1.5 pt-1">
              <button
                type="button"
                (click)="fireStack()"
                class="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >Stack 5</button>
              <button
                type="button"
                (click)="dismissAll()"
                class="flex-1 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >Clear</button>
            </div>
          </div>
        </section>

        <!-- ── Positions ─────────────────────────────────────────── -->
        <section class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 space-y-4">
          <div class="space-y-1.5">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Positions</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Six anchor points around the viewport.</p>
          </div>
          <div class="grid grid-cols-3 gap-2">
            @for (p of positions; track p) {
              <button
                type="button"
                (click)="firePosition(p)"
                class="px-3 py-2 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >{{ p }}</button>
            }
          </div>
        </section>

      </div>
    </div>
  `,
})
export class NotificationDemoComponent {
  protected readonly service = inject(NxpNotificationService);
  private readonly injector = inject(Injector);

  // ── Static option lists ──────────────────────────────────────────────────
  protected readonly appearances: Appearance[] = ['info', 'success', 'warning', 'error', 'neutral'];
  protected readonly sizes: NxpNotificationOptions['size'][] = ['s', 'm', 'l'];
  protected readonly positions: NxpNotificationOptions['position'][] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];
  protected readonly durations = [
    { value: 2000, label: '2s' },
    { value: 5000, label: '5s' },
    { value: 10000, label: '10s' },
    { value: false as const, label: 'Sticky' },
  ];

  protected readonly richDemos: readonly RichDemo[] = [
    {
      key: 'undo',
      title: 'Undo action',
      description: 'Custom body with a callback button bound to your handler.',
      icon: 'ri-arrow-go-back-line',
      tone: 'rose',
    },
    {
      key: 'upload',
      title: 'Live progress',
      description: 'Toast holds its own signal-driven state — progress ticks in real time.',
      icon: 'ri-cloud-line',
      tone: 'sky',
    },
    {
      key: 'message',
      title: 'Mention',
      description: 'Avatar + multi-line preview + reply chip in a single component.',
      icon: 'ri-chat-3-line',
      tone: 'violet',
    },
    {
      key: 'invite',
      title: 'Workspace invite',
      description: 'Two-button accept/decline pattern, sticky until the user picks.',
      icon: 'ri-user-add-line',
      tone: 'amber',
    },
    {
      key: 'release',
      title: 'Release shipped',
      description: 'Branch + hash with a copy-to-clipboard interaction.',
      icon: 'ri-rocket-2-line',
      tone: 'emerald',
    },
  ];

  // ── Rich (component) toasts ──────────────────────────────────────────────
  protected fireRich(key: RichDemo['key']): void {
    switch (key) {
      case 'undo':
        this.openUndo();
        break;
      case 'upload':
        this.openUpload();
        break;
      case 'message':
        this.openMessage();
        break;
      case 'invite':
        this.openInvite();
        break;
      case 'release':
        this.openRelease();
        break;
    }
  }

  private openUndo(): void {
    const data: UndoData = {
      filename: 'design-v3.fig',
      onUndo: () => this.handleUndo(),
    };
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: UNDO_DATA, useValue: data }],
    });
    this.service.open(new PolymorpheusComponent(UndoToastComponent, injector), {
      appearance: 'neutral',
      icon: () => '',
      autoClose: 5000,
    });
  }

  private openUpload(): void {
    const data: UploadData = { filename: 'quarterly-report.pdf', bytes: 2_350_000 };
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: UPLOAD_DATA, useValue: data }],
    });
    this.service.open(new PolymorpheusComponent(UploadToastComponent, injector), {
      appearance: 'neutral',
      icon: () => '',
      label: 'Uploading',
      autoClose: false,
    });
  }

  private openMessage(): void {
    const data: MessageData = {
      initials: 'RM',
      name: 'Riley Martinez',
      channel: '#design-system',
      preview: 'Mind taking another pass on the toast spacing? The medium variant feels a touch tight.',
      tone: 'violet',
      onReply: () => this.handleReply(),
    };
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: MESSAGE_DATA, useValue: data }],
    });
    this.service.open(new PolymorpheusComponent(MessageToastComponent, injector), {
      appearance: 'neutral',
      icon: () => '',
      autoClose: 8000,
    });
  }

  private openInvite(): void {
    const data: InviteData = {
      inviter: 'Sam Chen',
      workspace: 'Atlas Design Co.',
      onAccept: () => this.handleAccept(),
      onDecline: () => this.handleDecline(),
    };
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: INVITE_DATA, useValue: data }],
    });
    this.service.open(new PolymorpheusComponent(InviteToastComponent, injector), {
      appearance: 'neutral',
      icon: 'ri-user-add-line',
      autoClose: false,
    });
  }

  private openRelease(): void {
    const data: ReleaseData = {
      version: 'v2.4.0',
      hash: 'a1f3c92',
      branch: 'main',
      onCopy: (h) => this.handleCopy(h),
    };
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: RELEASE_DATA, useValue: data }],
    });
    this.service.open(new PolymorpheusComponent(ReleaseToastComponent, injector), {
      appearance: 'success',
      icon: () => '',
      autoClose: 7000,
    });
  }

  // ── Action handlers (called by rich toast bodies) ───────────────────────
  private handleUndo(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('Restored from trash.', { appearance: 'success', autoClose: 2500 });
    }, 220);
  }

  private handleReply(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('Opening composer…', { appearance: 'info', autoClose: 1800 });
    }, 220);
  }

  private handleAccept(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('Welcome to Atlas Design Co.', {
        appearance: 'success',
        label: 'Joined',
        autoClose: 3000,
      });
    }, 220);
  }

  private handleDecline(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('Invite declined.', { appearance: 'neutral', autoClose: 2200 });
    }, 220);
  }

  private handleCopy(hash: string): void {
    void navigator.clipboard?.writeText(hash);
  }

  // ── Simple string-based demos ────────────────────────────────────────────
  protected fireString(): void {
    this.service.open('Your changes have been saved.', {
      appearance: 'success',
      label: 'All done',
    });
  }

  protected fireAppearance(appearance: Appearance): void {
    const labels: Record<Appearance, string> = {
      info: 'Did you know?',
      success: 'All done',
      warning: 'Heads up',
      error: 'Something broke',
      neutral: 'FYI',
    };
    this.service.open(`This is a ${appearance} notification.`, {
      appearance,
      label: labels[appearance],
    });
  }

  protected fireSize(size: NxpNotificationOptions['size']): void {
    this.service.open(`Size "${size}" — notice the padding and text scale.`, {
      appearance: 'info',
      size,
      label: `Size ${size}`,
    });
  }

  protected fireAutoClose(value: number | false): void {
    const msg = value === false
      ? 'Sticky toast — dismiss it manually.'
      : `Closes in ${value / 1000}s — hover to pause.`;
    this.service.open(msg, {
      appearance: value === false ? 'warning' : 'info',
      label: value === false ? 'Sticky' : `${value / 1000}s`,
      autoClose: value,
    });
  }

  protected firePosition(position: NxpNotificationOptions['position']): void {
    this.service.open(`Pinned to ${position}.`, {
      appearance: 'neutral',
      label: position,
      position,
      autoClose: 2500,
    });
  }

  protected fireStack(): void {
    const palette: Appearance[] = ['info', 'success', 'warning', 'error', 'neutral'];
    const lines = [
      'Build started',
      'Compiled 142 modules',
      'Type-check complete',
      'Bundling assets',
      'Deploy ready',
    ];
    palette.forEach((appearance, i) => {
      setTimeout(() => {
        this.service.open(lines[i], {
          appearance,
          label: `Step ${i + 1} of 5`,
          autoClose: 9000,
        });
      }, i * 140);
    });
  }

  protected dismissAll(): void {
    this.service.dismissAll();
  }

  // ── Class helpers ────────────────────────────────────────────────────────
  protected iconBadgeClass(tone: RichDemo['tone']): string {
    const map: Record<RichDemo['tone'], string> = {
      emerald: 'inline-flex items-center justify-center size-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-base shrink-0',
      rose: 'inline-flex items-center justify-center size-9 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-base shrink-0',
      sky: 'inline-flex items-center justify-center size-9 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 text-base shrink-0',
      violet: 'inline-flex items-center justify-center size-9 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 text-base shrink-0',
      amber: 'inline-flex items-center justify-center size-9 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 text-base shrink-0',
    };
    return map[tone];
  }

  protected appearancePillClass(appearance: Appearance): string {
    const base = 'px-3 py-1.5 rounded-md text-xs font-medium transition-colors';
    const map: Record<Appearance, string> = {
      info: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950',
      success: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950',
      warning: 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950',
      error: 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950',
      neutral: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    };
    return `${base} ${map[appearance]}`;
  }
}
