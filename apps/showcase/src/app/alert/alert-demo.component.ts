import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cx, focusRing } from '@ngxpro/cdk';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';
import { NxpDocComponentPage } from '@ngxpro/addon-doc-lib/component-page';
import { NxpDocExampleComponent } from '@ngxpro/addon-doc-lib/example';
import { AlertApiComponent } from './alert-api.component';

type Appearance = NxpNotificationOptions['appearance'];
type Position = NxpNotificationOptions['position'];
type Size = NxpNotificationOptions['size'];

interface SeverityRow {
  readonly value: Appearance;
  readonly label: string;
  readonly blurb: string;
  readonly live: 'polite' | 'assertive';
}

interface PipelineStep {
  readonly key: string;
  readonly label: string;
  readonly tone: 'develop' | 'preview' | 'ship';
  readonly caption: string;
}

/**
 * Alert / toast documentation page.
 *
 * Built entirely on the Vercel/Geist semantic token system (`text-text-*`,
 * `bg-bg-*`, `status-*`, `accent-*`, `shadow-card`, `tracking-*`, `font-mono`)
 * documented in design-system.md. Those tokens auto-flip in dark mode, so the
 * page carries **no** `dark:` variants — color is functional (severity tints,
 * the Develop → Preview → Ship workflow accents) and the chrome stays
 * achromatic with shadow-as-border depth.
 */
