import { Directive, InjectionToken } from '@angular/core';

/**
 * Token provided by `NxpTextfieldEndDirective` so `NxpTextfieldComponent`
 * can detect a projected trailing adornment via `contentChild(NXP_TEXTFIELD_END)`.
 */
export const NXP_TEXTFIELD_END = new InjectionToken<unknown>('NXP_TEXTFIELD_END');

/**
 * Marker directive for projecting an interactive trailing element into
 * `<nxp-textfield>` (e.g. tooltip hint, dropdown trigger, password toggle).
 *
 * Compose with sibling directives — `nxpTooltip`, `[nxpDropdown]`, or a
 * `(click)` handler — on the same element. When present, this projected
 * element replaces both the built-in cleaner button and the string `iconEnd`.
 *
 * Recommended: add `(pointerdown.prevent)="(0)"` so clicking the button
 * doesn't blur the input mid-typing.
 *
 * @example
 * <nxp-textfield>
 *   <input nxpInput type="text" />
 *   <button nxpTextfieldEnd type="button" tabindex="-1"
 *           [nxpTooltip]="'Hint text'" (pointerdown.prevent)="(0)">
 *     <i class="ri-information-line"></i>
 *   </button>
 * </nxp-textfield>
 */
@Directive({
  selector: '[nxpTextfieldEnd]',
  standalone: true,
  providers: [
    { provide: NXP_TEXTFIELD_END, useExisting: NxpTextfieldEndDirective },
  ],
  host: {
    class:
      'absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center z-10',
  },
})
export class NxpTextfieldEndDirective {}
