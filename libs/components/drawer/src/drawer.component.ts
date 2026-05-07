import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  NxpAnimated,
  NxpFocusTrap,
  NXP_DOCUMENT,
  NXP_IS_BROWSER,
} from '@ngxpro/cdk';

/**
 * Slide-in drawer with proper modal semantics:
 * - `aria-modal="true"` + `role="dialog"` so screen readers announce it
 * - Keyboard focus is trapped inside the drawer while open
 * - Body scroll is locked while the drawer is open (`overlay` mode only)
 * - Escape key closes the drawer (emits `close`)
 * - Focus is restored to the previously focused element on close
 *
 * The host conditionally applies `[nxpFocusTrap]` via `hostDirectives` —
 * always trap when mounted; the parent should *not* render `<nxp-drawer>`
 * unless it is open. Use `*ngIf="open()"` in the consumer to control mount.
 */
@Component({
  selector: 'nxp-drawer',
  standalone: true,
  template: `
    <aside class="nxp-drawer__aside">
      <div class="nxp-drawer__scroll">
        <ng-content select="header" />
        <div class="nxp-drawer__content">
          <ng-content />
        </div>
      </div>
      <ng-content select="footer" />
    </aside>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NxpAnimated, NxpFocusTrap],
  host: {
    class: 'nxp-drawer',
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.data-direction]': 'direction()',
    '[class.nxp-drawer--overlay]': 'overlay()',
    '(keydown.escape)': 'closed.emit()',
  },
  styles: [
    `
      .nxp-drawer {
        position: fixed;
        top: max(3rem, env(safe-area-inset-top));
        bottom: 0;
        inline-size: 36.25rem;
        max-inline-size: calc(100vw - 3rem);
        z-index: 1000;
        border-top-left-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
        overflow: hidden;
      }

      .nxp-drawer[data-direction='start'] {
        inset-inline-start: 0;
        border-start-start-radius: 0;
        transform: translateX(0);
        opacity: 1;
        transition:
          transform 250ms cubic-bezier(0.32, 0.72, 0, 1),
          opacity 250ms cubic-bezier(0.32, 0.72, 0, 1);
      }
      @starting-style {
        .nxp-drawer[data-direction='start'] {
          transform: translateX(-100%);
          opacity: 0;
        }
      }
      .nxp-drawer[data-direction='start'].nxp-leave {
        transform: translateX(-100%);
        opacity: 0;
        transition:
          transform 180ms cubic-bezier(0.4, 0, 1, 1),
          opacity 180ms cubic-bezier(0.4, 0, 1, 1);
      }

      .nxp-drawer[data-direction='end'] {
        inset-inline-end: 0;
        border-start-end-radius: 0;
        transform: translateX(0);
        opacity: 1;
        transition:
          transform 250ms cubic-bezier(0.32, 0.72, 0, 1),
          opacity 250ms cubic-bezier(0.32, 0.72, 0, 1);
      }
      @starting-style {
        .nxp-drawer[data-direction='end'] {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      .nxp-drawer[data-direction='end'].nxp-leave {
        transform: translateX(100%);
        opacity: 0;
        transition:
          transform 180ms cubic-bezier(0.4, 0, 1, 1),
          opacity 180ms cubic-bezier(0.4, 0, 1, 1);
      }

      @media (prefers-reduced-motion: reduce) {
        .nxp-drawer[data-direction='start'],
        .nxp-drawer[data-direction='end'] {
          transform: none;
          transition: opacity 200ms linear;
        }
        .nxp-drawer[data-direction='start'].nxp-leave,
        .nxp-drawer[data-direction='end'].nxp-leave {
          transform: none;
          opacity: 0;
          transition: opacity 150ms linear;
        }
        @starting-style {
          .nxp-drawer[data-direction='start'],
          .nxp-drawer[data-direction='end'] {
            transform: none;
            opacity: 0;
          }
        }
      }

      .nxp-drawer--overlay {
        top: 0;
        border-radius: 0;
      }

      .nxp-drawer--overlay::before {
        content: '';
        position: fixed;
        inset: -100vh -100vw;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
      }

      .nxp-drawer__aside {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: white;
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
        box-sizing: border-box;
        padding-bottom: env(safe-area-inset-bottom);
      }

      :is(.dark) .nxp-drawer__aside {
        background: rgb(17, 24, 39);
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
      }

      .nxp-drawer__scroll {
        flex: 1;
        overflow-y: auto;
        overscroll-behavior: contain;
      }

      .nxp-drawer__content {
        padding: 1.25rem 1.5rem;
      }

      .nxp-drawer__aside > footer {
        display: flex;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        border-top: 1px solid rgb(229, 231, 235);
        background: white;
        overflow-x: auto;
      }

      :is(.dark) .nxp-drawer__aside > footer {
        border-top-color: rgb(55, 65, 81);
        background: rgb(17, 24, 39);
      }

      .nxp-drawer__aside > .nxp-drawer__scroll > header {
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.5rem 1.5rem 0.75rem;
        border-bottom: 1px solid rgb(229, 231, 235);
        background: white;
      }

      :is(.dark) .nxp-drawer__aside > .nxp-drawer__scroll > header {
        border-bottom-color: rgb(55, 65, 81);
        background: rgb(17, 24, 39);
      }
    `,
  ],
})
export class DrawerComponent {
  readonly direction = input<'start' | 'end'>('end');
  readonly overlay = input(false);
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });

  /** Emitted when the user presses Escape. Consumer should toggle mount. */
  readonly closed = output<void>();

  private readonly doc = inject(NXP_DOCUMENT);
  private readonly isBrowser = inject(NXP_IS_BROWSER);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.isBrowser) return;

    // Body scroll lock for overlay mode. Restored on destroy.
    effect((onCleanup) => {
      if (!this.overlay()) return;
      const body = this.doc.body;
      const previous = body.style.overflow;
      body.style.overflow = 'hidden';
      onCleanup(() => {
        body.style.overflow = previous;
      });
    });

    // Defensive: ensure scroll is restored even if effect doesn't fire cleanup.
    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }
}
