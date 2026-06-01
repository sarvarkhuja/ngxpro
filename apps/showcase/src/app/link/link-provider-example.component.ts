import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NxpLinkDirective,
  nxpLinkOptionsProvider,
} from '@ngxpro/cdk/components/link';

/**
 * Demonstrates `nxpLinkOptionsProvider` cascading a house style to a subtree.
 *
 * Every `nxpLink` rendered inside this component inherits
 * `variant: 'default'` and `underline: false` as its defaults — no per-anchor
 * inputs required. Any single link can still opt back in by setting the input
 * explicitly (see the brand link below).
 */
@Component({
  selector: 'app-link-provider-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NxpLinkDirective],
  providers: [nxpLinkOptionsProvider({ variant: 'default', underline: false })],
  template: `
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <a href="#" nxpLink>Inherits default</a>
      <a href="#" nxpLink>No underline</a>
      <a href="#" nxpLink variant="brand">Opt back into brand</a>
    </div>
  `,
})
export class LinkProviderExampleComponent {}
