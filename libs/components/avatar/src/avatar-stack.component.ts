import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

export type AvatarStackDirection = 'start' | 'end';

@Component({
  selector: 'nxp-avatar-stack',
  standalone: true,
  template: `<ng-content />`,
  styles: [`
    nxp-avatar-stack {
      display: flex;
      align-items: center;
    }

    nxp-avatar-stack[data-direction='end'] nxp-avatar:not(:first-child) {
      margin-inline-start: -0.5rem;
    }

    nxp-avatar-stack[data-direction='start'] nxp-avatar:not(:last-child) {
      margin-inline-end: -0.5rem;
    }

    nxp-avatar-stack nxp-avatar {
      box-shadow: 0 0 0 2px white;
      position: relative;
    }

    .dark nxp-avatar-stack nxp-avatar {
      box-shadow: 0 0 0 2px rgb(3 7 18);
    }
  `],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-direction]': 'direction()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarStackComponent {
  readonly direction = input<AvatarStackDirection>('end');
}
