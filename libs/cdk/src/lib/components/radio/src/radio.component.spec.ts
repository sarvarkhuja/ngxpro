import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NxpRadioComponent } from './radio.component';
import type { NxpRadioColor, NxpRadioSize } from './radio.component';

@Component({
  imports: [NxpRadioComponent],
  template: `
    <nxp-radio
      name="g"
      value="a"
      [size]="size()"
      [color]="color()"
      (checkedChange)="aChecked.set($event)"
      >A</nxp-radio
    >
    <nxp-radio name="g" value="b">B</nxp-radio>
  `,
})
class PlainHost {
  readonly size = signal<NxpRadioSize>('m');
  readonly color = signal<NxpRadioColor>('primary');
  readonly aChecked = signal(false);
}

@Component({
  imports: [ReactiveFormsModule, NxpRadioComponent],
  template: `
    <nxp-radio [formControl]="ctrl" value="a" name="grp">A</nxp-radio>
    <nxp-radio [formControl]="ctrl" value="b" name="grp">B</nxp-radio>
  `,
})
class FormsHost {
  readonly ctrl = new FormControl<string>('a');
}

interface Item {
  id: number;
}

@Component({
  imports: [ReactiveFormsModule, NxpRadioComponent],
  template: `
    @for (it of items; track it.id) {
      <nxp-radio
        [formControl]="ctrl"
        [value]="it"
        [compareWith]="byId"
        name="obj"
        >{{ it.id }}</nxp-radio
      >
    }
  `,
})
class CompareHost {
  readonly items: Item[] = [{ id: 1 }, { id: 2 }];
  readonly ctrl = new FormControl<Item | null>({ id: 2 });
  readonly byId = (a: Item, b: Item): boolean => a?.id === b?.id;
}

describe('NxpRadioComponent', () => {
  it('renders a native radio input with the projected label', () => {
    const fixture = TestBed.createComponent(PlainHost);
    fixture.detectChanges();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('radio');
    expect(input.getAttribute('name')).toBe('g');
    expect(fixture.nativeElement.textContent).toContain('A');
  });

  it('applies size and color via data attributes and classes', () => {
    const fixture = TestBed.createComponent(PlainHost);
    fixture.componentInstance.size.set('l');
    fixture.componentInstance.color.set('danger');
    fixture.detectChanges();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('data-size')).toBe('l');
    expect(input.getAttribute('data-color')).toBe('danger');
    expect(input.className).toContain('size-6');
    expect(input.className).toContain('checked:bg-status-negative');
  });

  it('emits checkedChange when selected by the user', () => {
    const fixture = TestBed.createComponent(PlainHost);
    fixture.detectChanges();
    const cmp = fixture.debugElement.query(By.directive(NxpRadioComponent))
      .componentInstance as NxpRadioComponent;
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(cmp.checked()).toBe(true);
    expect(fixture.componentInstance.aChecked()).toBe(true);
  });

  it('checks the input matching the form value on init', () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    const els = fixture.debugElement
      .queryAll(By.css('input'))
      .map((d) => d.nativeElement as HTMLInputElement);
    expect(els[0].checked).toBe(true);
    expect(els[1].checked).toBe(false);
  });

  it('writes the selected value to the shared form control', () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    const els = fixture.debugElement
      .queryAll(By.css('input'))
      .map((d) => d.nativeElement as HTMLInputElement);
    els[1].checked = true;
    els[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('b');
  });

  it('propagates the form value to every bound radio', () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    fixture.componentInstance.ctrl.setValue('b');
    fixture.detectChanges();
    const els = fixture.debugElement
      .queryAll(By.css('input'))
      .map((d) => d.nativeElement as HTMLInputElement);
    expect(els[0].checked).toBe(false);
    expect(els[1].checked).toBe(true);
  });

  it('disables the input when the control is disabled', () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });

  it('matches object values through compareWith', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.detectChanges();
    const els = fixture.debugElement
      .queryAll(By.css('input'))
      .map((d) => d.nativeElement as HTMLInputElement);
    // Control holds a different object reference with id === 2.
    expect(els[0].checked).toBe(false);
    expect(els[1].checked).toBe(true);
  });
});
