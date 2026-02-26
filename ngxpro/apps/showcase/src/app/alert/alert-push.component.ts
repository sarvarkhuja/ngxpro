import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import {
  NxpAlertDirective,
  type NxpPortalContext,
  type NxpPositionOptions,
} from '@nxp/cdk';
import { PolymorpheusOutlet } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-alert-push',
  standalone: true,
  imports: [PolymorpheusOutlet],
  hostDirectives: [NxpAlertDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class:
      'pointer-events-auto flex gap-3 p-4 rounded-lg border shadow-lg min-w-[280px] max-w-sm border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 transition-all duration-200',
  },
  template: `
    <span class="flex-1 min-w-0">
      <ng-container *polymorpheusOutlet="context.content as text">{{ text }}</ng-container>
    </span>
    <button
      type="button"
      class="shrink-0 p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
      aria-label="Close"
      (click)="context.$implicit.complete()"
    >
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  `,
})
export class AlertPushComponent {
  protected readonly context =
    injectContext<NxpPortalContext<NxpPositionOptions, void>>();
}