@Component({
  selector: 'app-alert-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NxpNotificationHostComponent,
    NxpDocComponentPage,
    NxpDocExampleComponent,
    AlertApiComponent,
  ],
  template: `
    <nxp-notification-host />

    <nxp-doc-component-page
      header="Alert"
      package="cdk"
      type="component"
      path="cdk/notification"
    >
      <p class="text-base text-text-secondary mb-6">
        Programmatic, stackable toasts inspired by Sonner. Hover to fan the
        stack, swipe to dismiss, pause on hover, and dock to any of six
        positions. Built on
        <code [class]="cls.code">nxp-notification</code>
        rendered through
        <code [class]="cls.code">nxp-notification-host</code>
        and dispatched imperatively via
        <code [class]="cls.code">NxpNotificationService.open()</code>, which
        returns an
        <code [class]="cls.code">Observable&lt;void&gt;</code>
        you can chain off.
      </p>

      <ng-template nxpExamplesTab>
        <!-- ── 1 · First toast ─────────────────────────────────────────── -->
        <nxp-doc-example
          heading="First toast"
          description="The whole API is one call: a message plus an options object. Fires at the position currently selected in the Position example below."
          [content]="{ HTML: heroHtml, TypeScript: heroTs }"
        >
          <div
            class="w-full rounded-xl bg-bg-base shadow-card p-8 flex flex-col items-center text-center gap-4"
          >
            <p [class]="cls.eyebrow">Get started</p>
            <h3
              class="text-2xl font-semibold tracking-card text-text-primary max-w-sm"
            >
              One call. A toast slides in.
            </h3>
            <p class="text-sm text-text-secondary max-w-sm">
              No template, no host wiring at the call site — inject the service
              and call <code [class]="cls.code">open()</code>.
            </p>
            <button type="button" (click)="showHero()" [class]="ctaDark">
              <span>Fire a toast</span>
              <i
                class="ri-arrow-right-line transition-transform duration-normal group-hover:translate-x-0.5"
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── 2 · Severity ────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Severity"
          description="Appearance drives the surface tint, the accent icon, the default glyph, and the ARIA contract — error and warning interrupt assertively, the rest announce politely."
          [content]="{ HTML: severityHtml, TypeScript: severityTs }"
        >
          <div
            class="w-full rounded-xl bg-bg-base shadow-card overflow-hidden divide-y divide-border-normal"
          >
            @for (row of severities; track row.value) {
              <button
                type="button"
                (click)="fireSeverity(row)"
                [class]="severityRowClass"
              >
                <span [class]="severitySwatch(row.value)">
                  <i [class]="appearanceIcon(row.value)" aria-hidden="true"></i>
                </span>
                <span class="flex-1 min-w-0 text-left">
                  <span class="block text-sm font-semibold text-text-primary">
                    {{ row.label }}
                  </span>
                  <span class="block text-xs text-text-secondary truncate">
                    {{ row.blurb }}
                  </span>
                </span>
                <span [class]="cls.eyebrow + ' shrink-0'">
                  aria-live: {{ row.live }}
                </span>
                <i
                  class="ri-arrow-right-up-line text-text-quaternary group-hover:text-text-primary transition-colors duration-normal shrink-0"
                  aria-hidden="true"
                ></i>
              </button>
            }
          </div>
        </nxp-doc-example>

        <!-- ── 3 · Deploy pipeline ─────────────────────────────────────── -->
        <nxp-doc-example
          heading="Deploy pipeline"
          description="The Vercel workflow metaphor, narrated by toasts. Each call's Observable completion sequences the next stage — Develop → Preview → Ship — and the final toast resets the button when it closes."
          [content]="{ HTML: deployHtml, TypeScript: deployTs }"
        >
          <div class="w-full rounded-xl bg-bg-base shadow-card p-6">
            <p [class]="cls.eyebrow">Continuous deployment</p>

            <div class="mt-5 flex items-center">
              @for (step of pipeline; track step.key; let last = $last) {
                <div class="flex items-center gap-3 shrink-0">
                  <span class="relative flex size-2.5">
                    @if (deploying() && activeStage() === step.key) {
                      <span
                        [class]="
                          'absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ' +
                          pipelineDot(step.tone)
                        "
                      ></span>
                    }
                    <span
                      [class]="
                        'relative inline-flex size-2.5 rounded-full ' +
                        pipelineDot(step.tone)
                      "
                    ></span>
                  </span>
                  <div class="leading-tight">
                    <p
                      [class]="
                        'font-mono text-[11px] uppercase tracking-[0.14em] ' +
                        pipelineText(step.tone)
                      "
                    >
                      {{ step.label }}
                    </p>
                    <p class="text-xs text-text-secondary">
                      {{ step.caption }}
                    </p>
                  </div>
                </div>
                @if (!last) {
                  <div class="mx-4 h-px flex-1 bg-border-normal"></div>
                }
              }
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                (click)="runDeploy()"
                [disabled]="deploying()"
                [class]="
                  ctaDark + ' disabled:opacity-50 disabled:cursor-not-allowed'
                "
              >
                <i
                  [class]="
                    deploying()
                      ? 'ri-loader-4-line animate-spin'
                      : 'ri-rocket-2-line'
                  "
                  aria-hidden="true"
                ></i>
                {{ deploying() ? 'Deploying…' : 'Run deploy' }}
              </button>
              <span class="text-xs text-text-tertiary">
                Watch the toasts narrate each stage.
              </span>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── 4 · Rich content ────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Rich content"
          description="content and label accept NxpDynamicContent — a string, a TemplateRef, or a component. Project a TemplateRef to embed avatars, inline actions, and Undo / Retry affordances."
          [content]="{ HTML: richHtml, TypeScript: richTs }"
        >
          <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              (click)="openInvite()"
              [class]="richCardClass"
            >
              <i
                class="ri-user-add-line text-lg text-text-primary"
                aria-hidden="true"
              ></i>
              <span class="block mt-2 text-sm font-semibold text-text-primary">
                Workspace invite
              </span>
              <span class="block text-xs text-text-secondary">
                Avatar + Accept / Decline
              </span>
            </button>
            <button type="button" (click)="openUndo()" [class]="richCardClass">
              <i
                class="ri-delete-bin-line text-lg text-text-primary"
                aria-hidden="true"
              ></i>
              <span class="block mt-2 text-sm font-semibold text-text-primary">
                Delete with undo
              </span>
              <span class="block text-xs text-text-secondary">
                5-second revert window
              </span>
            </button>
            <button type="button" (click)="openRetry()" [class]="richCardClass">
              <i
                class="ri-wifi-off-line text-lg text-text-primary"
                aria-hidden="true"
              ></i>
              <span class="block mt-2 text-sm font-semibold text-text-primary">
                Connection lost
              </span>
              <span class="block text-xs text-text-secondary">
                Sticky error + Retry
              </span>
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── 5 · Async flow ──────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Async flow"
          description="A loading toast auto-closes, and its completion Observable resolves to the result toast — no manual timers to reconcile. Success and failure land in the same spot the spinner left."
          [content]="{ HTML: asyncHtml, TypeScript: asyncTs }"
        >
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              (click)="runSave(true)"
              [disabled]="saving()"
              [class]="
                ctaDark + ' disabled:opacity-50 disabled:cursor-not-allowed'
              "
            >
              <i class="ri-cloud-line" aria-hidden="true"></i>
              Save (succeeds)
            </button>
            <button
              type="button"
              (click)="runSave(false)"
              [disabled]="saving()"
              [class]="
                ctaGhost + ' disabled:opacity-50 disabled:cursor-not-allowed'
              "
            >
              <i class="ri-error-warning-line" aria-hidden="true"></i>
              Save (fails)
            </button>
          </div>
        </nxp-doc-example>

        <!-- ── 6 · Stack & auto-close ──────────────────────────────────── -->
        <nxp-doc-example
          heading="Stack & auto-close"
          description="Open several and they compress behind the front toast — hover the stack to fan them out. autoClose pauses on hover and resumes on leave; pass false to make a toast sticky."
          [content]="{ HTML: stackHtml, TypeScript: stackTs }"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div class="rounded-xl bg-bg-base shadow-card p-6 space-y-3">
              <p [class]="cls.eyebrow">Compressed stack</p>
              <p class="text-sm text-text-secondary">
                Fire five at once, then hover the stack to spread them and leave
                to recompress.
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                <button type="button" (click)="showStack()" [class]="chip">
                  <i class="ri-stack-line" aria-hidden="true"></i> Stack 5
                </button>
                <button
                  type="button"
                  (click)="dismissAll()"
                  [class]="chipGhost"
                >
                  <i class="ri-close-line" aria-hidden="true"></i> Dismiss all
                </button>
              </div>
            </div>

            <div class="rounded-xl bg-bg-base shadow-card p-6 space-y-3">
              <p [class]="cls.eyebrow">Auto-close</p>
              <p class="text-sm text-text-secondary">
                Pass <code [class]="cls.code">false</code> to make it sticky.
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                @for (d of autoCloseOptions; track d.label) {
                  <button
                    type="button"
                    (click)="showAutoClose(d.value)"
                    [class]="chip"
                  >
                    {{ d.label }}
                  </button>
                }
              </div>
            </div>
          </div>
        </nxp-doc-example>

        <!-- ── 7 · Position ────────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Position"
          description="Pick an edge or center. The choice becomes the default for the Playground and every example on this page — and pinning fires a marker toast at the chosen spot."
          [content]="{ HTML: positionHtml, TypeScript: positionTs }"
        >
          <div
            class="relative aspect-[16/9] w-full max-w-md mx-auto rounded-xl bg-bg-neutral-1 shadow-border-light grid grid-cols-3 grid-rows-2 p-3 gap-3"
          >
            <span
              class="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <span [class]="cls.eyebrow">Viewport</span>
            </span>
            @for (pos of positions; track pos.value) {
              <button
                type="button"
                (click)="selectPosition(pos.value)"
                [attr.aria-pressed]="selectedPosition() === pos.value"
                [attr.aria-label]="pos.value"
                [class]="positionDotClass(pos.value)"
                [style.grid-column]="pos.col"
                [style.grid-row]="pos.row"
              >
                <span class="font-mono text-[10px] uppercase tracking-wider">{{
                  pos.label
                }}</span>
              </button>
            }
          </div>
        </nxp-doc-example>

        <!-- ── 8 · Playground ──────────────────────────────────────────── -->
        <nxp-doc-example
          heading="Playground"
          description="Configure everything and fire. The preview is rendered from the exact same tokens as a live toast, so what you see is what dispatches. Drive it from the API tab — values persist to the URL."
          [content]="{ HTML: playgroundHtml, TypeScript: playgroundTs }"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-3">
              <p [class]="cls.eyebrow">Live preview</p>
              <div [class]="previewHostClass()">
                <i
                  [class]="
                    previewIcon() +
                    ' shrink-0 mt-0.5 ' +
                    previewIconSize() +
                    ' ' +
                    previewIconColor()
                  "
                  aria-hidden="true"
                ></i>
                <div class="flex-1 min-w-0">
                  @if (playLabel()) {
                    <p
                      class="font-semibold leading-snug text-text-primary"
                      [class.text-xs]="playSize() === 's'"
                      [class.text-sm]="playSize() === 'm'"
                      [class.text-base]="playSize() === 'l'"
                    >
                      {{ playLabel() }}
                    </p>
                  }
                  <p
                    class="leading-snug text-text-secondary"
                    [class.mt-0.5]="playLabel()"
                    [class.text-xs]="playSize() === 's'"
                    [class.text-sm]="playSize() === 'm'"
                    [class.text-base]="playSize() === 'l'"
                  >
                    {{ playContent() || 'Your message goes here.' }}
                  </p>
                </div>
                @if (playClosable()) {
                  <i
                    class="ri-close-line text-text-tertiary text-sm shrink-0 -mt-0.5 -mr-1"
                    aria-hidden="true"
                  ></i>
                }
              </div>
              <p class="text-xs text-text-tertiary">
                Position:
                <code [class]="cls.code">{{ selectedPosition() }}</code>
              </p>
            </div>

            <div class="flex flex-col justify-end gap-3">
              @if (!playPersistent()) {
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label for="play-duration" [class]="cls.eyebrow"
                      >Duration</label
                    >
                    <span class="font-mono text-xs text-text-secondary"
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
                    (ngModelChange)="setDuration(+$event)"
                    class="w-full accent-primary"
                  />
                </div>
              }
              <label
                class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  [ngModel]="playPersistent()"
                  (ngModelChange)="setPersistent($event)"
                  class="size-4 rounded-xs accent-primary"
                />
                No auto-close (sticky)
              </label>
              <button
                type="button"
                (click)="firePlayground()"
                [class]="ctaDark"
              >
                <i class="ri-send-plane-line" aria-hidden="true"></i>
                Fire alert
              </button>
            </div>
          </div>
        </nxp-doc-example>
      </ng-template>

      <ng-template nxpApiTab>
        <app-alert-api
          [(appearance)]="playAppearance"
          [(size)]="playSize"
          [(position)]="selectedPosition"
          [(label)]="playLabel"
          [(content)]="playContent"
          [(icon)]="playIcon"
          [(closable)]="playClosable"
          [(autoClose)]="playAutoClose"
        />
      </ng-template>
    </nxp-doc-component-page>

    <!-- ── Rich-content templates (NxpDynamicContent) ────────────────────── -->
    <ng-template #inviteTpl>
      <div class="flex items-start gap-3 w-full">
        <span
          class="grid place-items-center size-9 rounded-full bg-bg-neutral-2 text-text-secondary text-xs font-semibold shrink-0"
        >
          RA
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-text-primary leading-snug">
            Riley Adams invited you
          </p>
          <p class="text-xs text-text-secondary">to the “Geist” workspace</p>
          <div class="mt-2 flex gap-2">
            <button
              type="button"
              (click)="respondInvite(true)"
              [class]="inviteAccept"
            >
              Accept
            </button>
            <button
              type="button"
              (click)="respondInvite(false)"
              [class]="inviteDecline"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </ng-template>

    <ng-template #undoTpl>
      <div class="flex items-center justify-between gap-3 w-full">
        <span class="text-sm text-text-secondary">Moved to trash.</span>
        <button type="button" (click)="undoDelete()" [class]="inlineAction">
          Undo
        </button>
      </div>
    </ng-template>

    <ng-template #retryTpl>
      <div class="flex items-center justify-between gap-3 w-full">
        <span class="text-sm text-text-secondary">Could not reach server.</span>
        <button
          type="button"
          (click)="retryConnection()"
          [class]="inlineAction"
        >
          Retry
        </button>
      </div>
    </ng-template>
  `,
})
export class AlertDemoComponent {
  protected readonly service = inject(NxpNotificationService);

