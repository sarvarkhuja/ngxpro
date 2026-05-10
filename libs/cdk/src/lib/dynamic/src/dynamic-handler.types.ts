import type { NxpDynamicPrimitive } from './dynamic-primitive.types';

export type NxpDynamicHandler<C> = (context: C) => NxpDynamicPrimitive;
