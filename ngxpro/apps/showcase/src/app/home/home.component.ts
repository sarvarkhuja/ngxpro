import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CellDirective,
  ExpandComponent,
  SubtitleDirective,
  TitleDirective,
} from '@ngxpro/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@ngxpro/components/accordion';
import { AvatarComponent } from '@ngxpro/components/avatar';
import { ButtonComponent } from '@ngxpro/components/button';
import { CardComponent } from '@ngxpro/components/card';
import { AmountPipe } from '@ngxpro/core';

interface Operation {
  title: string;
  subtitle?: string;
  sum?: number;
  time?: string;
}

/**
 * Showcase home component displaying all available ngxpro components.
 */
@Component({
  selector: 'app-home',
  imports: [
    AccordionComponent,
    AccordionTriggerComponent,
    AmountPipe,
    AvatarComponent,
    ButtonComponent,
    CardComponent,
    CellDirective,
    ExpandComponent,
    KeyValuePipe,
    RouterModule,
    SubtitleDirective,
    TitleDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  /** Sample operations grouped by category for custom accordion demo. */
  readonly operations: Record<string, Operation[]> = {
    Income: [
      { title: 'Salary', subtitle: 'Monthly', sum: 5000, time: 'Feb 15' },
      { title: 'Freelance', subtitle: 'Project X', sum: 1200, time: 'Feb 14' },
      { title: 'Dividends', subtitle: 'Portfolio', sum: 150, time: 'Feb 10' },
    ],
    Expenses: [
      { title: 'Rent', subtitle: 'Monthly', sum: -1500, time: 'Feb 1' },
      {
        title: 'Utilities',
        subtitle: 'Electric + Gas',
        sum: -120,
        time: 'Feb 5',
      },
    ],
    Pending: [],
  };

  sum(items: Operation[]): number {
    return items.reduce((acc, op) => acc + (op.sum ?? 0), 0);
  }
}
