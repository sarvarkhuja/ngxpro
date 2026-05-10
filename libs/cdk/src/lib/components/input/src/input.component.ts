import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { focusInput, hasErrorInput } from '@ngxpro/cdk';
import { cx } from '@ngxpro/cdk';

/**
 * @deprecated Prefer the `nxpInput` directive from `@nxp/cdk/components/input`.
 * Kept for backward compatibility with existing `[nxp-input]` selector usage.
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
    cx(
      'relative block w-full appearance-none rounded-m border px-3 py-2 shadow-sm outline-none transition sm:text-sm',
      'border-border-normal',
      'bg-bg-base',
      'text-text-primary',
      'placeholder:text-text-tertiary',
      'disabled:cursor-not-allowed disabled:bg-bg-neutral-1 disabled:text-text-tertiary',
      ...focusInput,
      this.hasError() && hasErrorInput,
      this.class(),
    ),
  );
}
