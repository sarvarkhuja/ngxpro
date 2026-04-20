import { Directive } from '@angular/core';

/**
 * Blank directive for queries via contentChild/viewChild/querySelector.
 * Used as a marker for flexible content projection patterns.
 *
 * @example
 * <ng-template nxpItem>
 *   Content here
 * </ng-template>
 *
 * Pattern: Taiga UI's TuiItem directive
 */
@Directive({
  selector: '[nxpItem]',
  standalone: true,
})
export class ItemDirective {}
