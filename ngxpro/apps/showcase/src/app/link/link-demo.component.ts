import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NxpLinkDirective,
  type LinkSize,
  type LinkVariant,
} from '@nxp/cdk/components/link';

@Component({
  selector: 'app-link-demo',
  standalone: true,
  imports: [RouterModule, NxpLinkDirective],
  templateUrl: './link-demo.component.html',
})
export class LinkDemoComponent {
  readonly variants: LinkVariant[] = ['default', 'muted', 'brand', 'danger'];
  readonly sizes: LinkSize[] = ['sm', 'md', 'lg'];
}
