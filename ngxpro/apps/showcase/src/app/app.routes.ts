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
    path: 'accordion',
    loadComponent: () =>
      import('./accordion/accordion-demo.component').then(
        (m) => m.AccordionDemoComponent,
      ),
  },
  {
    path: 'avatar',
    loadComponent: () =>
      import('./avatar/avatar-demo.component').then(
        (m) => m.AvatarDemoComponent,
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
    path: 'input-date',
    loadComponent: () =>
      import('./input-date/input-date-demo.component').then(
        (m) => m.InputDateDemoComponent,
      ),
  },
  {
    path: 'input-date-range',
    loadComponent: () =>
      import('./input-date-range/input-date-range-demo.component').then(
        (m) => m.InputDateRangeDemoComponent,
      ),
  },
  {
    path: 'input-month',
    loadComponent: () =>
      import('./input-month/input-month-demo.component').then(
        (m) => m.InputMonthDemoComponent,
      ),
  },
  {
    path: 'input-pin',
    loadComponent: () =>
      import('./input-pin/input-pin-demo.component').then(
        (m) => m.InputPinDemoComponent,
      ),
  },
  {
    path: 'date-inputs',
    loadComponent: () =>
      import('./date-inputs/date-inputs-demo.component').then(
        (m) => m.DateInputsDemoComponent,
      ),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('./dialog/dialog-demo.component').then(
        (m) => m.DialogDemoComponent,
      ),
  },
  {
    path: 'drawer',
    loadComponent: () =>
      import('./drawer/drawer-demo.component').then(
        (m) => m.DrawerDemoComponent,
      ),
  },
  {
    path: 'dropdown',
    loadComponent: () =>
      import('./dropdown/dropdown-demo.component').then(
        (m) => m.DropdownDemoComponent,
      ),
  },
  {
    path: 'input-chip',
    loadComponent: () =>
      import('./input-chip/input-chip-demo.component').then(
        (m) => m.InputChipDemoComponent,
      ),
  },
  {
    path: 'icon',
    loadComponent: () =>
      import('./icon/icon-demo.component').then((m) => m.IconDemoComponent),
  },
  {
    path: 'multi-select',
    loadComponent: () =>
      import('./multi-select/multi-select-demo.component').then(
        (m) => m.MultiSelectDemoComponent,
      ),
  },
  {
    path: 'link',
    loadComponent: () =>
      import('./link/link-demo.component').then((m) => m.LinkDemoComponent),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./input/input-demo.component').then((m) => m.InputDemoComponent),
  },
  {
    path: 'textfield',
    loadComponent: () =>
      import('./textfield/textfield-demo.component').then(
        (m) => m.TextfieldDemoComponent,
      ),
  },
  {
    path: 'radio',
    loadComponent: () =>
      import('./radio/radio-demo.component').then((m) => m.RadioDemoComponent),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./checkbox/checkbox-demo.component').then(
        (m) => m.CheckboxDemoComponent,
      ),
  },
  {
    path: 'switch',
    loadComponent: () =>
      import('./switch/switch-demo.component').then(
        (m) => m.SwitchDemoComponent,
      ),
  },
  {
    path: 'notification',
    loadComponent: () =>
      import('./notification/notification-demo.component').then(
        (m) => m.NotificationDemoComponent,
      ),
  },
  {
    path: 'alert',
    loadComponent: () =>
      import('./alert/alert-demo.component').then(
        (m) => m.AlertDemoComponent,
      ),
  },
  {
    path: 'badge',
    loadComponent: () =>
      import('./badge/badge-demo.component').then(
        (m) => m.BadgeDemoComponent,
      ),
  },
  {
    path: 'block',
    loadComponent: () =>
      import('./block/block-demo.component').then(
        (m) => m.BlockDemoComponent,
      ),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs-demo.component').then(
        (m) => m.TabsDemoComponent,
      ),
  },
  {
    path: 'segmented',
    loadComponent: () =>
      import('./segmented/segmented-demo.component').then(
        (m) => m.SegmentedDemoComponent,
      ),
  },
  {
    path: 'combo-box',
    loadComponent: () =>
      import('./combo-box/combo-box-demo.component').then(
        (m) => m.ComboBoxDemoComponent,
      ),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./select/select-demo.component').then(
        (m) => m.SelectDemoComponent,
      ),
  },
];
