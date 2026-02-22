import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent as NxpButton, type ButtonVariant, type ButtonSize } from '@nxp/components/button';
import { TextMorphComponent } from '@nxp/components/text-morph';

@Component({
  selector: 'app-button-demo',
  imports: [NxpButton, RouterModule, TextMorphComponent],
  templateUrl: './button.component.html',
})
export class ButtonDemoComponent {
  readonly variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
  readonly sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

  // TextMorph demos
  readonly submitLabel = signal('Submit');
  readonly followLabel = signal('Follow');
  readonly deleteLabel = signal('Delete');

  toggleSubmit(): void {
    this.submitLabel.update((v) => v === 'Submit' ? 'Submitting...' : v === 'Submitting...' ? 'Submitted!' : 'Submit');
  }

  toggleFollow(): void {
    this.followLabel.update((v) => v === 'Follow' ? 'Following' : 'Follow');
  }

  toggleDelete(): void {
    this.deleteLabel.update((v) => v === 'Delete' ? 'Are you sure?' : v === 'Are you sure?' ? 'Deleted!' : 'Delete');
  }
}
