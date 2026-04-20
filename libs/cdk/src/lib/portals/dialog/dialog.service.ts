import { inject, Injectable } from '@angular/core';
import { NxpModalService } from '../modal/modal.service';
import { NXP_DIALOG_DEFAULT_OPTIONS, type NxpDialogOptions } from './dialog.options';
import { NxpDialogComponent } from './dialog.component';

@Injectable({ providedIn: 'root' })
export class NxpDialogService extends NxpModalService<NxpDialogOptions<unknown>> {
  protected readonly options = NXP_DIALOG_DEFAULT_OPTIONS;
  protected readonly content = NxpDialogComponent;
}
