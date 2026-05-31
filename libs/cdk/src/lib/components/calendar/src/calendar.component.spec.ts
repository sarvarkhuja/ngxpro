import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarComponent } from './calendar.component';

@Component({
  imports: [CalendarComponent],
  template: `
    <nxp-calendar [value]="value()" [month]="month()" [year]="year()" />
  `,
})
class CalHost {
  readonly value = signal<Date | [Date, Date] | null>(null);
  readonly month = signal<number | undefined>(undefined);
  readonly year = signal<number | undefined>(undefined);
}

describe('CalendarComponent view synchronisation', () => {
  function setup() {
    const fixture = TestBed.createComponent(CalHost);
    fixture.detectChanges();
    const cmp = fixture.debugElement.query(By.directive(CalendarComponent))
      .componentInstance as CalendarComponent;
    return { fixture, host: fixture.componentInstance, cmp };
  }

  it('navigates the viewed month when the value changes while mounted', () => {
    const { fixture, host, cmp } = setup();

    host.value.set(new Date(2030, 7, 15)); // Aug 2030
    fixture.detectChanges();
    expect(cmp.viewedYear()).toBe(2030);
    expect(cmp.viewedMonth()).toBe(7);

    host.value.set(new Date(2031, 0, 1)); // Jan 2031
    fixture.detectChanges();
    expect(cmp.viewedYear()).toBe(2031);
    expect(cmp.viewedMonth()).toBe(0);
  });

  it('uses the first date of a range/array value', () => {
    const { fixture, host, cmp } = setup();
    host.value.set([new Date(2029, 4, 10), new Date(2029, 5, 20)]); // May 2029
    fixture.detectChanges();
    expect(cmp.viewedYear()).toBe(2029);
    expect(cmp.viewedMonth()).toBe(4);
  });

  it('lets an explicit [month]/[year] take precedence over the value', () => {
    const { fixture, host, cmp } = setup();
    host.value.set(new Date(2030, 7, 15));
    host.month.set(2);
    host.year.set(2025);
    fixture.detectChanges();
    expect(cmp.viewedYear()).toBe(2025);
    expect(cmp.viewedMonth()).toBe(2);
  });
});
