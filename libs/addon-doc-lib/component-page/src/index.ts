export { NxpDocComponentPageComponent } from './component-page.component';
export { NxpDocExamplesTabDirective } from './examples-tab.directive';
export { NxpDocApiTabDirective } from './api-tab.directive';

import { NxpDocComponentPageComponent } from './component-page.component';
import { NxpDocExamplesTabDirective } from './examples-tab.directive';
import { NxpDocApiTabDirective } from './api-tab.directive';

/**
 * Convenience array — imports the wrapper component plus both tab directives.
 *
 * @example
 * imports: [NxpDocComponentPage]
 */
export const NxpDocComponentPage = [
  NxpDocComponentPageComponent,
  NxpDocExamplesTabDirective,
  NxpDocApiTabDirective,
] as const;
