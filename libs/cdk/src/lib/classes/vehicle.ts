import { type ExistingProvider, type Type } from '@angular/core';
import { nxpProvide } from '../utils/provide';

/**
 * Abstract base class for dropdown/overlay vehicle (receiver of driver signals).
 * Implement this to react to open/close state changes from a NxpDriver.
 */
export abstract class NxpVehicle {
  public abstract readonly type: string;
  public abstract toggle(value: boolean): void;
}

/**
 * Creates an ExistingProvider that registers a class as a NxpVehicle.
 */
export function nxpAsVehicle(vehicle: Type<NxpVehicle>): ExistingProvider {
  return nxpProvide(NxpVehicle, vehicle, true);
}