  private readonly inviteTpl =
    viewChild.required<TemplateRef<unknown>>('inviteTpl');
  private readonly undoTpl =
    viewChild.required<TemplateRef<unknown>>('undoTpl');
  private readonly retryTpl =
    viewChild.required<TemplateRef<unknown>>('retryTpl');

  // ── Static option lists ──────────────────────────────────────────────────
  protected readonly severities: readonly SeverityRow[] = [
    {
      value: 'info',
      label: 'Info',
      blurb: 'Riley sent you a message in #design.',
      live: 'polite',
    },
    {
      value: 'success',
      label: 'Success',
      blurb: 'Your changes have been saved.',
      live: 'polite',
    },
    {
      value: 'warning',
      label: 'Warning',
      blurb: 'You are using 9 of 10 projects on the free plan.',
      live: 'assertive',
    },
    {
      value: 'error',
      label: 'Error',
      blurb: 'We could not finish the upload. Try again.',
      live: 'assertive',
    },
    {
      value: 'neutral',
      label: 'Neutral',
      blurb: 'A plain card with no severity tint.',
      live: 'polite',
    },
  ];

  protected readonly pipeline: readonly PipelineStep[] = [
    {
      key: 'develop',
      label: 'Develop',
      tone: 'develop',
      caption: 'Compile & type-check',
    },
    {
      key: 'preview',
      label: 'Preview',
      tone: 'preview',
      caption: 'Deploy a preview URL',
    },
    {
      key: 'ship',
      label: 'Ship',
      tone: 'ship',
      caption: 'Promote to production',
    },
  ];

