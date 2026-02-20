import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleDirective } from './title.directive';
import { SubtitleDirective } from './cell-subtitle.directive';

@Component({
  standalone: true,
  imports: [TitleDirective, SubtitleDirective],
  template: `
    <div [ngxproTitle]="size" data-testid="title">
      <div>Main Title</div>
      <div ngxproSubtitle data-testid="subtitle">Subtitle</div>
    </div>
  `,
})
class TestComponent {
  size: 's' | 'm' | 'l' | '' = '';
}

describe('TitleDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, TitleDirective, SubtitleDirective],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');
    expect(element).toBeTruthy();
  });

  it('should apply base classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');

    expect(element.classList.contains('flex')).toBe(true);
    expect(element.classList.contains('flex-col')).toBe(true);
    expect(element.classList.contains('min-w-0')).toBe(true);
    expect(element.classList.contains('text-left')).toBe(true);
    expect(element.classList.contains('gap-1')).toBe(true);
  });

  it('should apply small size classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.size = 's';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');

    expect(element.classList.contains('text-sm')).toBe(true);
    expect(element.classList.contains('gap-0.5')).toBe(true);
  });

  it('should apply medium size classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.size = 'm';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');

    expect(element.classList.contains('text-lg')).toBe(true);
    expect(element.classList.contains('gap-0.5')).toBe(true);
  });

  it('should apply large size classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.size = 'l';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');

    expect(element.classList.contains('text-2xl')).toBe(true);
    expect(element.classList.contains('gap-2')).toBe(true);
  });

  it('should set data-size attribute when size is provided', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.size = 'l';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');

    expect(element.getAttribute('data-size')).toBe('l');
  });

  it('should not set data-size attribute when size is empty', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.size = '';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="title"]');

    expect(element.getAttribute('data-size')).toBeNull();
  });
});

describe('SubtitleDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, TitleDirective, SubtitleDirective],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="subtitle"]');
    expect(element).toBeTruthy();
  });

  it('should apply subtitle classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('[data-testid="subtitle"]');

    expect(element.classList.contains('flex')).toBe(true);
    expect(element.classList.contains('items-center')).toBe(true);
    expect(element.classList.contains('gap-1')).toBe(true);
    expect(element.classList.contains('text-sm')).toBe(true);
    expect(element.classList.contains('text-gray-600')).toBe(true);
  });
});
