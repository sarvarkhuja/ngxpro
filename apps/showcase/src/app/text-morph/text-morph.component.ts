import { Component, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  TextMorphDirective,
  TextMorphComponent as NgxproTextMorph,
} from '@ngxpro/components/text-morph';
import { ButtonComponent } from '@ngxpro/components/button';
import { CardComponent } from '@ngxpro/components/card';
import { NxpTooltipDirective } from '@ngxpro/components/tooltip';
import { nxpWriteToClipboard } from '@ngxpro/cdk';

@Component({
  selector: 'app-text-morph-demo',
  imports: [
    TextMorphDirective,
    NgxproTextMorph,
    ButtonComponent,
    CardComponent,
    NxpTooltipDirective,
  ],
  templateUrl: './text-morph.component.html',
  styleUrl: './text-morph.component.scss',
})
export class TextMorphDemoComponent {
  private readonly doc = inject(DOCUMENT);

  // Demo: Tooltip with morphing label
  readonly copyLabel = signal<'Copy' | 'Copied'>('Copy');
  readonly copyValue = 'npm install ngxpro/components --legacy-peer-deps';
  private copyResetId: ReturnType<typeof setTimeout> | null = null;

  async copyToClipboard(): Promise<void> {
    const ok = await nxpWriteToClipboard(this.copyValue, this.doc);
    if (!ok) return;
    this.copyLabel.set('Copied');
    if (this.copyResetId !== null) clearTimeout(this.copyResetId);
    this.copyResetId = setTimeout(() => {
      this.copyLabel.set('Copy');
      this.copyResetId = null;
    }, 1500);
  }

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
