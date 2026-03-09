import {
  type AfterViewChecked,
  ChangeDetectorRef,
  type ComponentRef,
  computed,
  Directive,
  effect,
  inject,
  INJECTOR,
  input,
  type OnDestroy,
  signal,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PolymorpheusComponent,
  type PolymorpheusContent,
  PolymorpheusTemplate,
} from '@taiga-ui/polymorpheus';
import { Subject, throttleTime } from 'rxjs';
import { nxpZonefreeScheduler } from '../../observables/zone';
import { nxpAsVehicle, NxpVehicle } from '../../classes/vehicle';
import type { NxpRectAccessor } from '../../classes/accessors';
import { NxpPopupService } from '../popup/popup.service';
import { nxpCheckFixedPosition } from '../../utils/check-fixed-position';
import { nxpInjectElement } from '../../utils/inject-element';
import { NxpActiveZone } from '../../directives/active-zone.directive';
import { NxpDropdownDriver, NxpDropdownDriverDirective } from './dropdown.driver';
import { NXP_DROPDOWN_COMPONENT } from './dropdown.providers';
import { NxpDropdownPosition } from './dropdown-position.directive';
import type { NxpContext } from '../../types';

/**
 * Core dropdown directive. Attach to any element to make it a dropdown host.
 * Use `[nxpDropdownOpen]` or `[nxpDropdownManual]` to control visibility.
 *
 * When the dropdown portal is created, its `NxpActiveZone` is registered as a
 * child of the trigger element's `NxpActiveZone`. This keeps the zone "active"
 * while focus moves inside the portal, preventing `NxpDropdownClose` from
 * emitting a close event before the `click` event fires on an option.
 *
 * @example
 * <button [nxpDropdown]="template" [(nxpDropdownOpen)]="open">Open</button>
 */
@Directive({
  selector: '[nxpDropdown]:not(ng-container):not(ng-template)',
  providers: [nxpAsVehicle(NxpDropdownDirective)],
  exportAs: 'nxpDropdown',
  hostDirectives: [
    NxpDropdownDriverDirective,
    { directive: NxpDropdownPosition, outputs: ['nxpDropdownDirectionChange'] },
  ],
  host: { '[class.nxp-dropdown-open]': 'ref()' },
})
export class NxpDropdownDirective
  implements AfterViewChecked, OnDestroy, NxpRectAccessor, NxpVehicle
{
  private readonly refresh$ = new Subject<void>();
  private readonly service = inject(NxpPopupService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly drivers = toArray(
    inject(NxpDropdownDriver, { self: true, optional: true }),
  );
  private readonly activeZone = inject(NxpActiveZone, { optional: true });

  protected readonly sub = this.refresh$
    .pipe(throttleTime(0, nxpZonefreeScheduler()), takeUntilDestroyed())
    .subscribe(() => {
      this.ref()?.changeDetectorRef.detectChanges();
      this.ref()?.changeDetectorRef.markForCheck();
    });

  protected readonly autoClose = effect(() => {
    if (!this.content()) this.toggle(false);
  });

  public readonly ref = signal<ComponentRef<unknown> | null>(null);
  public readonly el = nxpInjectElement();
  public readonly type = 'dropdown';
  public readonly component = new PolymorpheusComponent(
    inject(NXP_DROPDOWN_COMPONENT),
    inject(INJECTOR),
  );

  public readonly nxpDropdown =
    input<PolymorpheusContent<NxpContext<() => void>>>();
  public readonly content = computed<PolymorpheusContent<NxpContext<() => void>>>(
    (content = this.nxpDropdown()) =>
      content instanceof TemplateRef
        ? new PolymorpheusTemplate(content, this.cdr)
        : content,
  );

  public get position(): 'absolute' | 'fixed' {
    return nxpCheckFixedPosition(this.el) ? 'fixed' : 'absolute';
  }

  public ngAfterViewChecked(): void {
    this.refresh$.next();
  }

  public ngOnDestroy(): void {
    this.toggle(false);
  }

  public getClientRect(): DOMRect {
    return this.el.getBoundingClientRect();
  }

  public toggle(show: boolean): void {
    const ref = this.ref();

    if (show && this.content() && !ref) {
      const newRef = this.service.add(this.component);
      this.linkZone(newRef as ComponentRef<unknown>);
      this.ref.set(newRef);
    } else if (!show && ref) {
      this.unlinkZone(ref as ComponentRef<unknown>);
      this.ref.set(null);
      ref.destroy();
    }

    this.cdr.markForCheck();
    this.drivers.forEach((driver) => driver?.next(show));
  }

  /**
   * Registers the portal's `NxpActiveZone` as a child of the trigger's zone
   * so that focus moving into the dropdown panel is treated as still "inside"
   * the active zone — preventing a premature close before `click` fires.
   */
  private linkZone(ref: ComponentRef<unknown>): void {
    const dropdownZone = ref.injector.get(NxpActiveZone, null);
    if (dropdownZone && this.activeZone) {
      this.activeZone.addChild(dropdownZone);
    }
  }

  private unlinkZone(ref: ComponentRef<unknown>): void {
    const dropdownZone = ref.injector.get(NxpActiveZone, null);
    if (dropdownZone && this.activeZone) {
      this.activeZone.removeChild(dropdownZone);
    }
  }
}

function toArray<T>(value: T | T[] | null): T[] {
  if (value === null) return [];
  return Array.isArray(value) ? value : [value];
}
