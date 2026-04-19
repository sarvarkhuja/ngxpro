export { NxpMenuComponent } from './menu.component';
export { NxpMenuItemDirective } from './menu-item.directive';
export { NxpNavComponent } from './nav.component';
export { NxpNavItemDirective } from './nav-item.directive';

import { NxpMenuComponent } from './menu.component';
import { NxpMenuItemDirective } from './menu-item.directive';
import { NxpNavComponent } from './nav.component';
import { NxpNavItemDirective } from './nav-item.directive';

/** Convenience tuple for importing everything the menu needs. */
export const NxpMenu = [NxpMenuComponent, NxpMenuItemDirective];

/** Convenience tuple for router-aware nav usage. */
export const NxpNav = [NxpNavComponent, NxpNavItemDirective];
