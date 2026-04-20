import { Directive, inject, input } from '@angular/core';
import { RadioControlValueAccessor } from '@angular/forms';

/**
 * Identity matcher directive — patches Angular's `RadioControlValueAccessor`
 * to support custom equality for object values.
 *
 * Without this directive, Angular uses reference equality (`===`) to match the
 * form control value against each radio's `value` attribute. When working with
 * object values, references may differ even if the objects represent the same
 * entity. Providing a custom `identityMatcher` solves this.
 *
 * Must be used together with `nxpRadio` on `input[type="radio"]` elements.
 *
 * @example
 * <!-- String values (default identity works fine) -->
 * <input type="radio" nxpRadio value="apple" name="fruit" [formControl]="ctrl" />
 *
 * @example
 * <!-- Object values: use identityMatcher -->
 * <input
 *   type="radio"
 *   nxpRadio
 *   [value]="item"
 *   name="items"
 *   [formControl]="ctrl"
 *   [identityMatcher]="byId"
 * />
 * <!-- In component: byId = (a: Item, b: Item) => a.id === b.id -->
 */
@Directive({
  selector: 'input[type="radio"][nxpRadio][identityMatcher]',
  standalone: true,
})
export class NxpRadioDirective<T> {
  /**
   * Custom equality function for comparing form control value against each
   * radio option's value. Defaults to strict reference equality.
   */
  readonly identityMatcher = input<(a: T, b: T) => boolean>(
    (a, b) => a === b,
  );

  constructor() {
    const accessor = inject(RadioControlValueAccessor, {
      self: true,
      optional: true,
    });

    if (!accessor) return;

    const writeValue = accessor.writeValue.bind(accessor);

    // Patch writeValue to use the custom identity matcher — Taiga pattern.
    // accessor.value holds the radio's own [value] binding.
    accessor.writeValue = (value: T) => {
      if (this.identityMatcher()(value, accessor.value)) {
        writeValue(accessor.value);
      } else {
        writeValue(value);
      }
    };
  }
}
