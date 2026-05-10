import { Injector, type Type } from '@angular/core';
import { nxpProvideContext } from './dynamic-context.token';

export class NxpDynamicComponent<T> {
  constructor(
    public readonly component: Type<T>,
    private readonly i?: Injector,
  ) {}

  createInjector<C>(injector: Injector, useValue?: C): Injector {
    return Injector.create({
      parent: this.i || injector,
      providers: useValue ? [nxpProvideContext(useValue)] : [],
    });
  }
}
