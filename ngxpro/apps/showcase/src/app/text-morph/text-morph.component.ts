import { Component, signal, computed } from '@angular/core';
import {
  TextMorphDirective,
  TextMorphComponent as NgxproTextMorph,
} from '@nxp/components/text-morph';
import { ButtonComponent } from '@nxp/components/button';
import { CardComponent } from '@nxp/components/card';

@Component({
  selector: 'app-text-morph-demo',
  imports: [
    TextMorphDirective,
    NgxproTextMorph,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './text-morph.component.html',
  styleUrl: './text-morph.component.scss',
})
export class TextMorphDemoComponent {
  // Demo 1: Simple counter
  readonly count = signal(0);
  readonly countLabel = computed(() => `Count: ${this.count()}`);

  // Demo 2: Greeting cycle
  private readonly greetings = [
    'Hello, World!',
    'Bonjour, le Monde!',
    'Hola, Mundo!',
    'Hallo, Welt!',
    'Ciao, Mondo!',
    'Olá, Mundo!',
    'Merhaba, Dünya!',
  ];
  private readonly actions = [
    'Confirm',
    'Cancel',
    'Delete',
    'Edit',
    'Save',
    'Close',
    'Open',
    'Submit',
    'Reset',
  ];
  readonly greetingIndex = signal(0);
  readonly actionIndex = signal(0);
  readonly action = computed(
    () => this.actions[this.actionIndex() % this.actions.length]!,
  );
  readonly greeting = computed(
    () => this.greetings[this.greetingIndex() % this.greetings.length]!,
  );

  // Demo 3: Currency
  readonly price = signal(1234.56);
  readonly formattedPrice = computed(
    () =>
      `$${this.price().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  );

  // Demo 4: Status
  private readonly statuses = ['Copying to clipboard', 'Copied to clipboard'];
  readonly statusIndex = signal(0);
  readonly status = computed(
    () => this.statuses[this.statusIndex() % this.statuses.length]!,
  );

  increment(): void {
    this.count.update((c) => c + 1);
  }

  decrement(): void {
    this.count.update((c) => c - 1);
  }

  nextGreeting(): void {
    this.greetingIndex.update((i) => i + 1);
  }

  nextAction(): void {
    this.actionIndex.update((i) => i + 1);
  }

  randomPrice(): void {
    this.price.set(Math.round(Math.random() * 100000) / 100);
  }

  nextStatus(): void {
    this.statusIndex.update((i) => i + 1);
  }
}
