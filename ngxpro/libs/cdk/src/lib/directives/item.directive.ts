import { Directive } from '@angular/core';

/**
 * Blank directive for queries via contentChild/viewChild/querySelector.
 * Used as a marker for flexible content projection patterns.
 *
 * @example
 * <ng-template ngxproItem>
 *   Content here
 * </ng-template>
 *
 * Pattern: Taiga UI's TuiItem directive
 */
@Directive({
  selector: '[ngxproItem]',
  standalone: true,
})
export class ItemDirective {}
