import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  exhaustMap,
  filter,
  isObservable,
  merge,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';
import { injectContext, PolymorpheusOutlet } from '@taiga-ui/polymorpheus';
import type { NxpDialogContext } from './dialog.options';
import { NXP_DIALOGS_CLOSE } from './dialog-close.service';
import { NxpDialogCloseService } from './dialog-close.service';

const REQUIRED_ERROR = new Error('Required dialog was dismissed');

function toObservable<T>(valueOrStream: Observable<T> | T): Observable<T> {
  return isObservable(valueOrStream) ? valueOrStream : of(valueOrStream);
}

@Component({
  selector: 'nxp-dialog',
  standalone: true,
  imports: [PolymorpheusOutlet],
  template: `
    @if (context.closable) {
      <button
        type="button"
        class="absolute top-4 right-4 z-10 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
        (click)="close$.next()"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    }

    @if (!primitive && context.label) {
      <header class="mb-4">
        <h2 [id]="context.id" class="text-lg font-semibold" [innerHTML]="context.label"></h2>
      </header>
    }

    <ng-container *polymorpheusOutlet="context.content as text; context: context">
      <header class="mb-4">
        <h2 [id]="context.id" class="text-lg font-semibold" [innerHTML]="context.label"></h2>
        @if (text) {
          <p class="mt-1 text-gray-600 dark:text-gray-400" [innerHTML]="text"></p>
        }
      </header>
      @if (context.closable || context.dismissible) {
        <footer class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            (click)="context.$implicit.complete()"
          >
            {{ context.data ?? 'OK' }}
          </button>
        </footer>
      }
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [NxpDialogCloseService],
  host: {
    class: 'relative rounded-xl bg-white dark:bg-gray-900 shadow-xl p-6 min-w-[16rem] max-w-[calc(100vw-2rem)]',
    '[attr.data-appearance]': 'context.appearance',
    '[attr.data-size]': 'context.size',
  },
})
export class NxpDialogComponent<O, I> {
  protected readonly close$ = new Subject<void>();
  protected readonly context = injectContext<NxpDialogContext<O, I>>();

  protected readonly primitive =
    typeof this.context.content === 'function' ||
    Object(this.context.content) !== this.context.content;

  protected readonly sub = merge(
    this.close$.pipe(switchMap(() => toObservable(this.context.closable))),
    inject(NxpDialogCloseService).pipe(
      exhaustMap(() =>
        toObservable(this.context.dismissible).pipe(take(1))
      )
    ),
    inject(NXP_DIALOGS_CLOSE, { optional: true })?.pipe(take(1)) ?? EMPTY
  )
    .pipe(filter(Boolean), takeUntilDestroyed())
    .subscribe(() => {
      if (this.context.required) {
        this.context.$implicit.error(REQUIRED_ERROR);
      } else {
        this.context.$implicit.complete();
      }
    });
}
