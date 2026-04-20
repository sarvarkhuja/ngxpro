import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpBadgeComponent,
  NxpBadgeDirective,
  NXP_BADGE_COLORS,
  type NxpBadgeColor,
  type NxpBadgeSize,
} from '@nxp/components/badge';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NxpBadgeComponent, NxpBadgeDirective],
  templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
  readonly allColors = Object.keys(NXP_BADGE_COLORS) as NxpBadgeColor[];

  readonly sizes: NxpBadgeSize[] = ['sm', 'md', 'lg'];

  readonly sampleColors: NxpBadgeColor[] = [
    'violet',
    'amber',
    'green',
    'blue',
    'rose',
  ];

  readonly sampleLabels: Record<string, string> = {
    violet: 'Fiction',
    amber: 'Science',
    green: 'Philosophy',
    blue: 'History',
    rose: 'Poetry',
  };

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
