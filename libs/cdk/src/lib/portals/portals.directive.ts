import {
  type ComponentRef,
  Directive,
  type EmbeddedViewRef,
  inject,
  INJECTOR,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  POLYMORPHEUS_CONTEXT,
  type PolymorpheusComponent,
} from '@taiga-ui/polymorpheus';
import { NxpPortalService } from './portal.service';

@Directive()
export abstract class NxpPortals {
  // Uses viewChild to get a VCR INSIDE the component's own template.
  // The concrete component must have <ng-container #vcr /> in its template.
  // Pattern from Taiga UI TuiPortals.
  private readonly vcr = viewChild.required('vcr', {
    read: ViewContainerRef,
  });
  private readonly injector = inject(INJECTOR);

  constructor() {
    inject(NxpPortalService).attach(this);
  }

  addComponent<C>(component: PolymorpheusComponent<C>): ComponentRef<C> {
    // Access internal injector from PolymorpheusComponent (matches Taiga pattern)
    const context = (component as unknown as { i?: { get: (t: unknown, o?: { optional: boolean }) => unknown } })
      .i?.get(POLYMORPHEUS_CONTEXT, { optional: true });
    const injector = component.createInjector(this.injector, context ?? undefined);
    const ref = this.vcr().createComponent(component.component, { injector });
    ref.changeDetectorRef.detectChanges();
    return ref;
  }

  addTemplate<C>(template: TemplateRef<C>, context?: C): EmbeddedViewRef<C> {
    return this.vcr().createEmbeddedView(template, context);
  }
}
