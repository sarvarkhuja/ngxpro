import { inject, NgZone } from '@angular/core';
import {
  asyncScheduler,
  type MonoTypeOperatorFunction,
  Observable,
  pipe,
  type SchedulerLike,
  type Subscription,
} from 'rxjs';

/**
 * RxJS operator that runs the source observable outside Angular's NgZone.
 */
export function nxpZonefree<T>(zone = inject(NgZone)): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable((subscriber) => zone.runOutsideAngular(() => source.subscribe(subscriber)));
}

/**
 * RxJS operator that ensures all emissions run inside Angular's NgZone.
 */
export function nxpZonefull<T>(zone = inject(NgZone)): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable((subscriber) =>
      source.subscribe({
        next: (v) => zone.run(() => subscriber.next(v)),
        error: (e: unknown) => zone.run(() => subscriber.error(e)),
        complete: () => zone.run(() => subscriber.complete()),
      }),
    );
}

/**
 * RxJS operator that runs source outside zone but delivers emissions inside zone.
 */
export function nxpZoneOptimized<T>(zone = inject(NgZone)): MonoTypeOperatorFunction<T> {
  return pipe(nxpZonefree(zone), nxpZonefull(zone));
}

class NxpZoneScheduler implements SchedulerLike {
  constructor(
    private readonly zoneConditionFn: <T>(fn: (...args: unknown[]) => T) => T,
    private readonly scheduler: SchedulerLike = asyncScheduler,
  ) {}

  now(): number {
    return this.scheduler.now();
  }

  schedule(...args: Parameters<SchedulerLike['schedule']>): Subscription {
    return this.zoneConditionFn(() => this.scheduler.schedule(...args));
  }
}

/**
 * Creates a scheduler that executes tasks outside Angular's NgZone.
 */
export function nxpZonefreeScheduler(
  zone = inject(NgZone),
  scheduler: SchedulerLike = asyncScheduler,
): SchedulerLike {
  return new NxpZoneScheduler(zone.runOutsideAngular.bind(zone), scheduler);
}
