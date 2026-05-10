export { NxpDocPageComponent } from './page.component';
export { NxpDocPageTabConnectorDirective } from './page-tab.directive';
export { NXP_DOC_TABS } from './page.providers';

import { NxpDocPageComponent } from './page.component';
import { NxpDocPageTabConnectorDirective } from './page-tab.directive';

export const NxpDocPage = [
  NxpDocPageComponent,
  NxpDocPageTabConnectorDirective,
] as const;
