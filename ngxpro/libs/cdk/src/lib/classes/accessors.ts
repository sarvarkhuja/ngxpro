import {
  type AbstractType,
  type ExistingProvider,
  type FactoryProvider,
  Optional,
  SkipSelf,
  type Type,
} from '@angular/core';
import { nxpProvide } from '../utils/provide';
import type { NxpPoint } from '../types';

/**
 * Abstract base class for all accessor types.
 */
export abstract class NxpAccessor {
  public abstract readonly type: string;
}

/**
 * Abstract accessor that provides a position point given a bounding rect.
 */
export abstract class NxpPositionAccessor extends NxpAccessor {
  public abstract getPosition(rect: DOMRect): NxpPoint;
}

/**
 * Abstract accessor that returns the client rect of an element.
 */
export abstract class NxpRectAccessor extends NxpAccessor {
  public abstract getClientRect(): DOMRect;
}

/**
 * Creates a fallback accessor factory function for a given type string.
 * Returns the first matching accessor from the list, or creates one from fallback.
 */
export function nxpFallbackAccessor<T extends NxpAccessor>(
  type: string,
): (accessors: readonly T[] | null, fallback: Omit<T, 'type'>) => T {
  return (accessors, fallback) =>
    accessors?.find?.((a) => a !== fallback && a.type === type) ||
    Object.create(fallback, { type: { value: type } });
}

function nxpProvideAccessor<T extends NxpAccessor>(
  provide: AbstractType<T>,
  type: string,
  fallback: Type<T>,
): FactoryProvider {
  return {
    provide,
    deps: [[new SkipSelf(), new Optional(), provide], fallback],
    useFactory: nxpFallbackAccessor<T>(type),
  };
}

/**
 * Creates a FactoryProvider for a NxpPositionAccessor with a type and fallback.
 */
export function nxpPositionAccessorFor(
  type: string,
  fallback: Type<NxpPositionAccessor>,
): FactoryProvider {
  return nxpProvideAccessor(NxpPositionAccessor, type, fallback);
}

/**
 * Creates a FactoryProvider for a NxpRectAccessor with a type and fallback.
 */
export function nxpRectAccessorFor(
  type: string,
  fallback: Type<NxpRectAccessor>,
): FactoryProvider {
  return nxpProvideAccessor(NxpRectAccessor, type, fallback);
}

/**
 * Creates an ExistingProvider that registers a class as a NxpPositionAccessor.
 */
export function nxpAsPositionAccessor(accessor: Type<NxpPositionAccessor>): ExistingProvider {
  return nxpProvide(NxpPositionAccessor, accessor, true);
}

/**
 * Creates an ExistingProvider that registers a class as a NxpRectAccessor.
 */
export function nxpAsRectAccessor(accessor: Type<NxpRectAccessor>): ExistingProvider {
  return nxpProvide(NxpRectAccessor, accessor, true);
}
