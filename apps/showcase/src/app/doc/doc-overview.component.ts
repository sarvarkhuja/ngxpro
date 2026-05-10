import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDocPageComponent } from '@ngxpro/addon-doc-lib/page';

@Component({
  selector: 'app-doc-overview',
  imports: [NxpDocPageComponent],
  template: `
    <nxp-doc-page header="Welcome" package="addon-doc-lib" type="guide">
      <p class="text-base text-text-secondary">
        This is a minimal demo of <code>&#64;ngxpro/addon-doc-lib</code> — the
        documentation-portal building blocks ported from Taiga UI's
        <code>addon-doc</code>. The shell renders a fixed header, a sidebar
        driven by <code>NXP_DOC_PAGES</code>, and a router outlet for each page.
      </p>
      <p class="mt-4 text-base text-text-secondary">
        Pick a page from the sidebar to navigate.
      </p>
    </nxp-doc-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocOverviewComponent {}
