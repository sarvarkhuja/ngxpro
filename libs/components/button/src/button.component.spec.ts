import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

/** A developer-authored inline SVG, exactly like the showcase `geistIcon()` helper. */
const SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';

@Component({
  imports: [ButtonComponent],
  template: `
    <button nxpButton [iconStart]="svg">Start</button>
    <button nxpButton [iconEnd]="svg" data-end>End</button>
  `,
})
class ButtonHost {
  readonly svg = SVG;
}

describe('ButtonComponent icon slots', () => {
  it('renders the [iconStart] SVG markup (Angular must not sanitize it away)', () => {
    const fixture = TestBed.createComponent(ButtonHost);
    fixture.detectChanges();
    const startBtn: HTMLElement =
      fixture.nativeElement.querySelector('button[nxpButton]');

    // With a raw-string [innerHTML] binding, Angular's HTML sanitizer strips
    // <svg>/<path> (they are not in the HTML allowlist) and these are null.
    expect(startBtn.querySelector('svg')).toBeTruthy();
    expect(startBtn.querySelector('path')).toBeTruthy();
  });

  it('renders the [iconEnd] SVG markup', () => {
    const fixture = TestBed.createComponent(ButtonHost);
    fixture.detectChanges();
    const endBtn: HTMLElement =
      fixture.nativeElement.querySelector('button[data-end]');

    expect(endBtn.querySelector('svg')).toBeTruthy();
  });
});

@Component({
  imports: [ButtonComponent],
  template: `
    <button nxpButton size="icon-sm" data-icon aria-label="Add">
      <span data-marker>+</span>
    </button>
    <button nxpButton data-text>
      <span data-marker>Label</span>
    </button>
  `,
})
class ProjectionHost {}

describe('ButtonComponent content projection', () => {
  it('projects <ng-content> children for an icon-only button', () => {
    const fixture = TestBed.createComponent(ProjectionHost);
    fixture.detectChanges();
    const iconBtn: HTMLElement =
      fixture.nativeElement.querySelector('button[data-icon]');

    expect(iconBtn.querySelector('[data-marker]')).toBeTruthy();
  });

  it('projects <ng-content> children for a text button', () => {
    const fixture = TestBed.createComponent(ProjectionHost);
    fixture.detectChanges();
    const textBtn: HTMLElement =
      fixture.nativeElement.querySelector('button[data-text]');

    expect(textBtn.querySelector('[data-marker]')).toBeTruthy();
  });
});
