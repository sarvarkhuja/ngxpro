import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cx, hasErrorInput, inputVariants } from '@ngxpro/cdk';

/**
 * @deprecated Prefer the `nxpInput` directive from `@ngxpro/cdk/components/input`.
 * Kept for backward compatibility with existing `[nxp-input]` selector usage.
 * Shares chrome with the rest of the input family via `inputVariants` so the
 * Vercel/Geist look stays in sync.
 */
@Component({
  selector: '[nxp-input]',
  template: ``,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-invalid]': 'hasError() || null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  readonly hasError = input(false);

  readonly class = input<string>('');

  readonly hostClasses = computed(() =>
    cx(inputVariants(), this.hasError() && hasErrorInput, this.class()),
  );
}