  protected readonly autoCloseOptions: ReadonlyArray<{
    value: number | false;
    label: string;
  }> = [
    { value: 2000, label: '2s' },
    { value: 5000, label: '5s' },
    { value: 10000, label: '10s' },
    { value: false, label: 'Sticky' },
  ];

  protected readonly positions: ReadonlyArray<{
    value: Position;
    label: string;
    col: string;
    row: string;
  }> = [
    { value: 'top-left', label: 'TL', col: '1', row: '1' },
    { value: 'top-center', label: 'TC', col: '2', row: '1' },
    { value: 'top-right', label: 'TR', col: '3', row: '1' },
    { value: 'bottom-left', label: 'BL', col: '1', row: '2' },
    { value: 'bottom-center', label: 'BC', col: '2', row: '2' },
    { value: 'bottom-right', label: 'BR', col: '3', row: '2' },
  ];

  // ── Playground state (shared with the API tab via two-way models) ─────────
  protected readonly playAppearance = signal<Appearance>('success');
  protected readonly playSize = signal<Size>('m');
  protected readonly playLabel = signal('All set');
  protected readonly playContent = signal('Your changes have been saved.');
  protected readonly playIcon = signal('');
  protected readonly playClosable = signal(true);
  // `playAutoClose` is the single source of truth for auto-close behavior;
  // `playDuration` mirrors the numeric value for the slider and
  // `playPersistent` mirrors the `false` (sticky) branch for the checkbox.
  protected readonly playAutoClose = signal<number | false>(5000);
  protected readonly playPersistent = signal(false);
  protected readonly playDuration = signal(5000);
  protected readonly selectedPosition = signal<Position>('top-right');

  // ── Running flags ─────────────────────────────────────────────────────────
  protected readonly deploying = signal(false);
  protected readonly activeStage = signal<string>('');
  protected readonly saving = signal(false);

  // ── Actions ────────────────────────────────────────────────────────────────
  protected showHero(): void {
    this.service.open('Welcome — this is what an alert looks like.', {
      appearance: 'info',
      label: 'Hello there',
      position: this.selectedPosition(),
    });
  }

  protected fireSeverity(row: SeverityRow): void {
    this.service.open(row.blurb, {
      appearance: row.value,
      label: row.label,
      position: this.selectedPosition(),
    });
  }

