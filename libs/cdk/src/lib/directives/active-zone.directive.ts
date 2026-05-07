import {
  DestroyRef,
  Directive,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { NXP_DOCUMENT } from '../tokens';
import { nxpInjectElement } from '../utils/inject-element';

/**
 * NxpActiveZone — tracks focus/click inside a composite zone.
 * Emits `nxpActiveZoneChange` (true = zone active, false = zone left).
 * Can be linked to a parent zone via `nxpActiveZoneParent`. Parent linkage
 * supports both template binding (`[nxpActiveZoneParent]="parent"`) and
 * imperative assignment (used by NxpModal for nested zones).
 */
@Directive({ selector: '[nxpActiveZone]', exportAs: 'nxpActiveZone' })
export class NxpActiveZone {
  private readonly el = nxpInjectElement();
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private parentZone?: NxpActiveZone;
  private destroyed = false;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  readonly children = new Set<NxpActiveZone>();
  private _active = false;

  @Input('nxpActiveZoneParent')
  set nxpActiveZoneParent(parent: NxpActiveZone | null | undefined) {
    if (this.parentZone) {
      this.parentZone.removeChild(this);
    }
    this.parentZone = parent ?? undefined;
    if (this.parentZone) {
      this.parentZone.addChild(this);
    }
  }

  @Output() readonly nxpActiveZoneChange = new EventEmitter<boolean>();

  constructor() {
    const onFocusin = (e: FocusEvent): void =>
      this.check(e.target as Element | null);
    const onFocusout = (_e: FocusEvent): void => {
      this.pendingTimer = setTimeout(() => {
        this.pendingTimer = null;
        if (this.destroyed) return;
        this.check(this.doc.activeElement);
      });
    };
    this.el.addEventListener('focusin', onFocusin);
    this.el.addEventListener('focusout', onFocusout);

    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      if (this.pendingTimer !== null) {
        clearTimeout(this.pendingTimer);
        this.pendingTimer = null;
      }
      this.el.removeEventListener('focusin', onFocusin);
      this.el.removeEventListener('focusout', onFocusout);
      if (this.parentZone) {
        this.parentZone.removeChild(this);
      }
    });
  }

  addChild(zone: NxpActiveZone): void {
    this.children.add(zone);
  }

  removeChild(zone: NxpActiveZone): void {
    this.children.delete(zone);
  }

  contains(element: Element | null): boolean {
    return (
      !!element &&
      (this.el.contains(element) ||
        [...this.children].some((z) => z.contains(element)))
    );
  }

  private check(target: Element | null): void {
    const active = this.contains(target);
    if (active !== this._active) {
      this._active = active;
      this.nxpActiveZoneChange.emit(active);
      this.parentZone?.check(target);
    }
  }
}
