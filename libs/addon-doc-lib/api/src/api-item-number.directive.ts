import { Directive, input } from '@angular/core';

/**
 * Optional sibling directive on a numeric API row that provides `min`/`max`
 * bounds for the auto-generated `<input type="number">`.
 *
 * @example
 * <tr nxpDocApiItem nxpDocApiNumberItem [min]="0" [max]="100" type="number" name="value" [(value)]="model.value" />
 */
@Directive({
  selector: 'tr[nxpDocApiItem][type=number], tr[nxpDocApiNumberItem]',
})
export class NxpDocApiNumberItemDirective {
  public readonly min = input<number | null>(null);
  public readonly max = input<number | null>(null);
}
