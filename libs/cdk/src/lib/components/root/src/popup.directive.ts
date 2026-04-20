import {
  Directive,
  EmbeddedViewRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { NxpPopupService } from './popup.service';

@Directive({
  selector: 'ng-template[nxpPopup]',
  standalone: true,
})
export class NxpPopupDirective implements OnChanges, OnDestroy {
  private readonly template = inject(TemplateRef);
  private readonly service = inject(NxpPopupService);
  private ref?: EmbeddedViewRef<unknown>;

  /** Pass `true` to render the template into the popup portal; `false` to remove it. */
  readonly show = input(false, { alias: 'nxpPopup' });

  ngOnChanges(): void {
    this.ref?.destroy();
    this.ref = undefined;
    if (this.show()) {
      this.ref = this.service.addTemplate(this.template);
    }
  }

  ngOnDestroy(): void {
    this.ref?.destroy();
  }
}