  /**
   * Sequences three toasts off each call's completion Observable. `open()`
   * resolves when the toast finishes dismissing, so chaining `.subscribe`
   * gives a clean Develop → Preview → Ship narration without nested timers.
   */
  protected runDeploy(): void {
    if (this.deploying()) return;
    this.deploying.set(true);
    const position = this.selectedPosition();

    this.activeStage.set('develop');
    this.service
      .open('Compiling sources & running type-check…', {
        appearance: 'info',
        label: 'Develop',
        icon: 'ri-git-branch-line',
        autoClose: 1500,
        closable: false,
        position,
      })
      .subscribe({
        complete: () => {
          this.activeStage.set('preview');
          this.service
            .open('Preview deployment is live at geist-app.vercel.app.', {
              appearance: 'neutral',
              label: 'Preview',
              icon: 'ri-eye-line',
              autoClose: 1500,
              closable: false,
              position,
            })
            .subscribe({
              complete: () => {
                this.activeStage.set('ship');
                this.service
                  .open('Promoted to production.', {
                    appearance: 'success',
                    label: 'Ship',
                    icon: 'ri-rocket-2-line',
                    autoClose: 4000,
                    position,
                  })
                  .subscribe({
                    complete: () => {
                      this.deploying.set(false);
                      this.activeStage.set('');
                    },
                  });
              },
            });
        },
      });
  }

  protected openInvite(): void {
    this.service.open(this.inviteTpl(), {
      appearance: 'neutral',
      size: 'l',
      icon: 'ri-team-line',
      autoClose: false,
      position: this.selectedPosition(),
    });
  }

