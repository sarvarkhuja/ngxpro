import { Directive, inject } from '@angular/core';
import { NXP_IS_MOBILE } from './root.tokens';

export type NxpPlatform = 'web' | 'mobile';

@Directive({
  selector: '[nxpPlatform]',
  standalone: true,
  host: {
    '[attr.data-platform]': 'platform',
  },
})
export class NxpPlatformDirective {
  private readonly isMobile = inject(NXP_IS_MOBILE);
  readonly platform: NxpPlatform = this.isMobile ? 'mobile' : 'web';
}
