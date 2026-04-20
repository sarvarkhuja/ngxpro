import { Directive, inject } from '@angular/core';
import { nxpOverrideOptions } from '../../utils/override-options';
import {
  NXP_DROPDOWN_DEFAULT_OPTIONS,
  NXP_DROPDOWN_OPTIONS,
  nxpDropdownOptionsProvider,
} from './dropdown-options.directive';

/**
 * Directive that forces a dropdown to match its host element's width exactly.
 */
@Directive({ providers: [nxpDropdownOptionsProvider({ limitWidth: 'fixed' })] })
export class NxpDropdownFixed {
  constructor() {
    const override = nxpOverrideOptions({ limitWidth: 'fixed' }, NXP_DROPDOWN_DEFAULT_OPTIONS);
    override(inject(NXP_DROPDOWN_OPTIONS, { self: true, optional: true }), null);
  }
}

/**
 * Directive that allows the dropdown to size automatically (default behavior).
 */
@Directive()
export class NxpDropdownAuto {
  constructor() {
    (inject(NXP_DROPDOWN_OPTIONS) as any).limitWidth = 'auto';
  }
}
