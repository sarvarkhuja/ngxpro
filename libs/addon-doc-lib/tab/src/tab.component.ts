import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cx } from '@ngxpro/cdk';

/**
 * Decorative tab label with an icon `<img>` and projected content. Used by
 * doc pages that want visually-richer tab labels than plain text. Mirrors
 * Taiga's `TuiDocTab`.
 *
 * For functional tab containers, use `NxpTabDirective` from
 * `@ngxpro/components/tabs`.
 *
 * @example
 * <nxp-doc-tab src="/icons/typescript.svg">TypeScript</nxp-doc-tab>
 */
@Component({
  selector: 'nxp-doc-tab',
  template: `
    <div [class]="hostInner">
      <img alt="Documentation tab icon" class="size-4" [src]="src()" />
      <ng-content />
    </div>
  `,
  host: {
    class: 'inline-flex',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocTabComponent {
  /** Icon URL (kept as an `<img src>` for parity with the reference). */
  public readonly src = input('');

  protected readonly hostInner = cx(
    'flex items-center justify-center gap-2 px-2 text-text-primary',
  );
}
