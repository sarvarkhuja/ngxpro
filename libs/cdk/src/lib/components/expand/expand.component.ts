import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  model,
  type OnInit,
  signal,
  TemplateRef,
} from '@angular/core';
import { ItemDirective } from '../../directives/item.directive';

/**
 * Expand component for smooth height animations (Taiga architecture).
 *
 * Uses CSS Grid animation technique (grid-template-rows: 0fr → 1fr)
 * for performant height transitions without needing to know exact heights.
 *
 * @example
 * Basic usage with direct content:
 * <nxp-expand [expanded]="isOpen()">
 *   <div>Content to expand/collapse</div>
 * </nxp-expand>
 *
 * @example
 * Advanced usage with ng-template (allows lazy rendering):
 * <nxp-expand [expanded]="isOpen()">
 *   <ng-template nxpItem>
 *     <div>Lazy loaded content</div>
 *   </ng-template>
 * </nxp-expand>
 */
@Component({
  selector: 'nxp-expand',
  imports: [NgTemplateOutlet],
  template: `
    <div class="nxp-expand-wrapper">
      @if (expanded() || open()) {
        <ng-container [ngTemplateOutlet]="content() || null" />
      }
      <ng-content />
    </div>
  `,
  styleUrl: './expand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class._expanded]': 'expanded()',
    '[class._open]': 'open()',
    '(transitionend.self)': 'onTransitionEnd($any($event))',
  },
})
export class ExpandComponent implements OnInit {
  /**
   * Optional content template using nxpItem directive.
   * Allows for lazy rendering via ng-template.
   */
  protected readonly content = contentChild(ItemDirective, {
    read: TemplateRef,
  });

  /**
   * Whether the content should be expanded.
   * Controls the animation trigger.
   * Uses model() to allow imperative control (e.g. from AccordionDirective).
   */
  public readonly expanded = model(false);

  /**
   * Internal signal tracking when animation is complete.
   * Used to remove overflow: hidden after expansion finishes.
   */
  protected readonly open = signal(false);

  public ngOnInit(): void {
    // Initialize open state to match expanded
    this.open.set(this.expanded());
  }

  /**
   * Handles the transitionend event to update open state.
   * This allows us to change overflow from hidden to visible
   * after the animation completes, preventing content cutoff.
   */
  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'grid-template-rows') {
      this.open.set(this.expanded());
    }
  }
}
