import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Router-aware item for `NxpNavComponent`. Its `checked` state is driven
 * by `Router.isActive()` against the companion `routerLink`. Standalone
 * directive with no inheritance — keeps AOT host metadata static.
 */
@Directive({
  selector: 'a[nxpNavItem]',
  standalone: true,
  host: {
    role: 'menuitem',
    tabindex: '0',
    class:
      'relative z-10 flex items-center gap-2 w-full px-3 py-2 rounded-md font-medium outline-none cursor-pointer no-underline',
    '[class.text-gray-900]': 'checked()',
    '[class.dark:text-white]': 'checked()',
    '[class.text-gray-600]': '!checked()',
    '[class.dark:text-gray-400]': '!checked()',
    '[attr.data-proximity-index]': 'index()',
    '[attr.aria-current]': 'checked() ? "page" : null',
  },
})
export class NxpNavItemDirective {
  /** Host element — exposed so `NxpNavComponent` can measure & focus it. */
  readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  /** Index assigned by the parent nav on enumeration. */
  readonly index = signal(-1);

  /** Whether this item's route is currently active. */
  readonly checked = signal(false);

  private readonly router = inject(Router);
  private readonly link = inject(RouterLink, { self: true, optional: true });

  constructor() {
    // Initial sync after RouterLink has resolved its urlTree.
    afterNextRender(() => this.syncActive());

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.syncActive());
  }

  private syncActive(): void {
    const tree = this.link?.urlTree;
    if (!tree) {
      this.checked.set(false);
      return;
    }
    this.checked.set(
      this.router.isActive(tree, {
        paths: 'exact',
        matrixParams: 'ignored',
        queryParams: 'ignored',
        fragment: 'ignored',
      }),
    );
  }
}
