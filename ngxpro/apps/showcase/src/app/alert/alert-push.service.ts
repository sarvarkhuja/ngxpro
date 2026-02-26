import { Injectable } from '@angular/core';
import { NxpAlertService, type NxpPositionOptions } from '@nxp/cdk';
import { AlertPushComponent } from './alert-push.component';

/**
 * Concrete alert service for showcase. Renders AlertPushComponent with concurrency 3.
 */
@Injectable({ providedIn: 'root' })
export class AlertPushService extends NxpAlertService<NxpPositionOptions, void> {
  protected readonly component = AlertPushComponent;
  protected readonly options: NxpPositionOptions = {
    block: 'start',
    inline: 'end',
  };

  constructor() {
    super(3);
  }
}
