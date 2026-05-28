import type { Route } from '@angular/router';

export const docRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./doc-shell.component').then((m) => m.DocShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./doc-overview.component').then(
            (m) => m.DocOverviewComponent,
          ),
        data: { title: 'Overview' },
      },
      {
        path: 'button',
        loadComponent: () =>
          import('./doc-button.component').then((m) => m.DocButtonComponent),
        data: { title: 'Doc Page Sample' },
      },
    ],
  },
];
