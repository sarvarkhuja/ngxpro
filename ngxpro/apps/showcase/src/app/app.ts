import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from './components/theme-switcher.component';

@Component({
  imports: [RouterModule, ThemeSwitcherComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'nxp Showcase';
}
