import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CellDirective } from './cell.directive';

@Component({
  standalone: true,
  imports: [CellDirective],
  template: `
    <div nxpCell="m" [height]="height" data-testid="cell">Content</div>
  `,
})
class TestComponent {
  height: 'compact' | 'normal' | 'spacious' = 'normal';
}

describe('CellDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, CellDirective],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');
    expect(element).toBeTruthy();
  });

  it('should apply base classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    expect(element.classList.contains('flex')).toBe(true);
    expect(element.classList.contains('items-center')).toBe(true);
    expect(element.classList.contains('relative')).toBe(true);
  });

  it('should apply size-specific classes for size "m"', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    expect(element.classList.contains('py-3')).toBe(true);
    expect(element.classList.contains('px-4')).toBe(true);
    expect(element.classList.contains('gap-3')).toBe(true);
    expect(element.classList.contains('min-h-[52px]')).toBe(true);
  });

  it('should apply compact height classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.height = 'compact';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    expect(element.classList.contains('py-0')).toBe(true);
  });

  it('should apply spacious height classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.height = 'spacious';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    // For size 'm' with spacious height, should have py-4
    expect(element.classList.contains('py-4')).toBe(true);
  });

  it('should set data-size attribute', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    expect(element.getAttribute('data-size')).toBe('m');
  });

  it('should set data-height attribute', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    expect(element.getAttribute('data-height')).toBe('normal');
  });

  it('should apply group/cell class for hover interactions', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="cell"]');

    expect(element.classList.contains('group/cell')).toBe(true);
  });
});
