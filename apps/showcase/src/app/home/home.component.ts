import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from '@ngxpro/components/card';

/**
 * Showcase home component displaying all available nxp components.
 */
@Component({
  selector: 'app-home',
  imports: [CardComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
