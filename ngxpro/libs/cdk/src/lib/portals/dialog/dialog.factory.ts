import {
  assertInInjectionContext,
  inject,
  INJECTOR,
  type Injector,
  type Type,
} from '@angular/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';
import type { NxpDialogOptions } from './dialog.options';
import { NxpDialogService } from './dialog.service';

type Options<D> = Omit<NxpDialogOptions<D>, 'data'> & { injector?: Injector };

/**
 * Returns a function that opens the given component as a dialog with the provided data.
 * Pattern from Taiga UI tuiDialog.
 *
 * @example
 * const openConfirm = nxpDialog(ConfirmComponent);
 * openConfirm({ message: 'Are you sure?' }).subscribe(result => { ... });
 */
export function nxpDialog<D, R = void>(
  component: Type<{ context: unknown }>,
  opts: Partial<Options<D>> = {}
): (data: D) => Observable<R> {
  const injector = opts.injector ?? (assertInInjectionContext(nxpDialog), inject(INJECTOR));
  const dialogService = injector.get(NxpDialogService);
  const { injector: _i, ...options } = opts;

  return (data) =>
    dialogService.open(new PolymorpheusComponent(component, injector), {
      ...options,
      data,
    } as Partial<NxpDialogOptions<D>>);
}
