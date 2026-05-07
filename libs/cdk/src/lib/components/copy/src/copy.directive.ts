import { Directive, OnDestroy, inject, signal } from '@angular/core';
import { NXP_DOCUMENT, NXP_TEXTFIELD } from '../../../tokens';
import { nxpWriteToClipboard } from '../../../utils';
import { NXP_COPY_OPTIONS } from './copy.options';

/**
 * Copy-to-clipboard directive for an icon projected inside a textfield.
 *
 * Attaches to `<nxp-icon nxpCopy>` placed inside a `<nxp-textfield>`. On
 * click, copies the textfield's current value to the clipboard and flips
 * `aria-label` / `title` to "Copied" for `NXP_COPY_OPTIONS.hintTimeout` ms.
 *
 * TODO: multi-value support — Taiga joins arrays via
 * `TUI_ITEMS_HANDLERS.stringify`. Deferred until `NXP_TEXTFIELD` exposes
 * a form-control contract.
 *
 * TODO: hint portal — Taiga binds `TuiHintDirective.content`. Revisit when
 * `NxpHintDirective` lands in `@ngxpro/cdk`.
 */
@Directive({
  selector: 'nxp-icon[nxpCopy]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
    '[style.cursor]': '"pointer"',
    '[style.pointerEvents]': 'textfield.hasValue() ? null : "none"',
    '[style.opacity]': 'textfield.hasValue() ? null : "0.5"',
    '[attr.aria-label]': 'copied() ? "Copied" : "Copy"',
    '[attr.title]': 'copied() ? "Copied" : "Copy"',
    '[attr.role]': '"button"',
    '[attr.tabindex]': '0',
  },
})
export class NxpCopyDirective implements OnDestroy {
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly options = inject(NXP_COPY_OPTIONS);
  protected readonly textfield = inject(NXP_TEXTFIELD);

  protected readonly copied = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  protected async onClick(): Promise<void> {
    const raw = this.textfield.value();
    const text = raw == null ? '' : String(raw);
    if (!text) {
      return;
    }
    const ok = await nxpWriteToClipboard(text, this.doc);
    if (!ok || this.destroyed) {
      return;
    }
    this.copied.set(true);
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      if (this.destroyed) return;
      this.copied.set(false);
      this.timeoutId = null;
    }, this.options.hintTimeout);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