  protected respondInvite(accepted: boolean): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open(
        accepted ? 'You joined the “Geist” workspace.' : 'Invite declined.',
        {
          appearance: accepted ? 'success' : 'neutral',
          autoClose: 2500,
          position: this.selectedPosition(),
        },
      );
    }, 220);
  }

  protected openUndo(): void {
    this.service.open(this.undoTpl(), {
      appearance: 'neutral',
      label: 'Document deleted',
      autoClose: 5000,
      position: this.selectedPosition(),
    });
  }

  protected undoDelete(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('Restored from trash.', {
        appearance: 'success',
        autoClose: 2500,
        position: this.selectedPosition(),
      });
    }, 220);
  }

  protected openRetry(): void {
    this.service.open(this.retryTpl(), {
      appearance: 'error',
      label: 'Network error',
      autoClose: false,
      position: this.selectedPosition(),
    });
  }

  protected retryConnection(): void {
    this.service.dismissAll();
    setTimeout(() => {
      this.service.open('You are back online.', {
        appearance: 'success',
        label: 'Reconnected',
        autoClose: 2500,
        position: this.selectedPosition(),
      });
    }, 220);
  }

  /**
   * Loading → result using the completion Observable: the spinner toast
   * auto-closes after 1.6s, and its `complete` callback opens the outcome
   * toast in the same position.
   */
  protected runSave(succeeds: boolean): void {
    if (this.saving()) return;
    this.saving.set(true);
    const position = this.selectedPosition();

    this.service
      .open('Saving changes…', {
        appearance: 'neutral',
        icon: 'ri-loader-4-line animate-spin',
        closable: false,
        autoClose: 1600,
        position,
      })
      .subscribe({
        complete: () => {
          if (succeeds) {
            this.service.open('Your changes are synced.', {
              appearance: 'success',
              label: 'Saved',
              autoClose: 3000,
              position,
            });
          } else {
            this.service.open('Could not save. Check your connection.', {
              appearance: 'error',
              label: 'Sync failed',
              autoClose: false,
              position,
            });
          }
          this.saving.set(false);
        },
      });
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
      icon: this.playIcon() || undefined,
      closable: this.playClosable(),
      autoClose: this.playAutoClose(),
      position: this.selectedPosition(),
    });
  }

  // Keep the slider + checkbox in lockstep with the canonical `playAutoClose`
  // signal that the API tab two-way binds to.
  protected setPersistent(persistent: boolean): void {
    this.playPersistent.set(persistent);
    this.playAutoClose.set(persistent ? false : this.playDuration());
  }

  protected setDuration(ms: number): void {
    this.playDuration.set(ms);
    if (!this.playPersistent()) {
      this.playAutoClose.set(ms);
    }
  }

  // ── Class vocabulary (Vercel/Geist tokens; auto-flip in dark mode) ──────────
  protected readonly cls = {
    eyebrow:
      'font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary',
    code: 'font-mono text-[0.85em] px-1.5 py-0.5 rounded-sm bg-bg-neutral-1 text-text-secondary',
  } as const;

  protected readonly ctaDark = cx(
    'group inline-flex items-center justify-center gap-2 rounded-m px-4 py-2.5',
    'text-sm font-medium bg-primary text-text-on-accent shadow-elevation',
    'hover:bg-primary-hover active:scale-[0.99] transition-all duration-normal',
    ...focusRing,
  );

  protected readonly ctaGhost = cx(
    'inline-flex items-center justify-center gap-2 rounded-m px-3.5 py-2',
    'text-sm font-medium bg-bg-base text-text-primary shadow-border-light',
    'hover:bg-bg-neutral-1 transition-colors duration-normal',
    ...focusRing,
  );

  protected readonly chip = cx(
    'inline-flex items-center gap-1.5 rounded-m px-3 py-1.5 text-xs font-medium',
    'bg-bg-neutral-1 text-text-primary hover:bg-bg-neutral-2 transition-colors duration-normal',
    ...focusRing,
  );

  protected readonly chipGhost = cx(
    'inline-flex items-center gap-1.5 rounded-m px-3 py-1.5 text-xs font-medium',
    'text-text-tertiary hover:text-text-primary transition-colors duration-normal',
    ...focusRing,
  );

  protected readonly severityRowClass = cx(
    'group w-full flex items-center gap-3 px-4 py-3',
    'hover:bg-bg-neutral-1 transition-colors duration-normal',
    'outline-none focus-visible:bg-bg-neutral-1',
  );

  protected readonly richCardClass = cx(
    'group block text-left p-4 rounded-lg bg-bg-base shadow-border',
    'hover:shadow-card-lg transition-shadow duration-normal',
    ...focusRing,
  );

  protected readonly inviteAccept = cx(
    'rounded-sm px-2.5 py-1 text-xs font-medium bg-primary text-text-on-accent',
    'hover:bg-primary-hover transition-colors duration-normal',
    ...focusRing,
  );

  protected readonly inviteDecline = cx(
    'rounded-sm px-2.5 py-1 text-xs font-medium text-text-tertiary',
    'hover:text-text-primary transition-colors duration-normal',
    ...focusRing,
  );

  protected readonly inlineAction = cx(
    'text-xs font-semibold text-text-primary hover:underline underline-offset-2',
    ...focusRing,
  );

  // ── Appearance → token maps (mirror the live notification component) ────────
  private readonly iconMap: Record<Appearance, string> = {
    info: 'ri-information-line',
    success: 'ri-checkbox-circle-line',
    warning: 'ri-alert-line',
    error: 'ri-close-circle-line',
    neutral: 'ri-notification-line',
  };

  private readonly iconColorMap: Record<Appearance, string> = {
    info: 'text-status-info',
    success: 'text-status-positive',
    warning: 'text-status-warning',
    error: 'text-status-negative',
    neutral: 'text-text-tertiary',
  };

  private readonly paleBgMap: Record<Appearance, string> = {
    info: 'bg-status-info-pale',
    success: 'bg-status-positive-pale',
    warning: 'bg-status-warning-pale',
    error: 'bg-status-negative-pale',
    neutral: 'bg-bg-neutral-1',
  };

  protected appearanceIcon(a: Appearance): string {
    return this.iconMap[a];
  }

  protected severitySwatch(a: Appearance): string {
    return cx(
      'grid place-items-center size-9 rounded-lg text-base shrink-0',
      this.paleBgMap[a],
      this.iconColorMap[a],
    );
  }

  protected pipelineDot(tone: PipelineStep['tone']): string {
    return {
      develop: 'bg-accent-develop',
      preview: 'bg-accent-preview',
      ship: 'bg-accent-ship',
    }[tone];
  }

  protected pipelineText(tone: PipelineStep['tone']): string {
    return {
      develop: 'text-accent-develop',
      preview: 'text-accent-preview',
      ship: 'text-accent-ship',
    }[tone];
  }

  protected positionDotClass(pos: Position): string {
    const isActive = this.selectedPosition() === pos;
    const placement: Record<Position, string> = {
      'top-left': 'self-start justify-self-start',
      'top-center': 'self-start justify-self-center',
      'top-right': 'self-start justify-self-end',
      'bottom-left': 'self-end justify-self-start',
      'bottom-center': 'self-end justify-self-center',
      'bottom-right': 'self-end justify-self-end',
    };
    return cx(
      'relative grid place-items-center min-h-9 px-2 rounded-m transition-all duration-normal cursor-pointer',
      placement[pos],
      isActive
        ? 'bg-primary text-text-on-accent shadow-elevation'
        : 'bg-bg-base text-text-tertiary shadow-border hover:text-text-primary',
      ...focusRing,
    );
  }

  // ── Playground preview (pixel-faithful to the real toast) ──────────────────
  protected previewHostClass(): string {
    const size: Record<Size, string> = {
      s: 'p-3 gap-2',
      m: 'p-4 gap-3',
      l: 'p-4 gap-3',
    };
    const appearance: Record<Appearance, string> = {
      info: '[--toast-border:var(--nxp-status-info)] shadow-toast bg-status-info-pale',
      success:
        '[--toast-border:var(--nxp-status-positive)] shadow-toast bg-status-positive-pale',
      warning:
        '[--toast-border:var(--nxp-status-warning)] shadow-toast bg-status-warning-pale',
      error:
        '[--toast-border:var(--nxp-status-negative)] shadow-toast bg-status-negative-pale',
      neutral: 'shadow-card-lg bg-bg-base',
    };
    return cx(
      'relative flex items-start rounded-lg w-full max-w-sm',
      size[this.playSize()],
      appearance[this.playAppearance()],
    );
  }

  protected previewIcon(): string {
    return this.playIcon() || this.iconMap[this.playAppearance()];
  }

  protected previewIconColor(): string {
    return this.iconColorMap[this.playAppearance()];
  }

  protected previewIconSize(): string {
    return { s: 'text-base', m: 'text-xl', l: 'text-2xl' }[this.playSize()];
  }

  // ── Example source snippets shown inside <nxp-doc-example> tabs ──────────
  readonly heroHtml = `<nxp-notification-host />

<button type="button" (click)="showHero()">Fire a toast</button>`;

  readonly heroTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
} from '@ngxpro/cdk/components/notification';

