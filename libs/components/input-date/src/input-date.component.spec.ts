import { Component, Injectable, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NXP_DROPDOWN_COMPONENT,
  NXP_IS_BROWSER,
  NxpDropdownComponent,
  NxpPortalService,
} from '@ngxpro/cdk';
import { InputDateComponent } from './input-date.component';

// A no-op portal host so mounting the calendar dropdown (which the component's
// NxpDropdownDirective host directive does through NxpPortalService) doesn't
// throw "NxpPortalService has no host" under TestBed. These specs assert
// component/form state, not the rendered overlay. Mirrors the stub in
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
  imports: [InputDateComponent],
  template: `
    <nxp-input-date
      [value]="value()"
      [min]="min()"
      [max]="max()"
      (valueChange)="value.set($event)"
    />
  `,
})
class DateHost {
  readonly value = signal<Date | null>(null);
  readonly min = signal<Date | null>(null);
  readonly max = signal<Date | null>(null);
}

describe('InputDateComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NxpPortalService, useClass: StubPortalService },
        { provide: NXP_DROPDOWN_COMPONENT, useValue: NxpDropdownComponent },
        { provide: NXP_IS_BROWSER, useValue: false },
      ],
    });
    const fixture = TestBed.createComponent(DateHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const cmp = fixture.debugElement.query(By.directive(InputDateComponent))
      .componentInstance as InputDateComponent;
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

    return { fixture, host, cmp, input, type, blur };
  }

  it('masks typed digits into DD/MM/YYYY', () => {
    const { input, type } = setup();
    type('31122026');
    expect(input.value).toBe('31/12/2026');
  });

  it('ignores non-digit characters', () => {
    const { input, type } = setup();
    type('ab31cd');
    expect(input.value).toBe('31/');
  });

  it('auto-pads a high first day digit', () => {
    const { input, type } = setup();
    type('5');
    expect(input.value).toBe('05/');
  });

  it('emits the parsed Date on blur of a valid entry', () => {
    const { host, type, blur } = setup();
    type('31122026');
    blur();
    const v = host.value();
    expect(v).toBeInstanceOf(Date);
    expect(v?.getDate()).toBe(31);
    expect(v?.getMonth()).toBe(11);
    expect(v?.getFullYear()).toBe(2026);
  });

  it('flags an impossible date as invalid and keeps the text', () => {
    const { host, input, type, blur } = setup();
    type('31022026'); // 31/02/2026 — does not exist
    blur();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.value).toBe('31/02/2026');
    expect(host.value()).toBeNull();
  });

  it('clamps a date after max down to max on blur', () => {
    const { fixture, host, input, type, blur } = setup();
    host.max.set(new Date(2026, 0, 1)); // 01/01/2026
    fixture.detectChanges();
    type('31122026'); // 31/12/2026 — after max
    blur();
    const v = host.value();
    expect(v).toBeInstanceOf(Date);
    expect(v?.getFullYear()).toBe(2026);
    expect(v?.getMonth()).toBe(0);
    expect(v?.getDate()).toBe(1);
    expect(input.value).toBe('01/01/2026');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('clamps a date before min up to min on blur', () => {
    const { fixture, host, input, type, blur } = setup();
    host.min.set(new Date(2026, 5, 15)); // 15/06/2026
    fixture.detectChanges();
    type('01012020'); // 01/01/2020 — before min
    blur();
    const v = host.value();
    expect(v).toBeInstanceOf(Date);
    expect(v?.getFullYear()).toBe(2026);
    expect(v?.getMonth()).toBe(5);
    expect(v?.getDate()).toBe(15);
    expect(input.value).toBe('15/06/2026');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('clears the value when emptied', () => {
    const { host, input, type, blur } = setup();
    type('31122026');
    blur();
    expect(host.value()).not.toBeNull();
    type('');
    blur();
    expect(host.value()).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('previews a complete typed date in the calendar without committing it', () => {
    const { host, cmp, type } = setup();
    type('15082027'); // 15/08/2027 — complete + valid, no blur yet
    // The calendar reflects the in-progress draft immediately…
    const preview = (
      cmp as unknown as { calendarValue(): Date | null }
    ).calendarValue();
    expect(preview).toBeInstanceOf(Date);
    expect(preview?.getFullYear()).toBe(2027);
    expect(preview?.getMonth()).toBe(7);
    expect(preview?.getDate()).toBe(15);
    // …but the committed value / form output stays null until blur.
    expect(host.value()).toBeNull();
  });

  it('does not preview an incomplete typed date', () => {
    const { cmp, type } = setup();
    type('1508'); // partial — should not yield a draft
    expect(
      (cmp as unknown as { calendarValue(): Date | null }).calendarValue(),
    ).toBeNull();
  });

  it('does not preview a typed date outside min/max bounds', () => {
    const { fixture, host, cmp, type } = setup();
    host.max.set(new Date(2026, 0, 1));
    fixture.detectChanges();
    type('31122026'); // after max
    expect(
      (cmp as unknown as { calendarValue(): Date | null }).calendarValue(),
    ).toBeNull();
  });
});
