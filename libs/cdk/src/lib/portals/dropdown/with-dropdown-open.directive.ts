import { Directive } from '@angular/core';
import { NxpDropdownOpen } from './dropdown-open.directive';

/**
 * Convenience directive that exposes NxpDropdownOpen's API with simplified input/output names.
 * Useful for components that wrap dropdown behavior.
 */
@Directive({
  hostDirectives: [
    {
      directive: NxpDropdownOpen,
      inputs: ['open', 'enabled'],
      outputs: ['openChange'],
    },
  ],
})
export class NxpWithDropdownOpen {}
