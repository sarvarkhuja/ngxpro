import { isPlatformBrowser } from '@angular/common';
import { Directive, inject, type OnDestroy, PLATFORM_ID, TemplateRef } from '@angular/core';
import { nxpSetSignal } from '../../utils/set-signal';
import { NxpDropdownDirective } from './dropdown.directive';

/**
 * Directive for using an ng-template as dropdown content.
 * Apply to an ng-template with the nxpDropdown attribute.
 *
 * @example
 * <ng-template nxpDropdown>dropdown content here</ng-template>
 */
@Directive({ selector: 'ng-template[nxpDropdown]' })
export class NxpDropdownContent implements OnDestroy {
  private readonly directive = inject(NxpDropdownDirective);

  constructor() {
    nxpSetSignal(this.directive.nxpDropdown, inject(TemplateRef));
    if (
      isPlatformBrowser(inject(PLATFORM_ID)) &&
      this.directive.el.matches(':focus-within')
    ) {
      this.directive.toggle(true);
    }
  }

  public ngOnDestroy(): void {
    nxpSetSignal(this.directive.nxpDropdown, null);
  }
}
