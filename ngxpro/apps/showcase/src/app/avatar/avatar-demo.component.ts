import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AvatarComponent as NxpAvatar,
  AvatarStackComponent as NxpAvatarStack,
  AvatarLabeledComponent as NxpAvatarLabeled,
  AvatarOutlineDirective as NxpAvatarOutline,
  AutoColorPipe,
  type AvatarSize,
  type AvatarAppearance,
} from '@nxp/components/avatar';

@Component({
  selector: 'app-avatar-demo',
  imports: [NxpAvatar, NxpAvatarStack, NxpAvatarLabeled, NxpAvatarOutline, AutoColorPipe, RouterModule],
  templateUrl: './avatar-demo.component.html',
})
export class AvatarDemoComponent {
  readonly sizes: AvatarSize[] = ['xs', 's', 'm', 'l', 'xl'];
  readonly appearances: AvatarAppearance[] = ['primary', 'negative', 'neutral'];

  readonly outlineColors = [
    { color: '#3b82f6', label: 'Blue' },
    { color: '#10b981', label: 'Green' },
    { color: '#f59e0b', label: 'Amber' },
    { color: '#ef4444', label: 'Red' },
  ];

  readonly autoColorNames = [
    'Alice Johnson',
    'Bob Martinez',
    'Carol White',
    'David Kim',
    'Eve Nakamura',
    'Frank Lee',
    'Grace Patel',
    'Hank Torres',
  ];

  /** Placeholder image that will load (picsum). */
  readonly imageUrl = 'https://picsum.photos/seed/avatar/200/200';

  /** Intentionally invalid URL to trigger fallback. */
  readonly brokenUrl = 'https://example.com/404.jpg';
}
