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
import { nxpInjectContext, NxpDynamicOutlet } from '@ngxpro/cdk/dynamic';
import type { NxpDialogContext } from './dialog.options';
import { NXP_DIALOGS_CLOSE } from './dialog-close.service';
import { NxpDialogCloseService } from './dialog-close.service';

const REQUIRED_ERROR = new Error('Required dialog was dismissed');

function toObservable<T>(valueOrStream: Observable<T> | T): Observable<T> {
  return isObservable(valueOrStream) ? valueOrStream : of(valueOrStream);
}

@Component({
  selector: 'nxp-dialog',
  imports: [NxpDynamicOutlet],
  template: `
    @if (context.closable) {
      <button
        type="button"
        class="absolute top-4 right-4 z-10 inline-flex items-center justify-center rounded-s p-1.5
               text-text-tertiary hover:text-text-primary hover:bg-bg-neutral-1
               outline-none outline-offset-2 focus-visible:outline-2 focus-visible:outline-border-focus
               transition-[background-color,color,transform] duration-fast ease-out
               active:scale-[0.98]"
        (click)="close$.next()"
        aria-label="Close"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    }

    @if (!primitive && context.label) {
      <header class="mb-4">
        <h2
          [id]="context.id"
          class="text-lg font-semibold tracking-body text-text-primary"
          [innerHTML]="context.label"
        ></h2>
      </header>
    }

    <ng-container *nxpDynamicOutlet="context.content as text; context: context">
      <header class="mb-4">
        <h2
          [id]="context.id"
          class="text-lg font-semibold tracking-body text-text-primary"
          [innerHTML]="context.label"
        ></h2>
        @if (text) {
          <p class="mt-1 text-sm text-text-secondary" [innerHTML]="text"></p>
        }
      </header>
      @if (context.closable || context.dismissible) {
        <footer
          class="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-m px-4 py-2 text-sm font-medium
                   bg-primary text-text-on-accent
                   hover:bg-primary-hover
                   active:bg-primary-pressed
                   outline-none outline-offset-2 focus-visible:outline-2 focus-visible:outline-border-focus
                   transition-[background-color,color,transform] duration-fast ease-out
                   active:scale-[0.98]"
            (click)="context.$implicit.complete()"
          >
            {{ context.data ?? 'OK' }}
          </button>
        </footer>
      }
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NxpDialogCloseService],
  styles: [
    `
      nxp-dialog {
        width: 37.5rem; /* medium (default) */
        max-width: calc(100vw - 2rem);
        max-height: calc(100svh - 4rem);
        overflow-y: auto;
        /* In-scale per design §5 (primary scale skips 20/24px). */
        padding: 2rem;
      }
      nxp-dialog[data-size='s'] {
        width: 25rem;
      }
      nxp-dialog[data-size='l'] {
        width: 50rem;
      }

      /* When closable, indent header to avoid overlap with the × button */
      nxp-dialog.nxp-dialog--closable > header {
        padding-inline-end: 2rem;
      }
    `,
  ],
  host: {
    class:
      'relative flex rounded-md flex-col bg-bg-base shadow-card-lg outline-none',
    '[attr.data-appearance]': 'context.appearance',
    '[attr.data-size]': 'context.size',
    '[class.nxp-dialog--closable]': 'context.closable',
  },
})
export class NxpDialogComponent<O, I> {
  protected readonly close$ = new Subject<void>();
  protected readonly context = nxpInjectContext<NxpDialogContext<O, I>>();

  protected readonly primitive =
    typeof this.context.content === 'function' ||
    Object(this.context.content) !== this.context.content;

  protected readonly sub = merge(
    this.close$.pipe(switchMap(() => toObservable(this.context.closable))),
    inject(NxpDialogCloseService).pipe(
      exhaustMap(() => toObservable(this.context.dismissible).pipe(take(1))),
    ),
    inject(NXP_DIALOGS_CLOSE, { optional: true })?.pipe(take(1)) ?? EMPTY,
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
