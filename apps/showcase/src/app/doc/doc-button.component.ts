import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDocPageComponent } from '@ngxpro/addon-doc-lib/page';
import { ButtonComponent } from '@ngxpro/components/button';

@Component({
  selector: 'app-doc-button',
  imports: [NxpDocPageComponent, ButtonComponent],
  template: `
    <nxp-doc-page
      header="Button"
      package="components"
      type="component"
      path="button"
    >
      <p class="text-base text-text-secondary mb-6">
        Buttons trigger actions. Variants cover primary, secondary, and
        destructive intents at three sizes.
      </p>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="flex flex-wrap gap-3">
          <button nxpButton variant="primary">Primary</button>
          <button nxpButton variant="secondary">Secondary</button>
          <button nxpButton variant="tertiary">Tertiary</button>
          <button nxpButton variant="ghost">Ghost</button>
          <button nxpButton variant="destructive">Destructive</button>
        </div>

        <h2 class="text-lg font-semibold pt-6">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button nxpButton size="sm">Small</button>
          <button nxpButton size="md">Medium</button>
          <button nxpButton size="lg">Large</button>
        </div>
      </section>
    </nxp-doc-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocButtonComponent {}