@Component({
  selector: 'app-hero',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
})
export class HeroAlertExample {
  protected readonly service = inject(NxpNotificationService);

  protected showHero(): void {
    this.service.open('Welcome — this is what an alert looks like.', {
      appearance: 'info',
      label: 'Hello there',
      position: 'top-right',
    });
  }
}`;

  readonly severityHtml = `<nxp-notification-host />

@for (row of severities; track row.value) {
  <button type="button" (click)="fireSeverity(row)">{{ row.label }}</button>
}`;

  readonly severityTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';

type Appearance = NxpNotificationOptions['appearance'];

@Component({
  selector: 'app-severity',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './severity.html',
})
export class SeverityAlertExample {
  protected readonly service = inject(NxpNotificationService);

  // appearance drives the surface tint, the accent icon, the default glyph,
  // and the role / aria-live contract (error & warning are assertive).
  protected readonly severities: { value: Appearance; label: string; blurb: string }[] = [
    { value: 'info', label: 'Info', blurb: 'Riley sent you a message in #design.' },
    { value: 'success', label: 'Success', blurb: 'Your changes have been saved.' },
    { value: 'warning', label: 'Warning', blurb: 'You are using 9 of 10 projects.' },
    { value: 'error', label: 'Error', blurb: 'We could not finish the upload.' },
    { value: 'neutral', label: 'Neutral', blurb: 'A plain card with no tint.' },
  ];

  protected fireSeverity(row: { value: Appearance; label: string; blurb: string }): void {
    this.service.open(row.blurb, { appearance: row.value, label: row.label });
  }
}`;

  readonly deployHtml = `<nxp-notification-host />

<button type="button" (click)="runDeploy()" [disabled]="deploying()">
  Run deploy
</button>`;

  readonly deployTs = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
} from '@ngxpro/cdk/components/notification';

@Component({
  selector: 'app-deploy',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deploy.html',
})
export class DeployAlertExample {
  protected readonly service = inject(NxpNotificationService);
  protected readonly deploying = signal(false);

  // open() returns an Observable<void> that completes once the toast is fully
  // dismissed — chain the completions to sequence Develop → Preview → Ship.
  protected runDeploy(): void {
    if (this.deploying()) return;
    this.deploying.set(true);

    this.service
      .open('Compiling sources & running type-check…', {
        appearance: 'info', label: 'Develop', icon: 'ri-git-branch-line',
        autoClose: 1500, closable: false,
      })
      .subscribe({ complete: () =>
        this.service
          .open('Preview deployment is live at geist-app.vercel.app.', {
            appearance: 'neutral', label: 'Preview', icon: 'ri-eye-line',
            autoClose: 1500, closable: false,
          })
          .subscribe({ complete: () =>
            this.service
              .open('Promoted to production.', {
                appearance: 'success', label: 'Ship', icon: 'ri-rocket-2-line',
                autoClose: 4000,
              })
              .subscribe({ complete: () => this.deploying.set(false) }),
          }),
      });
  }
}`;

  readonly richHtml = `<nxp-notification-host />

<button type="button" (click)="openInvite()">Workspace invite</button>

<!-- Project a TemplateRef as the toast content -->
<ng-template #inviteTpl>
  <div class="flex items-start gap-3 w-full">
    <span class="avatar">RA</span>
    <div class="flex-1 min-w-0">
      <p class="title">Riley Adams invited you</p>
      <p class="subtitle">to the “Geist” workspace</p>
      <div class="actions">
        <button (click)="respondInvite(true)">Accept</button>
        <button (click)="respondInvite(false)">Decline</button>
      </div>
    </div>
  </div>
</ng-template>`;

  readonly richTs = `import { ChangeDetectionStrategy, Component, inject, viewChild, TemplateRef } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
} from '@ngxpro/cdk/components/notification';

@Component({
  selector: 'app-rich',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich.html',
})
export class RichAlertExample {
  protected readonly service = inject(NxpNotificationService);
  private readonly inviteTpl = viewChild.required<TemplateRef<unknown>>('inviteTpl');

  // content / label accept NxpDynamicContent: string | TemplateRef | component.
  protected openInvite(): void {
    this.service.open(this.inviteTpl(), {
      appearance: 'neutral',
      size: 'l',
      autoClose: false,
    });
  }

  protected respondInvite(accepted: boolean): void {
    this.service.dismissAll();
    this.service.open(accepted ? 'You joined the workspace.' : 'Invite declined.', {
      appearance: accepted ? 'success' : 'neutral',
      autoClose: 2500,
    });
  }
}`;

  readonly asyncHtml = `<nxp-notification-host />

