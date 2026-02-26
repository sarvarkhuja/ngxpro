import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxpRootComponent } from '@nxp/cdk/components/root';
import { ThemeSwitcherComponent } from './components/theme-switcher.component';

@Component({
  imports: [RouterModule, ThemeSwitcherComponent, NxpRootComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'nxp Showcase';
}
