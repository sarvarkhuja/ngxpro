export { NxpDocExampleComponent } from './example.component';
export {
  NXP_DOC_EXAMPLE_OPTIONS,
  nxpDocExampleOptionsProvider,
  type NxpDocExampleOptions,
} from './example.options';
export { NxpDocExampleGetTabsPipe } from './example-get-tabs.pipe';

import { NxpDocExampleComponent } from './example.component';
import { NxpDocExampleGetTabsPipe } from './example-get-tabs.pipe';

export const NxpDocExample = [
  NxpDocExampleComponent,
  NxpDocExampleGetTabsPipe,
] as const;
