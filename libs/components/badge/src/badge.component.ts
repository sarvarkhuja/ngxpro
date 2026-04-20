import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { NxpBadgeDirective } from './badge.directive';

@Component({
  selector: 'nxp-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{
    directive: NxpBadgeDirective,
    inputs: ['variant', 'size', 'color', 'class'],
  }],
  template: `
    @if (badge.variant() === 'dot') {
      <span
        class="shrink-0 rounded-full"
        [style.width.px]="badge.dotSize()"
        [style.height.px]="badge.dotSize()"
        [style.background-color]="badge.dotColor()"
      ></span>
    }
    <ng-content />
  `,
})
export class NxpBadgeComponent {
  protected readonly badge = inject(NxpBadgeDirective);
}
