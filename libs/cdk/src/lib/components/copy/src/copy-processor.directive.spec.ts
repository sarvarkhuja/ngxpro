import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NxpCopyProcessorDirective,
  type NxpStringTransformer,
} from './copy-processor.directive';

@Component({
  standalone: true,
  imports: [NxpCopyProcessorDirective],
  template: `<div [nxpCopyProcessor]="transform" data-testid="target">lorem</div>`,
})
class HostComponent {
  transform: NxpStringTransformer = (s) => s.toUpperCase();
}

describe('NxpCopyProcessorDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('rewrites the clipboard payload via the transformer', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector(
      '[data-testid="target"]',
    ) as HTMLElement;

    const setData = vi.fn();
    const event = new Event('copy', {
      bubbles: true,
      cancelable: true,
    }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', {
      value: { setData },
      configurable: true,
    });

    vi.spyOn(window, 'getSelection').mockReturnValue({
      toString: () => 'hello',
    } as unknown as Selection);

    target.dispatchEvent(event);

    expect(setData).toHaveBeenCalledWith('text/plain', 'HELLO');
  });

  it('does nothing when selection is empty', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector(
      '[data-testid="target"]',
    ) as HTMLElement;

    const setData = vi.fn();
    const event = new Event('copy', {
      bubbles: true,
      cancelable: true,
    }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', {
      value: { setData },
      configurable: true,
    });

    vi.spyOn(window, 'getSelection').mockReturnValue({
      toString: () => '',
    } as unknown as Selection);

    target.dispatchEvent(event);

    expect(setData).not.toHaveBeenCalled();
  });
});
