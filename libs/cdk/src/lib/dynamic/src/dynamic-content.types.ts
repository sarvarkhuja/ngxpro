import type { TemplateRef } from '@angular/core';

import type { NxpDynamicComponent } from './dynamic-component';
import type { NxpDynamicHandler } from './dynamic-handler.types';
import type { NxpDynamicPrimitive } from './dynamic-primitive.types';
import type { NxpDynamicTemplate } from './dynamic-template.directive';

export type NxpDynamicContent<C = any> =
  | NxpDynamicComponent<unknown>
  | NxpDynamicHandler<C>
  | NxpDynamicPrimitive
  | NxpDynamicTemplate<Partial<C> | ''>
  | TemplateRef<Partial<C>>;
