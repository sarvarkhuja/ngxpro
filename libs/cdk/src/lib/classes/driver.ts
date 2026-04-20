import {
  type AfterViewInit,
  DestroyRef,
  Directive,
  type ExistingProvider,
  inject,
  type Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, merge, Observable } from 'rxjs';
import { nxpProvide } from '../utils/provide';
import { NxpVehicle } from './vehicle';

/**
 * Abstract Observable-based driver that emits boolean open/close signals.
 * Implement this to create custom dropdown trigger strategies.
 */
export abstract class NxpDriver extends Observable<boolean> {
  public abstract readonly type: string;
}

/**
 * Creates an ExistingProvider that registers a class as a NxpDriver.
 */
export function nxpAsDriver(driver: Type<NxpDriver>): ExistingProvider {
  return nxpProvide(NxpDriver, driver, true);
}

/**
 * Abstract directive that wires NxpDrivers to NxpVehicles of the same type.
 */
@Directive()
export abstract class NxpDriverDirective implements AfterViewInit {
  public abstract type: string;

  private readonly destroyRef = inject(DestroyRef);
  private readonly drivers = toArray(inject(NxpDriver, { self: true, optional: true }));
  private readonly vehicles = toArray(inject(NxpVehicle, { self: true, optional: true }));

  public ngAfterViewInit(): void {
    const vehicle = this.vehicles.find(({ type }) => type === this.type);
    merge(...this.drivers.filter(({ type }) => type === this.type))
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => vehicle?.toggle(value));
  }
}

function toArray<T>(value: T | T[] | null): T[] {
  if (value === null) return [];
  return Array.isArray(value) ? value : [value];
}
