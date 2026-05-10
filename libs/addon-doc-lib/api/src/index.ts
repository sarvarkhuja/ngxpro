export { NxpDocApiComponent } from './api.component';
export { NxpDocApiItemComponent } from './api-item.component';
export { NxpDocApiNumberItemDirective } from './api-item-number.directive';
export { NxpInspectPipe } from './inspect.pipe';
export { NxpTypeReferencePipe } from './type-reference.pipe';

import { NxpDocApiComponent } from './api.component';
import { NxpDocApiItemComponent } from './api-item.component';
import { NxpDocApiNumberItemDirective } from './api-item-number.directive';
import { NxpInspectPipe } from './inspect.pipe';
import { NxpTypeReferencePipe } from './type-reference.pipe';

export const NxpDocApi = [
  NxpDocApiComponent,
  NxpDocApiItemComponent,
  NxpDocApiNumberItemDirective,
  NxpInspectPipe,
  NxpTypeReferencePipe,
] as const;
