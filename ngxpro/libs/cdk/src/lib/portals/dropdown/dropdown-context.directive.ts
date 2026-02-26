import { DOCUMENT } from '@angular/common';
import { Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY_CLIENT_RECT } from '../../constants';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { nxpTypedFromEvent } from '../../observables/typed-from-event';
import { nxpZoneOptimized } from '../../observables/zone';
import { nxpAsDriver } from '../../classes/driver';
import { nxpAsRectAccessor, NxpRectAccessor } from '../../classes/accessors';
import { filter, merge } from 'rxjs';
import { NxpDropdownDriver } from './dropdown.driver';

function nxpPointToClientRect(x: number, y: number): DOMRect {
  return {
    top: y,
    left: x,
    bottom: y,
    right: x,
    width: 0,
    height: 0,
    x,
    y,
    toJSON: () =>
      JSON.stringify({ top: y, left: x, bottom: y, right: x, width: 0, height: 0 }),
  };
}

/**
 * Directive that opens a dropdown at the right-click context menu position.
 * Replaces the browser's native context menu with a custom dropdown.
 *
 * @example
 * <div [nxpDropdown]="menu" nxpDropdownContext>Right-click me</div>
 */
@Directive({
  selector: '[nxpDropdownContext]',
  providers: [
    NxpActiveZone,
    NxpDropdownDriver,
    nxpAsDriver(NxpDropdownDriver),
    nxpAsRectAccessor(NxpDropdownContext),
  ],
  host: {
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class NxpDropdownContext extends NxpRectAccessor {
  private currentRect = EMPTY_CLIENT_RECT;
  protected readonly activeZone = inject(NxpActiveZone);
  protected readonly driver = inject(NxpDropdownDriver);
  protected readonly doc = inject(DOCUMENT);

  protected readonly sub = merge(
    nxpTypedFromEvent(this.doc, 'pointerdown'),
    nxpTypedFromEvent(this.doc, 'keydown').pipe(filter(({ key }) => key === 'Escape')),
    nxpTypedFromEvent(this.doc, 'contextmenu', { capture: true }),
  )
    .pipe(
      filter(
        (event) =>
          this.driver.value &&
          !this.activeZone.contains(event.composedPath()[0] as Element),
      ),
      nxpZoneOptimized(),
      takeUntilDestroyed(),
    )
    .subscribe(() => {
      this.driver.next(false);
      this.currentRect = EMPTY_CLIENT_RECT;
    });

  public readonly type = 'dropdown';

  public getClientRect(): DOMRect {
    return this.currentRect;
  }

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.currentRect = nxpPointToClientRect(event.clientX, event.clientY);
    this.driver.next(true);
  }
}
