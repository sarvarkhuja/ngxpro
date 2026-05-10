import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxpDocMainComponent } from '@ngxpro/addon-doc-lib/main';
import { NxpDocThemeSwitcherComponent } from '@ngxpro/addon-doc-lib/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [NxpDocMainComponent, NxpDocThemeSwitcherComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
