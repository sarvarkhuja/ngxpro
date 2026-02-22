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
  {
    path: 'button',
    loadComponent: () =>
      import('./button/button.component').then(
        (m) => m.ButtonDemoComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./calendar/calendar-demo.component').then(
        (m) => m.CalendarDemoComponent,
      ),
  },
  {
    path: 'calendar-month',
    loadComponent: () =>
      import('./calendar-month/calendar-month-demo.component').then(
        (m) => m.CalendarMonthDemoComponent,
      ),
  },
  {
    path: 'calendar-range',
    loadComponent: () =>
      import('./calendar-range/calendar-range-demo.component').then(
        (m) => m.CalendarRangeDemoComponent,
      ),
  },
  {
    path: 'date-inputs',
    loadComponent: () =>
      import('./date-inputs/date-inputs-demo.component').then(
        (m) => m.DateInputsDemoComponent,
      ),
  },
];
