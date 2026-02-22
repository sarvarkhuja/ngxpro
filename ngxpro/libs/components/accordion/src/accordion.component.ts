import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
} from '@angular/core';
import { ExpandComponent } from '@nxp/cdk';
import { AccordionDirective } from './accordion.directive';
import { AccordionItemComponent } from './accordion-item.component';

/**
 * Accordion component (Taiga architecture + Tremor styling).
 * Directive-based: use nxp-accordion-trigger (with default icon) or button[nxpAccordion] + nxp-expand.
 *
 * @example
 * With default icon (nxp-accordion-trigger):
 * <nxp-accordion type="single">
 *   <nxp-accordion-trigger nxpCell="m">
 *     <span nxpTitle><strong>Section 1</strong></span>
 *     <span nxpSubtitle>Description</span>
 *   </nxp-accordion-trigger>
 *   <nxp-expand>Content here</nxp-expand>
 * </nxp-accordion>
 *
 * @example
 * Custom button:
 * <nxp-accordion>
 *   <button nxpAccordion nxpCell="m">
 *     <span nxpTitle><strong>Group</strong></span>
 *     <span nxpSubtitle>3 operations • $1,234</span>
 *   </button>
 *   <nxp-expand>...</nxp-expand>
 * </nxp-accordion>
 */
@Component({
  selector: 'nxp-accordion',
  template: `<ng-content />`,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  /** Whether only one item can be open at a time. */
  readonly closeOthers = input(false);

  /** Accordion type: 'single' or 'multiple'. */
  readonly type = input<'single' | 'multiple'>('multiple');

  readonly items = contentChildren(AccordionItemComponent);
  readonly directives = contentChildren(AccordionDirective);
  readonly expands = contentChildren(ExpandComponent);

  /** Close all accordion-item children except the specified one. */
  closeAllExcept(item: AccordionItemComponent): void {
    if (this.closeOthers() || this.type() === 'single') {
      for (const child of this.items()) {
        if (child !== item) child.close();
      }
    }
  }

  /** Toggle directive and sync expand. */
  toggleDirective(directive: AccordionDirective): void {
    const dirs = this.directives();
    const exps = this.expands();
    const idx = dirs.indexOf(directive);

    if (idx < 0 || idx >= exps.length) return;

    if (this.closeOthers() || this.type() === 'single') {
      if (directive.open()) {
        exps.forEach((exp) => exp.expanded.set(false));
        dirs.forEach((d) => {
          if (d !== directive) d.open.set(false);
        });
      }
    }

    exps[idx].expanded.set(!!directive.open());
  }
}
