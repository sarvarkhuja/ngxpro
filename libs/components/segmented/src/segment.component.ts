import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Item component for `nxp-segmented`. Works on its own tag or as an attribute
 * on `button` / `a` / `label`.
 *
 * Adds icon slots (start / end) and per-item disabled state. The host element
 * receives the native `disabled` attribute so `<button>` items block clicks
 * natively; the parent directive guards `<a>` / `<label>` via `closest('[disabled]')`.
 *
 * Plain `button` / `a` / `label` children of `nxp-segmented` continue to work
 * without this component — use it when you need icons or `disabled`.
 *
 * @example
 * <nxp-segmented>
 *   <nxp-segment iconStart="<svg>...</svg>">Day</nxp-segment>
 *   <button nxpSegment [disabled]="true">Week</button>
 *   <a nxpSegment href="/month" iconEnd="<svg>...</svg>">Month</a>
 * </nxp-segmented>
 */
@Component({
  selector: 'nxp-segment, button[nxpSegment], a[nxpSegment], label[nxpSegment]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (iconStart()) {
      <span
        class="shrink-0 inline-flex items-center justify-center [&_svg]:block [&_svg]:w-full [&_svg]:h-full"
        [innerHTML]="iconStartSafe()"
      ></span>
    }
    <ng-content />
    @if (iconEnd()) {
      <span
        class="shrink-0 inline-flex items-center justify-center [&_svg]:block [&_svg]:w-full [&_svg]:h-full"
        [innerHTML]="iconEndSafe()"
      ></span>
    }
  `,
  host: {
    '[attr.disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class NxpSegmentComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /** Whether this segment is disabled. Blocks clicks and applies muted styling. */
  readonly disabled = input(false);

  /** Icon to display before the label. Accepts a raw SVG string. */
  readonly iconStart = input<string>('');

  /** Icon to display after the label. Accepts a raw SVG string. */
  readonly iconEnd = input<string>('');

  protected readonly iconStartSafe = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.iconStart()),
  );

  protected readonly iconEndSafe = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.iconEnd()),
  );
}
