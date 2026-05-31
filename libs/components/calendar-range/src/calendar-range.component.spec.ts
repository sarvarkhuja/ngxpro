import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarRangeComponent } from './calendar-range.component';

@Component({
  imports: [CalendarRangeComponent],
  template: `<nxp-calendar-range [value]="value()" />`,
})
class RangeHost {
  readonly value = signal<[Date, Date] | null>(null);
}

interface RangeInternals {
  leftYear(): number;
  leftMonthIdx(): number;
}

describe('CalendarRangeComponent view synchronisation', () => {
  function setup() {
    const fixture = TestBed.createComponent(RangeHost);
    fixture.detectChanges();
    const cmp = fixture.debugElement.query(By.directive(CalendarRangeComponent))
      .componentInstance as unknown as RangeInternals;
    return { fixture, host: fixture.componentInstance, cmp };
  }

  it('navigates the left calendar to a value set while mounted', () => {
    const { fixture, host, cmp } = setup();
    host.value.set([new Date(2030, 8, 10), new Date(2030, 8, 20)]); // Sep 2030
    fixture.detectChanges();
    expect(cmp.leftYear()).toBe(2030);
    expect(cmp.leftMonthIdx()).toBe(8);
  });

  it('follows a later value change to a different month', () => {
    const { fixture, host, cmp } = setup();
    host.value.set([new Date(2030, 8, 10), new Date(2030, 8, 20)]);
    fixture.detectChanges();
    host.value.set([new Date(2031, 1, 1), new Date(2031, 1, 5)]); // Feb 2031
    fixture.detectChanges();
    expect(cmp.leftYear()).toBe(2031);
    expect(cmp.leftMonthIdx()).toBe(1);
  });
});
