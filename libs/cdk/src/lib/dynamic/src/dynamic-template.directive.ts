/* eslint-disable @angular-eslint/prefer-inject */
import {
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: 'ng-template[nxpDynamic]',
  exportAs: 'nxpDynamic',
})
export class NxpDynamicTemplate<C> {
  @Input() nxpDynamic: C | '' = '';

  constructor(
    public readonly template: TemplateRef<C> = inject<TemplateRef<C>>(
      TemplateRef,
      { self: true },
    ),
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef),
  ) {}

  static ngTemplateContextGuard<T>(
    _dir: NxpDynamicTemplate<T>,
    _ctx: unknown,
  ): _ctx is T extends '' ? unknown : T {
    return true;
  }

  check(): void {
    this.cdr.markForCheck();
  }
}
