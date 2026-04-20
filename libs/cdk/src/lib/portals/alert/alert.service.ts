import {
  type ComponentRef,
  inject,
  Injectable,
} from '@angular/core';
import type { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NxpPortal } from '../portal';
import { NxpPortalService } from '../portal.service';
import { NxpPositionOptions } from './alert.directive';
import { NXP_LEAVE } from '../../directives/animated.directive';
import { NXP_TIME_BEFORE_UNMOUNT } from '../../constants/motion';


/**
 * Alert portal service with concurrency limit and queue.
 * Pattern from Taiga UI TuiAlertService.
 * Extend this and provide component + options to create a concrete alert (e.g. push/toast).
 *
 * On dismiss, adds the `nxp-leave` CSS class to trigger the exit animation,
 * then waits NXP_TIME_BEFORE_UNMOUNT ms before destroying the component ref.
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
      const ref = this.current.get(component);

      if (ref) {
        const el = ref.location.nativeElement as HTMLElement;
        el.classList.add(NXP_LEAVE);

        setTimeout(() => {
          ref.destroy();
          this.current.delete(component);
          this.promoteQueue();
        }, NXP_TIME_BEFORE_UNMOUNT);
      } else {
        this.queue.delete(component);
      }
    };
  }

  private promoteQueue(): void {
    const [next] = this.queue;
    if (this.current.size < this.concurrency && next) {
      this.current.set(next, this.service.add(next));
      this.queue.delete(next);
    }
  }
}
