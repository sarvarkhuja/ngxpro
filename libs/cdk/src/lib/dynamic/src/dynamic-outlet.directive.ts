import {
  ChangeDetectorRef,
  type ComponentRef,
  Directive,
  type DoCheck,
  effect,
  inject,
  INJECTOR,
  input,
  reflectComponentType,
  TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core';

import { NxpDynamicComponent } from './dynamic-component';
import { NxpDynamicContext } from './dynamic-context';
import type { NxpDynamicContent } from './dynamic-content.types';
import type { NxpDynamicPrimitive } from './dynamic-primitive.types';
import { NxpDynamicTemplate } from './dynamic-template.directive';
import { nxpIsPrimitive } from './is-primitive';

const NOT_SET = Symbol('NOT_SET');

@Directive({
  selector: '[nxpDynamicOutlet]',
})
export class NxpDynamicOutlet<C> implements DoCheck {
  private readonly vcr = inject(ViewContainerRef);
  private readonly i = inject(INJECTOR);

  private readonly t: TemplateRef<NxpDynamicContext<NxpDynamicPrimitive>> =
    inject(TemplateRef);

  private c?: ComponentRef<unknown>;

  readonly content = input<NxpDynamicContent<C>>('', {
    alias: 'nxpDynamicOutlet',
  });
  readonly context = input<C | undefined>(undefined, {
    alias: 'nxpDynamicOutletContext',
  });

  private prevContent: NxpDynamicContent<C> | typeof NOT_SET = NOT_SET;

  constructor() {
    effect(() => {
      const content = this.content();
      this.context();
      untracked(() => this.refresh(content));
    });
  }

  static ngTemplateContextGuard<T>(
    _dir: NxpDynamicOutlet<T>,
    _ctx: unknown,
  ): _ctx is NxpDynamicContext<T extends NxpDynamicPrimitive ? T : never> {
    return true;
  }

  ngDoCheck(): void {
    const content = this.content();
    if (isDirective(content)) {
      content.check();
    }
  }

  private refresh(content: NxpDynamicContent<C>): void {
    const context = this.getContext();

    this.update();
    this.c?.injector.get(ChangeDetectorRef).markForCheck();

    if (content === this.prevContent) {
      return;
    }
    this.prevContent = content;

    this.vcr.clear();

    const proxy =
      context &&
      (new Proxy(ensureContext(context) as object, {
        get: (_, key) =>
          ensureContext(this.getContext())?.[
            key as keyof (C | NxpDynamicContext<any>)
          ],
      }) as unknown as C);

    if (isComponent(content)) {
      this.process(content, proxy);
      this.update();
    } else if (
      (context instanceof NxpDynamicContext && context.$implicit) != null
    ) {
      this.vcr.createEmbeddedView(this.template, proxy, { injector: this.i });
    }
  }

  private get template(): TemplateRef<unknown> {
    const content = this.content();
    if (isDirective(content)) {
      return content.template;
    }

    return content instanceof TemplateRef ? content : this.t;
  }

  private getContext(): C | NxpDynamicContext<any> | undefined {
    const content = this.content();
    const context = this.context();
    return isTemplate(content) || isComponent(content)
      ? context
      : new NxpDynamicContext(
          typeof content === 'function'
            ? content(context ?? ({} as C))
            : content,
        );
  }

  private process(content: NxpDynamicComponent<unknown>, proxy?: C): void {
    const injector = content.createInjector(this.i, proxy);

    this.c = this.vcr.createComponent(content.component, { injector });
  }

  private update(): void {
    const context = this.context();
    const content = this.content();

    if (!context || typeof context !== 'object' || !isComponent(content)) {
      return;
    }

    const { inputs = [] } = reflectComponentType(content.component) || {};

    for (const { templateName } of inputs) {
      if (templateName in context) {
        this.c?.setInput(templateName, context[templateName as keyof C]);
      }
    }
  }
}

function isDirective<C>(
  content: NxpDynamicContent<C>,
): content is NxpDynamicTemplate<C> {
  return content instanceof NxpDynamicTemplate;
}

function isComponent<C>(
  content: NxpDynamicContent<C>,
): content is NxpDynamicComponent<any> {
  return content instanceof NxpDynamicComponent;
}

function isTemplate<C>(
  content: NxpDynamicContent<C>,
): content is NxpDynamicTemplate<C> | TemplateRef<C> {
  return isDirective(content) || content instanceof TemplateRef;
}

function ensureContext<C>(
  context: C | NxpDynamicContext<any> | undefined,
): C | NxpDynamicContext<any> | undefined {
  return context && nxpIsPrimitive(context)
    ? new NxpDynamicContext(context)
    : context;
}
