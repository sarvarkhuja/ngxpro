import { Directive, Injectable } from '@angular/core';
import { NxpDriver, NxpDriverDirective } from '../../classes/driver';
import { BehaviorSubject } from 'rxjs';

/**
 * Injectable driver for dropdown state (open/close).
 * Extends BehaviorSubject<boolean> and Observable<boolean>.
 */
@Injectable()
export class NxpDropdownDriver extends BehaviorSubject<boolean> implements NxpDriver {
  public readonly type = 'dropdown';
  constructor() {
    super(false);
  }
}

/**
 * Directive that wires NxpDropdownDrivers to NxpDropdownVehicles.
 */
@Directive()
export class NxpDropdownDriverDirective extends NxpDriverDirective {
  public readonly type = 'dropdown';
}
