import { Component, Injectable, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NXP_DROPDOWN_COMPONENT,
  NXP_IS_BROWSER,
  NxpDropdownComponent,
  NxpPortalService,
} from '@ngxpro/cdk';
import { InputDateRangeComponent } from './input-date-range.component';

// A no-op portal host so mounting the calendar dropdown (which the component's
// NxpDropdownDirective host directive does through NxpPortalService) doesn't
// throw "NxpPortalService has no host" under TestBed. Mirrors the stub in
// combo-box.component.spec.ts.
@Injectable()
class StubPortalService extends NxpPortalService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override add(): any {
    return {
      destroy: () => undefined,
      instance: {},
      injector: Injector.NULL,
      location: { nativeElement: document.createElement('div') },
      changeDetectorRef: {
        detectChanges: () => undefined,
        markForCheck: () => undefined,
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override addTemplate(): any {
    return { destroy: () => undefined };
  }
}

@Component({
  imports: [InputDateRangeComponent],
  template: `
    <nxp-input-date-range
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [maxLength]="maxLength()"
      (valueChange)="value.set($event)"
    />
  `,
})
class RangeHost {
  readonly value = signal<[Date, Date] | null>(null);
  readonly min = signal<Date | null>(null);
  readonly max = signal<Date | null>(null);
  readonly maxLength = signal<number | null>(null);
}

describe('InputDateRangeComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NxpPortalService, useClass: StubPortalService },
        { provide: NXP_DROPDOWN_COMPONENT, useValue: NxpDropdownComponent },
        { provide: NXP_IS_BROWSER, useValue: false },
      ],
    });
    const fixture = TestBed.createComponent(RangeHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    function type(text: string): void {
      input.value = text;
      input.setSelectionRange(text.length, text.length);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    }

    function blur(): void {
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    }

    return { fixture, host, input, type, blur };
  }

  it('masks typed digits into a DD/MM/YYYY – DD/MM/YYYY range', () => {
    const { input, type } = setup();
    type('3112202601012027');
    expect(input.value).toBe('31/12/2026 – 01/01/2027');
  });

  it('appends the separator once the start date completes', () => {
    const { input, type } = setup();
    type('31122026');
    expect(input.value).toBe('31/12/2026 – ');
  });

  it('ignores non-digit characters', () => {
    const { input, type } = setup();
    type('xx31');
    expect(input.value).toBe('31/');
  });

  it('emits the parsed range on blur of a valid entry', () => {
    const { host, type, blur } = setup();
    type('3112202601012027');
    blur();
    const v = host.value();
    expect(v).not.toBeNull();
    expect(v?.[0]?.getFullYear()).toBe(2026);
    expect(v?.[1]?.getFullYear()).toBe(2027);
  });

  it('flags an incomplete range as invalid and keeps the text', () => {
    const { host, input, type, blur } = setup();
    type('31122026'); // only the start date
    blur();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.value).toBe('31/12/2026 – ');
    expect(host.value()).toBeNull();
  });

  it('flags a range that violates maxLength as invalid', () => {
    const { fixture, host, input, type, blur } = setup();
    host.maxLength.set(3);
    fixture.detectChanges();
    type('0101202606012026'); // 01/01 – 06/01, 5-day delta > maxLength
    blur();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(host.value()).toBeNull();
  });

  it('clamps range endpoints into the min/max bounds on blur', () => {
    const { fixture, host, input, type, blur } = setup();
    host.min.set(new Date(2026, 0, 1)); // 01/01/2026
    host.max.set(new Date(2026, 11, 31)); // 31/12/2026
    fixture.detectChanges();
    type('0101202006012040'); // 01/01/2020 – 06/01/2040 — both out of bounds
    blur();
    const v = host.value();
    expect(v).not.toBeNull();
    expect(v?.[0].getFullYear()).toBe(2026);
    expect(v?.[0].getMonth()).toBe(0);
    expect(v?.[0].getDate()).toBe(1);
    expect(v?.[1].getFullYear()).toBe(2026);
    expect(v?.[1].getMonth()).toBe(11);
    expect(v?.[1].getDate()).toBe(31);
    expect(input.value).toBe('01/01/2026 – 31/12/2026');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });
});
