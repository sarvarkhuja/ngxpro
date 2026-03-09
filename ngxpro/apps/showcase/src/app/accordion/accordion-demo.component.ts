import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CellDirective,
  ExpandComponent,
  SubtitleDirective,
  TitleDirective,
} from '@nxp/cdk';
import {
  AccordionComponent,
  AccordionTriggerComponent,
} from '@nxp/components/accordion';
import { AvatarComponent } from '@nxp/components/avatar';
import { ButtonComponent } from '@nxp/components/button';
import { NxpTabs } from '@nxp/components/tabs';
import { AmountPipe } from '@nxp/core';

interface Operation {
  title: string;
  subtitle?: string;
  sum?: number;
  time?: string;
}

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KeyValuePipe,
    RouterModule,
    AccordionComponent,
    AccordionTriggerComponent,
    AmountPipe,
    AvatarComponent,
    ButtonComponent,
    CellDirective,
    ExpandComponent,
    NxpTabs,
    SubtitleDirective,
    TitleDirective,
  ],
  templateUrl: './accordion-demo.component.html',
})
export class AccordionDemoComponent {
  /** Active demo tab (0: Multiple, 1: Single, 2: Operations). */
  readonly accordionTab = signal(0);

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
