import { DOCUMENT } from '@angular/common';
import {
  Directive,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { nxpInjectElement } from '../utils/inject-element';

/**
 * NxpActiveZone — tracks focus/click inside a composite zone.
 * Emits `nxpActiveZoneChange` (true = zone active, false = zone left).
 * Can be linked to a parent zone via `nxpActiveZoneParent`.
 */
@Directive({ selector: '[nxpActiveZone]', exportAs: 'nxpActiveZone' })
export class NxpActiveZone implements OnDestroy {
  private readonly el = nxpInjectElement();
  private readonly doc = inject(DOCUMENT);
  private parentZone?: NxpActiveZone;
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

  private readonly onFocusin = (e: FocusEvent) =>
    this.check(e.target as Element | null);

  private readonly onFocusout = (_e: FocusEvent) => {
    setTimeout(() => this.check(this.doc.activeElement));
  };

  constructor() {
    this.el.addEventListener('focusin', this.onFocusin);
    this.el.addEventListener('focusout', this.onFocusout);
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

  ngOnDestroy(): void {
    this.el.removeEventListener('focusin', this.onFocusin);
    this.el.removeEventListener('focusout', this.onFocusout);
    if (this.parentZone) {
      this.parentZone.removeChild(this);
    }
  }
}
