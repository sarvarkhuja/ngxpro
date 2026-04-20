import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  injectContext,
  PolymorpheusOutlet,
  type PolymorpheusContent,
} from '@taiga-ui/polymorpheus';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { NxpAnimated } from '../../directives/animated.directive';
import { NxpFocusTrap } from '../../directives/focus-trap.directive';
import type { NxpPortalContext } from '../portal';

// ---------------------------------------------------------------------------
// Helper: walk the active-zone tree to find the deepest zone containing `el`
// ---------------------------------------------------------------------------

/**
 * Returns the innermost `NxpActiveZone` that contains the given element,
 * starting from `zone` and recursing into its children.
 * Returns `null` when the element is not within the zone at all.
 */
function findActive(zone: NxpActiveZone, el: Element | null): NxpActiveZone | null {
  if (!el || !zone.contains(el)) {
    return null;
  }

  const active = [...zone.children].find(
    (child) => child.contains(el),
  );

  return active ? findActive(active, el) : zone;
}

/**
 * Returns the currently focused element, piercing shadow DOM boundaries.
 */
function nxpGetFocused(doc: Document): Element | null {
  if (!doc.activeElement?.shadowRoot) {
    return doc.activeElement;
  }

  let element: Element | null = doc.activeElement.shadowRoot.activeElement;

  while (element?.shadowRoot) {
    element = element.shadowRoot.activeElement;
  }

  return element;
}

// ---------------------------------------------------------------------------

/**
 * NxpModalComponent — the rendered panel created by NxpModalService.
 *
 * Uses `NxpFocusTrap` to keep keyboard focus inside the dialog,
 * `NxpActiveZone` to track focus state, and `NxpAnimated` for
 * CSS enter/leave animations.
 *
 * Pattern ported from Taiga UI `TuiModalComponent`.
 */
@Component({
  selector: 'nxp-modal',
  standalone: true,
  imports: [PolymorpheusOutlet],
  template: `
    <div class="nxp-modal-backdrop" aria-hidden="true"></div>
    <div class="nxp-modal-scroll">
      <div class="nxp-modal-content">
        <ng-container *polymorpheusOutlet="component(); context: context" />
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NxpActiveZone, NxpFocusTrap, NxpAnimated],
  host: {
    role: 'dialog',
    class: 'nxp-modal',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'context.id',
  },
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 9999;
        outline: none;
      }
      :host.nxp-enter {
        animation: nxp-modal-fade 0.2s ease-out;
      }
      :host.nxp-leave {
        animation: nxp-modal-fade 0.15s ease-in reverse;
      }
      .nxp-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
      }
      /* Scrollable layer that sits above the backdrop */
      .nxp-modal-scroll {
        position: fixed;
        inset: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      /* Flex wrapper — grows to fill height so the dialog stays centred */
      .nxp-modal-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
      }
      @keyframes nxp-modal-fade {
        from { opacity: 0; transform: scale(0.97) translateY(0.5rem); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
      }
    `,
  ],
})
export class NxpModalComponent<T> implements OnInit, OnDestroy {
  /** The active zone applied to this modal's host element. */
  private readonly current = inject(NxpActiveZone);

  /**
   * The parent active zone (the zone that was active when this modal opened),
   * resolved to the deepest zone that contained the previously focused element.
   * Optional because there may be no parent zone at the root level.
   */
  private readonly parent = (() => {
    const parentZone = inject(NxpActiveZone, { skipSelf: true, optional: true });
    return parentZone
      ? findActive(parentZone, nxpGetFocused(inject(DOCUMENT)))
      : null;
  })();

  readonly context = injectContext<NxpPortalContext<T>>();
  readonly component = signal<PolymorpheusContent<NxpPortalContext<T>> | null>(null);

  public ngOnInit(): void {
    // Wire this modal's zone into the parent zone tree so focus events
    // propagate correctly through nested modal/overlay hierarchies.
    this.current.nxpActiveZoneParent = this.parent;
  }

  public ngOnDestroy(): void {
    this.current.nxpActiveZoneParent = null;
  }
}
