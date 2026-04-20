import type { Observable } from 'rxjs';
import type { NxpPortalContext } from '../portal';

/** Size scale for dialogs. */
export type NxpDialogSize = 's' | 'm' | 'l';

/**
 * Options for a dialog.
 * Pattern from Taiga UI TuiDialogOptions.
 */
export interface NxpDialogOptions<I = void> {
  readonly appearance: string;
  readonly closable: Observable<boolean> | boolean;
  readonly data: I extends void ? undefined : I;
  readonly dismissible: Observable<boolean> | boolean;
  readonly label: string;
  readonly required: boolean;
  readonly size: NxpDialogSize;
}

export type NxpDialogContext<O = void, I = undefined> = NxpPortalContext<
  NxpDialogOptions<I>,
  O
>;

/** Default dialog options. */
export const NXP_DIALOG_DEFAULT_OPTIONS: NxpDialogOptions<void> = {
  appearance: 'default',
  size: 'm',
  required: false,
  closable: true,
  dismissible: true,
  label: '',
  data: undefined,
};
