import { Directive, inject, input, type OnChanges } from '@angular/core';
import { nxpAsDriver } from '../../classes/driver';
import { NxpDropdownDriver } from './dropdown.driver';

/**
 * Directive that allows manually controlling dropdown open state via a boolean input.
 * Useful when you want to control the dropdown programmatically.
 *
 * @example
 * <button [nxpDropdown]="template" [nxpDropdownManual]="isOpen">...</button>
 */
@Directive({
  selector: '[nxpDropdownManual]',
  providers: [NxpDropdownDriver, nxpAsDriver(NxpDropdownDriver)],
})
export class NxpDropdownManual implements OnChanges {
  private readonly driver = inject(NxpDropdownDriver);
  public readonly nxpDropdownManual = input<boolean | ''>(false);

  public ngOnChanges(): void {
    this.driver.next(!!this.nxpDropdownManual());
  }
}
