import {
  type ComponentRef,
  type EmbeddedViewRef,
  Injectable,
  type TemplateRef,
} from '@angular/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NxpPortals } from './portals.directive';

@Injectable()
export abstract class NxpPortalService {
  protected host?: NxpPortals;

  attach(host: NxpPortals): void {
    this.host = host;
  }

  add<C>(content: PolymorpheusComponent<C>): ComponentRef<C>;
  add<C>(content: TemplateRef<C>, context?: C): EmbeddedViewRef<C>;
  add<C>(
    content: PolymorpheusComponent<C> | TemplateRef<C>,
    context?: C
  ): ComponentRef<C> | EmbeddedViewRef<C> {
    if (!this.host) {
      throw new Error(
        'NxpPortalService has no host. Did you forget to add <nxp-root> to your app?'
      );
    }
    return content instanceof PolymorpheusComponent
      ? this.host.addComponent(content)
      : this.host.addTemplate(content as TemplateRef<C>, context);
  }

  addTemplate<C>(template: TemplateRef<C>, context?: C): EmbeddedViewRef<C> {
    if (!this.host) {
      throw new Error(
        'NxpPortalService has no host. Did you forget to add <nxp-root> to your app?'
      );
    }
    return this.host.addTemplate(template, context);
  }

  removeTemplate(ref: EmbeddedViewRef<unknown>): void {
    ref.destroy();
  }
}
