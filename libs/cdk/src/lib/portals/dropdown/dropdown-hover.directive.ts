import { DOCUMENT } from '@angular/common';
import { contentChild, Directive, ElementRef, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { nxpTypedFromEvent } from '../../observables/typed-from-event';
import { nxpZoneOptimized } from '../../observables/zone';
import { nxpAsDriver, NxpDriver } from '../../classes/driver';
import { nxpInjectElement } from '../../utils/inject-element';
import {
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  of,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { NxpDropdownDirective } from './dropdown.directive';
import { NXP_DROPDOWN_HOVER_OPTIONS } from './dropdown-hover.options';
import { NxpDropdownOpen } from './dropdown-open.directive';

/**
 * Directive that adds hover-based open/close behavior to a dropdown host.
 * Configurable show and hide delays to prevent flickering.
 */
@Directive({
  selector: '[nxpDropdownHover]',
  providers: [NxpActiveZone, nxpAsDriver(NxpDropdownHover)],
  host: { '(click.capture)': 'onClick($any($event))' },
})
export class NxpDropdownHover extends NxpDriver {
  private readonly dropdownHost = contentChild('nxpDropdownHost', {
    descendants: true,
    read: ElementRef,
  });
  private hovered = false;
  private readonly el = nxpInjectElement();
  private readonly doc = inject(DOCUMENT);
  private readonly options = inject(NXP_DROPDOWN_HOVER_OPTIONS);
  private readonly activeZone = inject(NxpActiveZone);
  private readonly open = inject(NxpDropdownOpen, { optional: true });

  private readonly stream$ = merge(
    toObservable(inject(NxpDropdownDirective).ref).pipe(
      filter((x) => !x && this.hovered),
      switchMap(() =>
        nxpTypedFromEvent(this.doc, 'pointerdown').pipe(
          map((e) => e.composedPath()[0] as Element),
          delay(this.nxpDropdownHideDelay()),
          startWith(null),
          takeUntil(fromEvent(this.doc, 'mouseover')),
        ),
      ),
    ),
    nxpTypedFromEvent(this.doc, 'mouseover').pipe(map((e) => e.composedPath()[0] as Element)),
    nxpTypedFromEvent(this.doc, 'mouseout').pipe(
      map((e) => e.relatedTarget as Element | null),
    ),
  ).pipe(
    map((element) => !!element && this.isHovered(element as Element)),
    distinctUntilChanged(),
    switchMap((v) =>
      of(v).pipe(delay(v ? this.nxpDropdownShowDelay() : this.nxpDropdownHideDelay())),
    ),
    nxpZoneOptimized(),
    tap((hovered) => {
      this.hovered = hovered;
      this.open?.toggle(hovered);
    }),
    share(),
  );

  public readonly nxpDropdownShowDelay = input(this.options.showDelay);
  public readonly nxpDropdownHideDelay = input(this.options.hideDelay);
  public readonly type = 'dropdown';

  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
  }

  protected onClick(event: MouseEvent): void {
    if (this.hovered && this.open) event.preventDefault();
  }

  private isHovered(element: Element): boolean {
    const host = this.dropdownHost()?.nativeElement || this.el;
    return (
      host.contains(element) ||
      (!this.el.contains(element) && this.activeZone.contains(element))
    );
  }
}
