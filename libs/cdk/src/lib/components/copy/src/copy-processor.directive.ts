import { Directive, inject, input } from '@angular/core';
import { NXP_WINDOW } from '@ngxpro/cdk';

/**
 * Transformer applied to selected text before it hits the clipboard.
 */
export type NxpStringTransformer = (text: string) => string;

/**
 * Intercepts the browser "copy" event on an element and rewrites the
 * clipboard payload via a user-supplied transformer.
 *
 * @example
 * <pre [nxpCopyProcessor]="trim">  hello  </pre>
 * // where `trim = (s: string) => s.trim()`
 */
@Directive({
  selector: '[nxpCopyProcessor]',
  host: {
    '(copy)': 'onCopy($event)',
  },
})
export class NxpCopyProcessorDirective {
  private readonly win = inject(NXP_WINDOW);

  readonly nxpCopyProcessor = input<NxpStringTransformer>((text) => text);

  protected onCopy(event: ClipboardEvent): void {
    const selected = this.win?.getSelection()?.toString() ?? '';
    if (!selected) {
      return;
    }
    event.preventDefault();
    event.clipboardData?.setData(
      'text/plain',
      this.nxpCopyProcessor()(selected),
    );
  }
}
