import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'nxp-drawer',
  standalone: true,
  template: `
    <aside class="nxp-drawer__aside">
      <div class="nxp-drawer__scroll">
        <ng-content select="header" />
        <div class="nxp-drawer__content">
          <ng-content />
        </div>
      </div>
      <ng-content select="footer" />
    </aside>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nxp-drawer',
    '[attr.data-direction]': 'direction()',
    '[class.nxp-drawer--overlay]': 'overlay()',
  },
  styles: [`
    .nxp-drawer {
      position: fixed;
      top: max(3rem, env(safe-area-inset-top));
      bottom: 0;
      inline-size: 36.25rem;
      max-inline-size: calc(100vw - 3rem);
      z-index: 1000;
      border-top-left-radius: 1.25rem;
      border-top-right-radius: 1.25rem;
      overflow: hidden;
    }

    .nxp-drawer[data-direction='start'] {
      inset-inline-start: 0;
      border-start-start-radius: 0;
      animation: nxp-drawer-slide-start 0.25s ease-out;
    }

    .nxp-drawer[data-direction='end'] {
      inset-inline-end: 0;
      border-start-end-radius: 0;
      animation: nxp-drawer-slide-end 0.25s ease-out;
    }

    .nxp-drawer--overlay {
      top: 0;
      border-radius: 0;
    }

    .nxp-drawer--overlay::before {
      content: '';
      position: fixed;
      inset: -100vh -100vw;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }

    .nxp-drawer__aside {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
      padding-bottom: env(safe-area-inset-bottom);
    }

    :is(.dark) .nxp-drawer__aside {
      background: rgb(17, 24, 39);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
    }

    .nxp-drawer__scroll {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .nxp-drawer__content {
      padding: 1.25rem 1.5rem;
    }

    .nxp-drawer__aside > footer {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      border-top: 1px solid rgb(229, 231, 235);
      background: white;
      overflow-x: auto;
    }

    :is(.dark) .nxp-drawer__aside > footer {
      border-top-color: rgb(55, 65, 81);
      background: rgb(17, 24, 39);
    }

    .nxp-drawer__aside > .nxp-drawer__scroll > header {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem 1.5rem 0.75rem;
      border-bottom: 1px solid rgb(229, 231, 235);
      background: white;
    }

    :is(.dark) .nxp-drawer__aside > .nxp-drawer__scroll > header {
      border-bottom-color: rgb(55, 65, 81);
      background: rgb(17, 24, 39);
    }

    @keyframes nxp-drawer-slide-start {
      from { transform: translateX(-100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }

    @keyframes nxp-drawer-slide-end {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `],
})
export class DrawerComponent {
  readonly direction = input<'start' | 'end'>('end');
  readonly overlay = input(false);
}
