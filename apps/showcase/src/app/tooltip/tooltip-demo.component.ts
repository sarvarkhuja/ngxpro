import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpTooltipDirective,
  NxpTooltipIconComponent,
  nxpTooltipOptionsProvider,
  type NxpTooltipDirection,
  type NxpTooltipSize,
} from '@nxp/components/tooltip';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NxpTooltipDirective, NxpTooltipIconComponent],
  templateUrl: './tooltip-demo.component.html',
})
export class TooltipDemoComponent {
  readonly directions: NxpTooltipDirection[] = ['top', 'bottom', 'left', 'right'];
  readonly sizes: NxpTooltipSize[] = ['sm', 'md', 'lg'];
  readonly appearances = ['dark', 'light'];

  readonly playgroundDirection = signal<NxpTooltipDirection>('top');
  readonly playgroundSize = signal<NxpTooltipSize>('md');
  readonly playgroundAppearance = signal<string>('dark');
  readonly playgroundDisabled = signal(false);
  readonly playgroundShowDelay = signal(300);
  readonly playgroundHideDelay = signal(100);
}
