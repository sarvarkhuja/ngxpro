import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';

type Appearance = NxpNotificationOptions['appearance'];
type Position = NxpNotificationOptions['position'];
type Size = NxpNotificationOptions['size'];

interface Scenario {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly icon: string;
  readonly tone: 'emerald' | 'rose' | 'amber' | 'sky' | 'violet';
}

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [RouterModule, FormsModule, NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nxp-notification-host />

    <div
      class="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <!-- ── Header ─────────────────────────────────────────────── -->
        <header class="space-y-4">
          <a
            routerLink="/"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <span aria-hidden="true">←</span> Back to home
          </a>
          <div class="flex items-start justify-between gap-6 flex-wrap">
            <div class="space-y-2">
              <h1
                class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white"
              >
                Alerts
              </h1>
              <p class="text-base text-gray-600 dark:text-gray-400 max-w-xl">
                Programmatic, stackable toasts inspired by Sonner. Hover to
                expand, swipe to dismiss, pause on hover, and pick from six
                positions.
              </p>
            </div>
            <button
              type="button"
              (click)="showHero()"
              class="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Try a toast</span>
              <span
                class="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
                >→</span
              >
            </button>
          </div>
        </header>

        <!-- ── Real-world scenarios ─────────────────────────────── -->
        <section class="space-y-4">
          <div class="flex items-baseline justify-between">
            <h2
              class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Scenarios
            </h2>
            <span class="text-xs text-gray-400 dark:text-gray-500"
              >Click a card to fire</span
            >
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (s of scenarios; track s.key) {
              <button
                type="button"
                (click)="runScenario(s.key)"
                class="group relative text-left p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all"
              >
                <div class="flex items-start gap-3">
                  <span [class]="scenarioIconClass(s.tone)">
                    <i [class]="s.icon" aria-hidden="true"></i>
                  </span>
                  <div class="flex-1 min-w-0 space-y-1">
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ s.title }}
                    </p>
                    <p
                      class="text-xs text-gray-500 dark:text-gray-400 leading-snug"
                    >
                      {{ s.description }}
                    </p>
                  </div>
                </div>
                <p
                  class="mt-3 text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors"
                >
                  {{ s.cta }} →
                </p>
              </button>
            }
          </div>
        </section>

        <!-- ── Promise pattern ──────────────────────────────────── -->
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 space-y-4"
        >
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="space-y-1.5 max-w-md">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Promise pattern
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Show a loading toast that morphs into success or failure.
                Replaces the same toast id, so the visual position is preserved.
              </p>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                (click)="runPromise(true)"
                [disabled]="promiseRunning()"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="ri-cloud-line" aria-hidden="true"></i>
                Upload (succeeds)
              </button>
              <button
                type="button"
                (click)="runPromise(false)"
                [disabled]="promiseRunning()"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="ri-error-warning-line" aria-hidden="true"></i>
                Upload (fails)
              </button>
            </div>
          </div>
        </section>

        <!-- ── Stack & expand ───────────────────────────────────── -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3"
          >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Compressed stack
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Open multiple alerts and they collapse behind the front toast.
              Hover the stack to fan them out, leave to recompress.
            </p>
            <div class="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                (click)="showStack()"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i class="ri-stack-line" aria-hidden="true"></i> Stack 5
              </button>
              <button
                type="button"
                (click)="dismissAll()"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <i class="ri-close-line" aria-hidden="true"></i> Dismiss all
              </button>
            </div>
          </div>

          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3"
          >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Auto-close
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Pauses on hover, resumes on leave. Pass
              <code
                class="text-[11px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >false</code
              >
              to make it sticky.
            </p>
            <div class="flex flex-wrap gap-2 pt-1">
              @for (d of autoCloseOptions; track d.value) {
                <button
                  type="button"
                  (click)="showAutoClose(d.value)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {{ d.label }}
                </button>
              }
            </div>
          </div>
        </section>

        <!-- ── Position picker (visual 3×3) ─────────────────────── -->
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 space-y-5"
        >
          <div class="space-y-1.5">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Position
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Pick an edge or center. Active corner becomes the default for the
              playground below.
            </p>
          </div>
          <div
            class="relative aspect-[16/9] max-w-md mx-auto rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 grid grid-cols-3 grid-rows-2 p-3 gap-3"
          >
            @for (pos of positions; track pos.value) {
              <button
                type="button"
                (click)="selectPosition(pos.value)"
                [attr.aria-pressed]="selectedPosition() === pos.value"
                [class]="positionDotClass(pos.value)"
                [style.grid-column]="pos.col"
                [style.grid-row]="pos.row"
                [attr.aria-label]="pos.value"
              >
                <span
                  class="absolute inset-0 rounded-md ring-0 transition"
                  aria-hidden="true"
                ></span>
                <span class="text-[10px] font-medium tracking-wide">{{
                  pos.label
                }}</span>
              </button>
            }
          </div>
        </section>

        <!-- ── Live playground ──────────────────────────────────── -->
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
        >
          <div
            class="p-6 sm:p-8 space-y-1.5 border-b border-gray-200 dark:border-gray-800"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Playground
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Configure every option and fire.
            </p>
          </div>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800"
          >
            <!-- Controls -->
            <div class="p-6 sm:p-8 space-y-5">
              <div class="space-y-2">
                <label
                  for="play-appearance"
                  class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >Appearance</label
                >
                <div class="flex flex-wrap gap-1.5">
                  @for (a of appearances; track a) {
                    <button
                      type="button"
                      (click)="playAppearance.set(a)"
                      [class]="segmentClass(playAppearance() === a)"
                    >
                      {{ a }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <label
                  class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >Size</label
                >
                <div class="flex gap-1.5">
                  @for (s of sizes; track s) {
                    <button
                      type="button"
                      (click)="playSize.set(s)"
                      [class]="segmentClass(playSize() === s)"
                    >
                      {{ s }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-2">
                <label
                  for="play-label"
                  class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >Label</label
                >
                <input
                  id="play-label"
                  type="text"
                  [ngModel]="playLabel()"
                  (ngModelChange)="playLabel.set($event)"
                  placeholder="Title (optional)"
                  class="w-full px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                />
              </div>

              <div class="space-y-2">
                <label
                  for="play-content"
                  class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >Message</label
                >
                <textarea
                  id="play-content"
                  rows="2"
                  [ngModel]="playContent()"
                  (ngModelChange)="playContent.set($event)"
                  class="w-full px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <label
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    [ngModel]="playClosable()"
                    (ngModelChange)="playClosable.set($event)"
                    class="size-4 rounded border-gray-300 dark:border-gray-700"
                  />
                  Closable
                </label>
                <label
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    [ngModel]="playPersistent()"
                    (ngModelChange)="playPersistent.set($event)"
                    class="size-4 rounded border-gray-300 dark:border-gray-700"
                  />
                  No auto-close
                </label>
              </div>

              @if (!playPersistent()) {
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label
                      for="play-duration"
                      class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >Duration</label
                    >
                    <span
                      class="text-xs font-mono text-gray-500 dark:text-gray-400"
                      >{{ playDuration() / 1000 }}s</span
                    >
                  </div>
                  <input
                    id="play-duration"
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    [ngModel]="playDuration()"
                    (ngModelChange)="playDuration.set(+$event)"
                    class="w-full accent-gray-900 dark:accent-gray-100"
                  />
                </div>
              }
            </div>

            <!-- Preview / Action -->
            <div
              class="p-6 sm:p-8 bg-gray-50 dark:bg-gray-950/40 flex flex-col justify-between gap-6"
            >
              <div class="space-y-3">
                <p
                  class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Preview
                </p>
                <div [class]="previewClasses()">
                  <i
                    [class]="previewIcon() + ' text-xl ' + previewIconClass()"
                    aria-hidden="true"
                  ></i>
                  <div class="flex-1 min-w-0">
                    @if (playLabel()) {
                      <p
                        class="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug"
                      >
                        {{ playLabel() }}
                      </p>
                    }
                    <p
                      class="text-sm text-gray-700 dark:text-gray-300 leading-snug"
                      [class.mt-0.5]="playLabel()"
                    >
                      {{ playContent() || 'Your message goes here.' }}
                    </p>
                  </div>
                  @if (playClosable()) {
                    <i
                      class="ri-close-line text-gray-400 text-sm shrink-0"
                      aria-hidden="true"
                    ></i>
                  }
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  Position:
                  <span class="font-mono text-gray-700 dark:text-gray-300">{{
                    selectedPosition()
                  }}</span>
                </p>
              </div>

              <button
                type="button"
                (click)="firePlayground()"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.99] transition-all shadow-sm"
              >
                <i class="ri-send-plane-line" aria-hidden="true"></i>
                Fire alert
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Templates for rich content -->
    <ng-template #undoTpl>
      <div class="flex items-center justify-between gap-3 w-full">
        <span class="text-sm text-gray-700 dark:text-gray-300"
          >Moved to trash.</span
        >
        <button
          type="button"
          (click)="undoDelete()"
          class="text-xs font-semibold text-gray-900 dark:text-white hover:underline underline-offset-2"
        >
          Undo
        </button>
      </div>
    </ng-template>

    <ng-template #retryTpl>
      <div class="flex items-center justify-between gap-3 w-full">
        <span class="text-sm text-gray-700 dark:text-gray-300"
          >Could not reach server.</span
        >
        <button
          type="button"
          (click)="retryConnection()"
          class="text-xs font-semibold text-gray-900 dark:text-white hover:underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    </ng-template>
  `,
})
export class AlertDemoComponent {
  protected readonly service = inject(NxpNotificationService);

  private readonly undoTpl =
    viewChild.required<TemplateRef<unknown>>('undoTpl');
  private readonly retryTpl =
    viewChild.required<TemplateRef<unknown>>('retryTpl');

  // ── Static option lists ──────────────────────────────────────────────────
  protected readonly appearances: Appearance[] = [
    'info',
    'success',
    'warning',
    'error',
    'neutral',
  ];
  protected readonly sizes: Size[] = ['s', 'm', 'l'];

  protected readonly autoCloseOptions = [
    { value: 2000, label: '2s' },
    { value: 5000, label: '5s' },
    { value: 10000, label: '10s' },
    { value: false as const, label: 'Sticky' },
  ];

  protected readonly positions: ReadonlyArray<{
    value: Position;
    label: string;
    col: string;
    row: string;
  }> = [
    { value: 'top-left', label: 'Top left', col: '1', row: '1' },
    { value: 'top-center', label: 'Top center', col: '2', row: '1' },
    { value: 'top-right', label: 'Top right', col: '3', row: '1' },
    { value: 'bottom-left', label: 'Bottom left', col: '1', row: '2' },
    { value: 'bottom-center', label: 'Bottom center', col: '2', row: '2' },
    { value: 'bottom-right', label: 'Bottom right', col: '3', row: '2' },
  ];

  protected readonly scenarios: readonly Scenario[] = [
    {
      key: 'save',
      title: 'Save changes',
      description: 'Confirms a successful write with a tight success toast.',
      cta: 'Save',
      icon: 'ri-save-line',
      tone: 'emerald',
    },
    {
      key: 'delete',
      title: 'Delete with undo',
      description:
        'Action toast — gives the user a five-second window to revert.',
      cta: 'Delete file',
      icon: 'ri-delete-bin-line',
      tone: 'rose',
    },
    {
      key: 'message',
      title: 'New message',
      description: 'Quiet info toast that fades after a few seconds.',
      cta: 'Receive message',
      icon: 'ri-mail-line',
      tone: 'sky',
    },
    {
      key: 'connection',
      title: 'Connection lost',
      description: 'Error toast with a Retry action — sticky until dismissed.',
      cta: 'Trigger error',
      icon: 'ri-wifi-off-line',
      tone: 'amber',
    },
    {
      key: 'invite',
      title: 'Workspace invite',
      description: 'Two-line toast with a label and a longer description.',
      cta: 'Invite teammate',
      icon: 'ri-user-add-line',
      tone: 'violet',
    },
    {
      key: 'limit',
      title: 'Plan limit',
      description: 'Warning that surfaces a soft, non-blocking constraint.',
      cta: 'Hit the limit',
      icon: 'ri-flashlight-line',
      tone: 'amber',
    },
  ];

  // ── Playground state ────────────────────────────────────────────────────
  protected readonly playAppearance = signal<Appearance>('success');
  protected readonly playSize = signal<Size>('m');
  protected readonly playLabel = signal('All set');
  protected readonly playContent = signal('Your changes have been saved.');
  protected readonly playClosable = signal(true);
  protected readonly playPersistent = signal(false);
  protected readonly playDuration = signal(5000);
  protected readonly selectedPosition = signal<Position>('top-right');

  protected readonly promiseRunning = signal(false);

  // ── Actions ──────────────────────────────────────────────────────────────
  protected showHero(): void {
    this.service.open('Welcome — this is what an alert looks like.', {
      appearance: 'info',
      label: 'Hello there',
      position: this.selectedPosition(),
    });
  }

  protected runScenario(key: string): void {
    switch (key) {
      case 'save':
        this.service.open('Your changes have been saved.', {
          appearance: 'success',
          label: 'Saved',
        });
        break;
      case 'delete':
        this.service.open(this.undoTpl(), {
          appearance: 'neutral',
          label: 'Document deleted',
          autoClose: 5000,
        });
        break;
      case 'message':
        this.service.open('Riley sent you a message in #design.', {
          appearance: 'info',
          icon: 'ri-chat-3-line',
        });
        break;
      case 'connection':
        this.service.open(this.retryTpl(), {
          appearance: 'error',
          label: 'Network error',
          autoClose: false,
        });
        break;
      case 'invite':
        this.service.open(
          'Send an invite to view, comment, or edit this workspace.',
          {
            appearance: 'info',
            label: 'Invite a teammate',
            icon: 'ri-user-add-line',
            autoClose: 7000,
          },
        );
        break;
      case 'limit':
        this.service.open('You are using 9 of 10 projects on the free plan.', {
          appearance: 'warning',
          label: 'Approaching limit',
        });
        break;
    }
  }

  protected runPromise(succeeds: boolean): void {
    this.promiseRunning.set(true);
    this.service.open('Hold tight…', {
      appearance: 'neutral',
      label: 'Uploading report.pdf',
      icon: 'ri-loader-4-line animate-spin',
      autoClose: false,
      closable: false,
    });

    setTimeout(() => {
      this.service.dismissAll();
      // Brief gap so the dismiss animation lands before the new toast.
      setTimeout(() => {
        if (succeeds) {
          this.service.open('report.pdf is now in your library.', {
            appearance: 'success',
            label: 'Upload complete',
          });
        } else {
          this.service.open('We could not finish the upload. Try again.', {
            appearance: 'error',
            label: 'Upload failed',
          });
        }
        this.promiseRunning.set(false);
      }, 220);
    }, 1800);
  }

  protected showStack(): void {
    const palette: Appearance[] = [
      'info',
      'success',
      'warning',
      'error',
      'neutral',
    ];
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
          autoClose: 8000,
          position: this.selectedPosition(),
        });
      }, i * 140);
    });
  }

  protected showAutoClose(value: number | false): void {
    const msg =
      value === false
        ? 'This one stays put. Dismiss it manually.'
        : `Closes in ${value / 1000}s — hover to pause.`;
    this.service.open(msg, {
      appearance: value === false ? 'warning' : 'info',
      label: value === false ? 'Sticky' : `${value / 1000}s`,
      autoClose: value,
      position: this.selectedPosition(),
    });
  }

  protected dismissAll(): void {
    this.service.dismissAll();
  }

  protected selectPosition(pos: Position): void {
    this.selectedPosition.set(pos);
    this.service.open(`Pinned to ${pos}.`, {
      appearance: 'neutral',
      position: pos,
      autoClose: 2200,
      closable: false,
    });
  }

  protected firePlayground(): void {
    this.service.open(this.playContent() || 'Your message goes here.', {
      appearance: this.playAppearance(),
      size: this.playSize(),
      label: this.playLabel() || undefined,
      closable: this.playClosable(),
      autoClose: this.playPersistent() ? false : this.playDuration(),
      position: this.selectedPosition(),
    });
  }

  // ── Action-toast handlers ────────────────────────────────────────────────
  protected undoDelete(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('Restored from trash.', {
        appearance: 'success',
        autoClose: 2500,
      });
    }, 220);
  }

  protected retryConnection(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('You are back online.', {
        appearance: 'success',
        label: 'Reconnected',
        autoClose: 2500,
      });
    }, 220);
  }

  // ── Class helpers ────────────────────────────────────────────────────────
  protected scenarioIconClass(tone: Scenario['tone']): string {
    const map: Record<Scenario['tone'], string> = {
      emerald:
        'inline-flex items-center justify-center size-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-base shrink-0',
      rose: 'inline-flex items-center justify-center size-9 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-base shrink-0',
      amber:
        'inline-flex items-center justify-center size-9 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 text-base shrink-0',
      sky: 'inline-flex items-center justify-center size-9 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 text-base shrink-0',
      violet:
        'inline-flex items-center justify-center size-9 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 text-base shrink-0',
    };
    return map[tone];
  }

  protected positionDotClass(pos: Position): string {
    const isActive = this.selectedPosition() === pos;
    const base =
      'relative flex items-center justify-center rounded-md border text-center transition-all min-h-[36px] px-2 cursor-pointer';
    const placement: Partial<Record<Position, string>> = {
      'top-left': 'self-start justify-self-start',
      'top-center': 'self-start justify-self-center',
      'top-right': 'self-start justify-self-end',
      'bottom-left': 'self-end justify-self-start',
      'bottom-center': 'self-end justify-self-center',
      'bottom-right': 'self-end justify-self-end',
    };
    const state = isActive
      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm'
      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600';
    return `${base} ${placement[pos] ?? ''} ${state}`;
  }

  protected segmentClass(active: boolean): string {
    const base =
      'px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors';
    return active
      ? `${base} bg-gray-900 dark:bg-white text-white dark:text-gray-900`
      : `${base} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`;
  }

  protected previewIcon(): string {
    const map: Record<Appearance, string> = {
      info: 'ri-information-line',
      success: 'ri-checkbox-circle-line',
      warning: 'ri-alert-line',
      error: 'ri-close-circle-line',
      neutral: 'ri-notification-line',
    };
    return map[this.playAppearance()];
  }

  protected previewIconClass(): string {
    const map: Record<Appearance, string> = {
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-emerald-500 dark:text-emerald-400',
      warning: 'text-amber-500 dark:text-amber-400',
      error: 'text-rose-500 dark:text-rose-400',
      neutral: 'text-gray-500 dark:text-gray-400',
    };
    return map[this.playAppearance()];
  }

  protected previewClasses(): string {
    const sizeMap: Record<Size, string> = {
      s: 'p-3 gap-2 text-xs',
      m: 'p-4 gap-3 text-sm',
      l: 'p-5 gap-3 text-base',
    };
    const toneMap: Record<Appearance, string> = {
      info: 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/40',
      success:
        'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40',
      warning:
        'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40',
      error:
        'border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40',
      neutral: 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
    };
    return `relative flex items-start rounded-lg border shadow-sm ${sizeMap[this.playSize()]} ${toneMap[this.playAppearance()]}`;
  }
}