<button (click)="runSave(true)" [disabled]="saving()">Save (succeeds)</button>
<button (click)="runSave(false)" [disabled]="saving()">Save (fails)</button>`;

  readonly asyncTs = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
} from '@ngxpro/cdk/components/notification';

@Component({
  selector: 'app-async',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './async.html',
})
export class AsyncAlertExample {
  protected readonly service = inject(NxpNotificationService);
  protected readonly saving = signal(false);

  runSave(succeeds: boolean): void {
    if (this.saving()) return;
    this.saving.set(true);

    // The spinner toast auto-closes after 1.6s; its completion resolves to the
    // outcome toast — no second timer to reconcile.
    this.service
      .open('Saving changes…', {
        appearance: 'neutral',
        icon: 'ri-loader-4-line animate-spin',
        closable: false,
        autoClose: 1600,
      })
      .subscribe({ complete: () => {
        if (succeeds) {
          this.service.open('Your changes are synced.', {
            appearance: 'success', label: 'Saved', autoClose: 3000,
          });
        } else {
          this.service.open('Could not save. Check your connection.', {
            appearance: 'error', label: 'Sync failed', autoClose: false,
          });
        }
        this.saving.set(false);
      }});
  }
}`;

  readonly stackHtml = `<nxp-notification-host />

<button type="button" (click)="showStack()">Stack 5</button>
<button type="button" (click)="service.dismissAll()">Dismiss all</button>

@for (d of autoCloseOptions; track d.label) {
  <button type="button" (click)="showAutoClose(d.value)">{{ d.label }}</button>
}`;

  readonly stackTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';

type Appearance = NxpNotificationOptions['appearance'];

@Component({
  selector: 'app-stack',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.html',
})
export class StackAlertExample {
  protected readonly service = inject(NxpNotificationService);

  protected readonly autoCloseOptions = [
    { value: 2000, label: '2s' },
    { value: 5000, label: '5s' },
    { value: 10000, label: '10s' },
    { value: false as const, label: 'Sticky' },
  ];

  protected showStack(): void {
    const palette: Appearance[] = ['info', 'success', 'warning', 'error', 'neutral'];
    const lines = ['Build started', 'Compiled 142 modules', 'Type-check complete', 'Bundling assets', 'Deploy ready'];
    palette.forEach((appearance, i) => {
      setTimeout(() => {
        this.service.open(lines[i], { appearance, label: \`Step \${i + 1} of 5\`, autoClose: 8000 });
      }, i * 140);
    });
  }

  protected showAutoClose(value: number | false): void {
    const msg = value === false ? 'This one stays put.' : \`Closes in \${value / 1000}s.\`;
    this.service.open(msg, { appearance: value === false ? 'warning' : 'info', autoClose: value });
  }
}`;

  readonly positionHtml = `<nxp-notification-host />

@for (pos of positions; track pos.value) {
  <button type="button" (click)="selectPosition(pos.value)">{{ pos.label }}</button>
}`;

  readonly positionTs = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';

type Position = NxpNotificationOptions['position'];

@Component({
  selector: 'app-position',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './position.html',
})
export class PositionAlertExample {
  protected readonly service = inject(NxpNotificationService);
  protected readonly selectedPosition = signal<Position>('top-right');

  protected readonly positions: { value: Position; label: string }[] = [
    { value: 'top-left', label: 'TL' },
    { value: 'top-center', label: 'TC' },
    { value: 'top-right', label: 'TR' },
    { value: 'bottom-left', label: 'BL' },
    { value: 'bottom-center', label: 'BC' },
    { value: 'bottom-right', label: 'BR' },
  ];

  protected selectPosition(pos: Position): void {
    this.selectedPosition.set(pos);
    this.service.open(\`Pinned to \${pos}.\`, {
      appearance: 'neutral', position: pos, autoClose: 2200, closable: false,
    });
  }
}`;

  readonly playgroundHtml = `<nxp-notification-host />

<button type="button" (click)="firePlayground()">Fire alert</button>`;

  readonly playgroundTs = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NxpNotificationHostComponent,
  NxpNotificationService,
  type NxpNotificationOptions,
} from '@ngxpro/cdk/components/notification';

type Appearance = NxpNotificationOptions['appearance'];
type Position = NxpNotificationOptions['position'];
type Size = NxpNotificationOptions['size'];

@Component({
  selector: 'app-playground',
  imports: [NxpNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
})
export class PlaygroundAlertExample {
  protected readonly service = inject(NxpNotificationService);

  protected readonly playAppearance = signal<Appearance>('success');
  protected readonly playSize = signal<Size>('m');
  protected readonly playLabel = signal('All set');
  protected readonly playContent = signal('Your changes have been saved.');
  protected readonly playIcon = signal('');
  protected readonly playClosable = signal(true);
  protected readonly playPersistent = signal(false);
  protected readonly playDuration = signal(5000);
  protected readonly selectedPosition = signal<Position>('top-right');

  protected firePlayground(): void {
    this.service.open(this.playContent() || 'Your message goes here.', {
      appearance: this.playAppearance(),
      size: this.playSize(),
      label: this.playLabel() || undefined,
      icon: this.playIcon() || undefined,
      closable: this.playClosable(),
      autoClose: this.playPersistent() ? false : this.playDuration(),
      position: this.selectedPosition(),
    });
  }
}`;
}
