import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CellActionsDirective } from './cell-actions.directive';

@Component({
  standalone: true,
  imports: [CellActionsDirective],
  template: `
    <div nxpCellActions data-testid="actions">
      <button>Edit</button>
      <button>Delete</button>
    </div>
  `,
})
class TestComponent {}

describe('CellActionsDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, CellActionsDirective],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="actions"]',
    );
    expect(element).toBeTruthy();
  });

  it('should apply positioning classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="actions"]',
    );

    expect(element.classList.contains('absolute')).toBe(true);
    expect(element.classList.contains('right-0')).toBe(true);
    expect(element.classList.contains('z-10')).toBe(true);
  });

  it('should apply flex layout classes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="actions"]',
    );

    expect(element.classList.contains('flex')).toBe(true);
    expect(element.classList.contains('items-center')).toBe(true);
    expect(element.classList.contains('gap-2')).toBe(true);
  });

  it('should apply padding to match cell', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="actions"]',
    );

    expect(element.classList.contains('pr-4')).toBe(true);
  });
});
