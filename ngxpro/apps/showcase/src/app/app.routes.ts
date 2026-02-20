import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'text-morph',
    loadComponent: () =>
      import('./text-morph/text-morph.component').then(
        (m) => m.TextMorphDemoComponent,
      ),
  },
];
