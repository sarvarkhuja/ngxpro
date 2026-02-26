import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpBadgeDirective,
  type NxpBadgeAppearance,
  type NxpBadgeSize,
} from '@nxp/components/badge';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NxpBadgeDirective],
  templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
  readonly appearances: NxpBadgeAppearance[] = [
    'neutral',
    'primary',
    'success',
    'warning',
    'danger',
    'info',
  ];

  readonly sizes: NxpBadgeSize[] = ['xs', 's', 'm', 'l', 'xl'];

  readonly labels: Record<NxpBadgeAppearance, string> = {
    neutral: 'Default',
    primary: 'New',
    success: 'Live',
    warning: 'Beta',
    danger:  'Alert',
    info:    'Info',
  };
}
