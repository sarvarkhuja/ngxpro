import { NxpDropdownOptionsDirective } from './dropdown-options.directive';
import { NxpDropdownDriverDirective } from './dropdown.driver';
import { NxpDropdownDirective } from './dropdown.directive';
import { NxpDropdownComponent } from './dropdown.component';
import { NxpDropdownOpen } from './dropdown-open.directive';
import { NxpDropdownManual } from './dropdown-manual.directive';
import { NxpDropdownHover } from './dropdown-hover.directive';
import { NxpDropdownContent } from './dropdown-content.directive';
import { NxpDropdownContext } from './dropdown-context.directive';
import { NxpDropdownPosition } from './dropdown-position.directive';
import { NxpDropdownPositionSided } from './dropdown-position-sided.directive';
import { NxpDropdownSelection } from './dropdown-selection.directive';

/**
 * Complete set of all dropdown directives/components for easy import.
 *
 * @example
 * imports: [...NxpDropdown]
 */
export const NxpDropdown = [
  NxpDropdownOptionsDirective,
  NxpDropdownDriverDirective,
  NxpDropdownDirective,
  NxpDropdownComponent,
  NxpDropdownOpen,
  NxpDropdownManual,
  NxpDropdownHover,
  NxpDropdownContent,
  NxpDropdownContext,
  NxpDropdownPosition,
  NxpDropdownPositionSided,
  NxpDropdownSelection,
] as const;
