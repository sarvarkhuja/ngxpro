import { DOCUMENT } from '@angular/common';
import {
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { NxpObscured } from '../../directives/obscured.directive';
import { nxpTypedFromEvent } from '../../observables/typed-from-event';
import { nxpInjectElement } from '../../utils/inject-element';
import { nxpIsEditingKey } from '../../utils/editing-key';
import { nxpSetSignal } from '../../utils/set-signal';
import { nxpAsDriver } from '../../classes/driver';
import { filter } from 'rxjs';
import { NxpDropdownDirective } from './dropdown.directive';
import { NxpDropdownDriver } from './dropdown.driver';
import { NxpDropdownClose } from './dropdown-close.directive';

function nxpGetActualTarget(event: Event): Element {
  return (event.composedPath()[0] as Element) ?? (event.target as Element);
}

function nxpIsFocusedIn(element: HTMLElement | null | undefined): boolean {
  return !!element?.matches(':focus-within');
}

function nxpGetClosestFocusable(opts: {
  initial: Element;
  root?: Element;
  previous?: boolean;
}): HTMLElement | null {
  const { initial, root = document.body, previous = false } = opts;
  const focusable =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable]';
  const all = Array.from(root.querySelectorAll<HTMLElement>(focusable));
  const idx = all.indexOf(initial as HTMLElement);
  if (idx === -1)
    return previous ? (all[all.length - 1] ?? null) : (all[0] ?? null);
  return previous ? (all[idx - 1] ?? null) : (all[idx + 1] ?? null);
}

function nxpIsFocusable(element: Element): boolean {
  return (element as HTMLElement).tabIndex >= 0;
}

function nxpIsElementEditable(element: Element): boolean {
  return element.matches(
    'input:not([readonly]),textarea:not([readonly]),[contenteditable="true"]',
  );
}

/**
 * Directive that adds auto open/close behaviour to a dropdown host.
 * Handles click-to-toggle, arrow key navigation, and editing key focus.
 */
@Directive({
  selector:
    '[nxpDropdown][nxpDropdownAuto],[nxpDropdown][nxpDropdownOpen],[nxpDropdown][nxpDropdownOpenChange]',
  providers: [NxpDropdownDriver, nxpAsDriver(NxpDropdownDriver)],
  hostDirectives: [
    NxpObscured,
    { directive: NxpDropdownClose, outputs: ['nxpDropdownClose'] },
    {
      directive: NxpActiveZone,
      inputs: ['nxpActiveZoneParent'],
      outputs: ['nxpActiveZoneChange'],
    },
  ],
  host: {
    '(click)': 'onClick($any($event.target))',
    '(keydown.arrowDown)': 'onArrow($any($event), false)',
    '(keydown.arrowUp)': 'onArrow($any($event), true)',
    '(nxpActiveZoneChange)': '0',
    '(nxpDropdownClose)': 'toggle(false)',
  },
})
export class NxpDropdownOpen {
  private readonly dropdownHost = contentChild('nxpDropdownHost', {
    descendants: true,
    read: ElementRef,
  });
  private readonly directive = inject(NxpDropdownDirective);
  private readonly el = nxpInjectElement();
  private readonly obscured = inject(NxpObscured);
  private readonly driver = inject(NxpDropdownDriver);
  private readonly dropdown = computed(
    () => this.directive.ref()?.location.nativeElement,
  );

  public readonly enabled = input(true);
  public readonly open = model(false);

  protected readonly driveEffect = effect(() => this.drive(this.open()));
  protected readonly syncSub = this.driver
    .pipe(
      filter((open) => open !== this.open()),
      takeUntilDestroyed(),
    )
    .subscribe((open) => this.update(open));

  protected readonly keydownSub = nxpTypedFromEvent(inject(DOCUMENT), 'keydown')
    .pipe(takeUntilDestroyed())
    .subscribe((event) => this.onKeydown(event));

  public get host(): HTMLElement {
    const initial = this.dropdownHost()?.nativeElement ?? this.el;
    const focusable = nxpIsFocusable(initial)
      ? initial
      : nxpGetClosestFocusable({ initial, root: this.el });
    return this.dropdownHost()?.nativeElement ?? focusable ?? this.el;
  }

  public toggle(open: boolean): void {
    if (this.focused && !open) this.host.focus({ preventScroll: true });
    this.update(open);
  }

  protected onClick(target: HTMLElement): void {
    if (!this.editable && this.host.contains(target)) this.update(!this.open());
  }

  protected onArrow(event: KeyboardEvent, up: boolean): void {
    if (
      !this.host.contains(event.target as Element) ||
      !this.enabled() ||
      !this.directive.content()
    )
      return;
    event.preventDefault();
    this.focusDropdown(up);
  }

  private get editable(): boolean {
    return nxpIsElementEditable(this.host);
  }

  private get focused(): boolean {
    return nxpIsFocusedIn(this.host) || nxpIsFocusedIn(this.dropdown());
  }

  private onKeydown(event: KeyboardEvent): void {
    const target = nxpGetActualTarget(event);
    if (
      !event.defaultPrevented &&
      nxpIsEditingKey(event.key) &&
      this.editable &&
      this.focused &&
      target instanceof HTMLElement &&
      !nxpIsElementEditable(target)
    ) {
      this.host.focus({ preventScroll: true });
    }
  }

  private update(open: boolean): void {
    if (open && !this.enabled()) return this.drive();
    this.open.set(open);
    this.drive();
  }

  private drive(open = this.open() && this.enabled()): void {
    nxpSetSignal(this.obscured.nxpObscuredEnabled, open);
    this.driver.next(open);
  }

  private focusDropdown(previous: boolean): void {
    const root = this.dropdown();
    if (!root) {
      this.update(true);
      return;
    }
    const doc = this.el.ownerDocument;
    const child = root.appendChild(doc.createElement('div'));
    const initial = previous ? child : root;
    const focusable = nxpGetClosestFocusable({ initial, previous, root });
    child.remove();
    focusable?.focus();
  }
}
