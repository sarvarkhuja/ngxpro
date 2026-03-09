import {
  AfterContentChecked,
  Directive,
  ElementRef,
  contentChildren,
  inject,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { NgControl, RadioControlValueAccessor } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

/**
 * Internal directive applied as a hostDirective on NxpSegmentedComponent.
 *
 * Handles:
 * - Click delegation: finds which child was clicked, calls component.update(index)
 * - RouterLinkActive integration: watches active route link to sync active index
 * - NgControl / radio integration: watches form control value changes to sync active index
 */
@Directive({
  standalone: true,
  host: {
    '(click)': 'onHostClick($event.target)',
  },
})
export class NxpSegmentedDirective implements AfterContentChecked {
  private component!: { update(index: number): void };
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  private readonly links = contentChildren(RouterLinkActive);
  private readonly linkElements = contentChildren(RouterLinkActive, { read: ElementRef });
  private readonly controls = contentChildren(NgControl, { descendants: true });
  private readonly radios = contentChildren(RadioControlValueAccessor, { descendants: true });

  private readonly controls$ = toObservable(this.controls);

  constructor() {
    this.controls$
      .pipe(
        switchMap(([control]) =>
          new Observable<unknown>((sub) =>
            control?.valueChanges?.pipe(startWith(control.value)).subscribe(sub),
          ),
        ),
        map((value) => this.radios().findIndex((r) => r.value === value)),
        takeUntilDestroyed(),
      )
      .subscribe((index) => {
        if (index !== -1) {
          this.component?.update(index);
        }
      });
  }

  /**
   * Called by NxpSegmentedComponent after it sets itself up as the host component.
   * We need the component reference to call update() on it.
   */
  setComponent(component: { update(index: number): void }): void {
    this.component = component;
  }


  ngAfterContentChecked(): void {
    const index = this.links().findIndex(({ isActive }) => isActive);
    if (index !== -1) {
      const el = this.linkElements()[index]?.nativeElement ?? null;
      if (el) {
        this.updateFromElement(el);
      }
    }
  }

  protected onHostClick(target: EventTarget | null): void {
    if (target instanceof Element) {
      this.updateFromElement(target);
    }
  }

  private updateFromElement(target: Element): void {
    // Get segment children, excluding the last child (the indicator span)
    const children = Array.from(this.el.children).slice(0, -1);
    const index = children.findIndex((child) => child.contains(target));
    if (index !== -1) {
      this.component?.update(index);
    }
  }
}
