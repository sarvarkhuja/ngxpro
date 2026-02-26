import { Directive, inject, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { PolymorpheusTemplate } from '@taiga-ui/polymorpheus';
import { endWith, ignoreElements, share } from 'rxjs';
import { nxpIfMap } from '../observables';
import type { NxpPortalContext } from './portal';
import { NxpPortal } from './portal';

/**
 * Directive for ng-template to open portal content when open is true.
 * Use as hostDirective with inputs: options, open; outputs: openChange.
 * Pattern from Taiga UI TuiPortalDirective.
 */
@Directive()
export class NxpPortalDirective<T> extends PolymorpheusTemplate<NxpPortalContext<T>> {
  private readonly portal = inject(NxpPortal<T>);

  readonly options = input<Partial<T>>({});
  readonly open = input(false);
  readonly openChange = outputFromObservable(
    toObservable(this.open).pipe(
      nxpIfMap(() =>
        this.portal
          .open(this, this.options())
          .pipe(ignoreElements(), endWith(false)),
      ),
      share(),
    ),
  );
}
