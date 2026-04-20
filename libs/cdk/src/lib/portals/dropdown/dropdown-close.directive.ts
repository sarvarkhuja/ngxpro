import { DOCUMENT } from '@angular/common';
import { Directive, inject } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { NxpObscured } from '../../directives/obscured.directive';
import { nxpCloseWatcher } from '../../observables/close-watcher';
import { nxpIfMap } from '../../observables/if-map';
import { nxpStopPropagation } from '../../observables/stop-propagation';
import { nxpTypedFromEvent } from '../../observables/typed-from-event';
import { nxpInjectElement } from '../../utils/inject-element';
import { EMPTY, filter, merge } from 'rxjs';
import { NxpDropdownDirective } from './dropdown.directive';
import { NxpDropdownDriver } from './dropdown.driver';
import { NxpDropdownOpen } from './dropdown-open.directive';

/**
 * Directive that handles all close triggers for an open dropdown.
 * Emits `nxpDropdownClose` when the dropdown should close:
 * - Browser CloseWatcher / Escape key
 * - Host element scrolled out of the viewport (obscured)
 * - Focus leaves both the trigger and the dropdown panel (active zone inactive)
 * - `focusin` fires on the host for an element that is not the trigger
 */
@Directive()
export class NxpDropdownClose {
  private readonly el = nxpInjectElement();
  private readonly ref = inject(NxpDropdownDirective).ref;
  private readonly open = inject(NxpDropdownOpen);
  private readonly obscured = inject(NxpObscured);
  private readonly activeZone = inject(NxpActiveZone);

  protected readonly nxpDropdownClose = outputFromObservable(
    merge(
      inject(NxpDropdownDriver).pipe(
        nxpIfMap(() =>
          merge(
            nxpCloseWatcher(),
            this.obscured.nxpObscured$.pipe(filter(Boolean)),
            this.activeZone.nxpActiveZoneChange.pipe(filter((active) => !active)),
            nxpTypedFromEvent(this.el, 'focusin').pipe(
              filter(
                (event) =>
                  !this.open.host.contains(event.target as Element | null) ||
                  !this.ref(),
              ),
            ),
          ),
        ),
      ),
      typeof (globalThis as Record<string, unknown>)['CloseWatcher'] === 'undefined'
        ? nxpTypedFromEvent(inject(DOCUMENT), 'keydown', { capture: true }).pipe(
            filter(
              ({ key }) =>
                key === 'Escape' &&
                this.open.open() &&
                !this.ref()?.location.nativeElement?.nextElementSibling,
            ),
            nxpStopPropagation(),
          )
        : EMPTY,
    ),
  );
}
