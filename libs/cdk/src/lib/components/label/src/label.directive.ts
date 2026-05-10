import { Directive, computed, input } from '@angular/core';
import { cx } from '@ngxpro/cdk';
import { NXP_LABEL } from '@ngxpro/cdk';

/**
 * Label directive (Tremor styling).
 *
 * @example
 * <label nxpLabel for="email">Email</label>
 * <label nxpLabel [disabled]="true">Disabled</label>
 */
@Directive({
  selector: 'label[nxpLabel]',
  providers: [{ provide: NXP_LABEL, useExisting: NxpLabelDirective }],
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class NxpLabelDirective {
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly classes = computed(() =>
    cx(
      'text-sm leading-none',
      'text-text-primary',
      this.disabled() && 'text-text-tertiary',
      this.class(),
    ),
  );
}
