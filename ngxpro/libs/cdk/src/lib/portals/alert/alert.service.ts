import {
  type ComponentRef,
  inject,
  Injectable,
} from '@angular/core';
import type { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NxpPortal } from '../portal';
import { NxpPortalService } from '../portal.service';
import { NxpPositionOptions } from './alert.directive';


/**
 * Alert portal service with concurrency limit and queue.
 * Pattern from Taiga UI TuiAlertService.
 * Extend this and provide component + options to create a concrete alert (e.g. push/toast).
 */
@Injectable()
export abstract class NxpAlertService<
  T extends NxpPositionOptions = NxpPositionOptions,
  K = void
> extends NxpPortal<T, K> {
  private readonly concurrency: number;
  private readonly current = new Map<unknown, ComponentRef<unknown>>();
  private readonly queue = new Set<PolymorpheusComponent<unknown>>();

  constructor(concurrency: number) {
    super(inject(NxpPortalService));
    this.concurrency = Math.min(concurrency, 5);
  }

  protected override add(
    component: PolymorpheusComponent<unknown>
  ): () => void {
    if (this.current.size < this.concurrency) {
      this.current.set(component, this.service.add(component));
    } else {
      this.queue.add(component);
    }

    return () => {
      this.current.get(component)?.destroy();
      this.current.delete(component);
      this.queue.delete(component);

      const [next] = this.queue;
      if (this.current.size < this.concurrency && next) {
        this.current.set(next, this.service.add(next));
        this.queue.delete(next);
      }
    };
  }
}
