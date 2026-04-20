import {
  inject,
  Injectable,
  INJECTOR,
  Injector,
  type Type,
} from '@angular/core';
import {
  POLYMORPHEUS_CONTEXT,
  PolymorpheusComponent,
  type PolymorpheusContent,
} from '@taiga-ui/polymorpheus';
import { Observable, type Observer } from 'rxjs';
import { nxpGenerateId } from '../utils/generate-id';
import type { NxpPortalService } from './portal.service';

/** Context passed to portal content (observer + portal options). */
export type NxpPortalContext<T, O = void> = T & {
  readonly $implicit: Observer<O>;
  readonly content: PolymorpheusContent<NxpPortalContext<T, O>>;
  readonly createdAt: number;
  readonly id: string;
  completeWith(value: O): void;
};

/**
 * Abstract base for portal services that open a component with polymorphic content.
 * Pattern from Taiga UI TuiPortal.
 */
@Injectable()
export abstract class NxpPortal<T, K = void> {
  protected abstract readonly component: Type<unknown>;
  protected abstract readonly options: T;

  private readonly injector = inject(INJECTOR);

  constructor(protected readonly service: NxpPortalService) {}

  open<G = void>(
    content: PolymorpheusContent<NxpPortalContext<T, K extends void ? G : K>>,
    options: Partial<T> = {}
  ): Observable<K extends void ? G : K> {
    return new Observable((observer) =>
      this.add(
        new PolymorpheusComponent(
          this.component,
          Injector.create({
            parent: this.injector,
            providers: [
              {
                provide: POLYMORPHEUS_CONTEXT,
                useValue: {
                  ...this.options,
                  ...options,
                  content,
                  $implicit: observer,
                  createdAt: Date.now(),
                  id: nxpGenerateId(),
                  completeWith: (v: K extends void ? G : K): void => {
                    observer.next(v);
                    observer.complete();
                  },
                } satisfies NxpPortalContext<T, K extends void ? G : K>,
              },
            ],
          })
        )
      )
    );
  }

  /** Override in subclasses (e.g. alert) for concurrency/queue. */
  protected add(component: PolymorpheusComponent<unknown>): () => void {
    const ref = this.service.add(component);
    return () => ref.destroy();
  }
}
