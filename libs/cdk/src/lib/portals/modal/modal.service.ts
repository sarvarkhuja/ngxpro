import { inject, Injectable, type Type } from '@angular/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NXP_LEAVE } from '../../directives/animated.directive';
import { NxpPortal } from '../portal';
import { NxpPortalService } from '../portal.service';
import { NxpModalComponent } from './modal.component';

/**
 * Abstract base for services that open modal dialogs via the portal layer.
 *
 * Subclasses declare their concrete `content` component and optionally
 * default `options`. The service handles lifecycle: enter animation,
 * leave animation (via the `nxp-leave` CSS class), and component teardown.
 *
 * Pattern ported from Taiga UI `TuiModalService`.
 */
@Injectable()
export abstract class NxpModalService<T, K = void> extends NxpPortal<T, K> {
  protected abstract readonly content: Type<unknown>;
  protected readonly component = NxpModalComponent as Type<NxpModalComponent<T>>;

  constructor() {
    super(inject(NxpPortalService));
  }

  protected override add(
    component: PolymorpheusComponent<NxpModalComponent<T>>
  ): () => void {
    const ref = this.service.add(component);
    const el: HTMLElement = ref.location.nativeElement;

    ref.instance.component.set(new PolymorpheusComponent(this.content as Type<unknown>));

    return () => {
      ref.instance.component.set(null);
      ref.changeDetectorRef.detectChanges();
      el.classList.add(NXP_LEAVE);

      Promise.allSettled(getAnimations(el))
        .then(async () =>
          Promise.allSettled(getAnimations(el.firstElementChild))
        )
        .then(() => ref.destroy());
    };
  }
}

function getAnimations(el: Element | null): ReadonlyArray<Promise<unknown>> {
  return el?.getAnimations().map(async ({ finished }) => finished) ?? [];
}
