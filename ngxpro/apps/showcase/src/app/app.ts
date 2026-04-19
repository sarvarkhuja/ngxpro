import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NxpRootComponent } from '@nxp/cdk/components/root';
import { NxpNavComponent, NxpNavItemDirective } from '@nxp/components/menu';
import { ThemeSwitcherComponent } from './components/theme-switcher.component';

interface NavItem {
  readonly path: string;
  readonly label: string;
}

@Component({
  imports: [
    RouterModule,
    RouterLink,
    ThemeSwitcherComponent,
    NxpRootComponent,
    NxpNavComponent,
    NxpNavItemDirective,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'nxp Showcase';

  protected readonly navItems: readonly NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/accordion', label: 'Accordion' },
    { path: '/alert', label: 'Alert' },
    { path: '/avatar', label: 'Avatar' },
    { path: '/slider', label: 'Slider' },
    { path: '/badge', label: 'Badge' },
    { path: '/block', label: 'Block' },
    { path: '/button', label: 'Button' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/calendar-month', label: 'Calendar Month' },
    { path: '/calendar-range', label: 'Calendar Range' },
    { path: '/data-list', label: 'Data List' },
    { path: '/checkbox', label: 'Checkbox' },
    { path: '/combo-box', label: 'Combo Box' },
    { path: '/date-inputs', label: 'Date Inputs' },
    { path: '/dialog', label: 'Dialog' },
    { path: '/drawer', label: 'Drawer' },
    { path: '/dropdown', label: 'Dropdown' },
    { path: '/icon', label: 'Icon' },
    { path: '/input', label: 'Input' },
    { path: '/input-chip', label: 'Input Chip' },
    { path: '/input-date', label: 'Input Date' },
    { path: '/input-date-range', label: 'Input Date Range' },
    { path: '/input-month', label: 'Input Month' },
    { path: '/input-pin', label: 'Input Pin' },
    { path: '/link', label: 'Link' },
    { path: '/menu', label: 'Menu' },
    { path: '/multi-select', label: 'Multi Select' },
    { path: '/notification', label: 'Notification' },
    { path: '/radio', label: 'Radio' },
    { path: '/segmented', label: 'Segmented' },
    { path: '/select', label: 'Select' },
    { path: '/stepper', label: 'Stepper' },
    { path: '/switch', label: 'Switch' },
    { path: '/tabs', label: 'Tabs' },
    { path: '/textarea', label: 'Textarea' },
    { path: '/textfield', label: 'Textfield' },
    { path: '/text-morph', label: 'Text Morph' },
    { path: '/tooltip', label: 'Tooltip' },
    { path: '/range', label: 'Range' },
  ];
}
