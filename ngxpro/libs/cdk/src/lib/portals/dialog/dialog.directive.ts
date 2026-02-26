import { Directive, input } from '@angular/core';
import { NxpPortal } from '../portal';
import { NxpPortalDirective } from '../portal.directive';
import type { NxpDialogOptions } from './dialog.options';
import { NxpDialogService } from './dialog.service';

/**
 * Structural directive for template-based dialogs.
 * Use: <ng-template nxpDialog [nxpDialog]="open" [nxpDialogOptions]="opts">...</ng-template>
 * Pattern from Taiga UI TuiDialog.
 */
@Directive({
  selector: 'ng-template[nxpDialog]',
  standalone: true,
  providers: [
    NxpDialogService,
    { provide: NxpPortal, useExisting: NxpDialogService },
  ],
  hostDirectives: [
    {
      directive: NxpPortalDirective as typeof NxpPortalDirective<NxpDialogOptions<unknown>>,
      inputs: ['options: nxpDialogOptions', 'open: nxpDialog'],
      outputs: ['openChange: nxpDialogChange'],
    },
  ],
})
export class NxpDialogDirective<T = unknown> {
  readonly nxpDialogOptions = input<Partial<NxpDialogOptions<T>>>({});
}
