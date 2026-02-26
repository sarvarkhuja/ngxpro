import { inject, Injectable, NgZone } from '@angular/core';
import { animationFrames, finalize, map, Observable, startWith } from 'rxjs';
import { EMPTY_CLIENT_RECT } from '../constants';
import { NxpPositionAccessor } from '../classes/accessors';
import { nxpInjectElement } from '../utils/inject-element';
import { nxpZonefree } from '../observables/zone';
import type { NxpPoint } from '../types';

/**
 * Service that emits the position of a positioned element on each animation frame.
 * Used by dropdown and overlay components for real-time positioning.
 */
@Injectable()
export class NxpPositionService extends Observable<NxpPoint> {
  private readonly el = nxpInjectElement();
  private readonly accessor = inject(NxpPositionAccessor);

  constructor() {
    const zone = inject(NgZone);
    super((subscriber) =>
      animationFrames()
        .pipe(
          startWith(null),
          map(() => this.accessor.getPosition(this.el.getBoundingClientRect())),
          nxpZonefree(zone),
          finalize(() => this.accessor.getPosition(EMPTY_CLIENT_RECT)),
        )
        .subscribe(subscriber),
    );
  }
}
