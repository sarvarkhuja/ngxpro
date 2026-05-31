import { Component, Injector, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NXP_DROPDOWN_COMPONENT,
  NXP_IS_BROWSER,
  NxpDropdownComponent,
  NxpPortalService,
} from '@ngxpro/cdk';
import { NxpSelectComponent } from './select.component';

// A no-op portal host so opening the dropdown (which mounts a portal) doesn't
// throw "NxpPortalService has no host" — these specs assert component/form
// state, not the rendered overlay. `injector: Injector.NULL` keeps the
// dropdown's `linkZone(ref.injector.get(...))` safe. Mirrors the stub in
// input-date.component.spec.ts.
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

interface Country {
  readonly name: string;
  readonly code: string;
}

const COUNTRIES: readonly Country[] = [
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'Spain', code: 'ES' },
];

@Component({
  imports: [NxpSelectComponent, ReactiveFormsModule],
  template: `
    <nxp-select
      [formControl]="ctrl"
      [items]="items()"
      [textField]="textField()"
      [valueField]="valueField()"
      [disabledItem]="disabledItem()"
      [groupBy]="groupBy()"
      [clearable]="true"
    />
  `,
})
class SelectHost {
  readonly ctrl = new FormControl<unknown>(null);
  readonly items = signal<readonly unknown[]>(['Apple', 'Banana', 'Mango']);
  readonly textField = signal<string | undefined>(undefined);
  readonly valueField = signal<string | undefined>(undefined);
  readonly disabledItem = signal<(item: unknown) => boolean>(() => false);
  readonly groupBy = signal<string | undefined>(undefined);
}

describe('NxpSelectComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NxpPortalService, useClass: StubPortalService },
        { provide: NXP_DROPDOWN_COMPONENT, useValue: NxpDropdownComponent },
        { provide: NXP_IS_BROWSER, useValue: false },
      ],
    });
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    const cmp = fixture.debugElement.query(By.directive(NxpSelectComponent))
      .componentInstance as NxpSelectComponent<unknown>;
    return { fixture, cmp };
  }

  it('gives the trigger input a stable id so it is not an anonymous form field', () => {
    const { fixture } = setup();
    const input = fixture.debugElement.query(By.css('input[role="combobox"]'))
      .nativeElement as HTMLInputElement;
    // Chrome's "a form field element should have an id or name attribute"
    // audit fires for any input lacking both. The trigger must carry an id.
    expect(input.id).toBeTruthy();
  });

  it('selects an item via handleOption and pushes it to the form control', () => {
    const { fixture, cmp } = setup();
    cmp.handleOption('Banana');
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('Banana');
    expect(cmp.selected()).toBe('Banana');
    expect(cmp.value()).toBe('Banana');
  });

  it('reflects an external form-control write in the display value', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.ctrl.setValue('Mango');
    fixture.detectChanges();
    expect(cmp.selected()).toBe('Mango');
    expect(cmp.value()).toBe('Mango');
  });

  it('clears the selection when setValue(null) is called', () => {
    const { fixture, cmp } = setup();
    cmp.handleOption('Apple');
    fixture.detectChanges();
    cmp.setValue(null);
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBeNull();
    expect(cmp.selected()).toBeNull();
    expect(cmp.value()).toBe('');
  });

  it('uses textField for the display label of object items', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.items.set(COUNTRIES);
    fixture.componentInstance.textField.set('name');
    fixture.detectChanges();
    cmp.handleOption(COUNTRIES[0]);
    fixture.detectChanges();
    expect(cmp.value()).toBe('France');
    expect(fixture.componentInstance.ctrl.value).toBe(COUNTRIES[0]);
  });

  it('matches identity by valueField', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.items.set(COUNTRIES);
    fixture.componentInstance.textField.set('name');
    fixture.componentInstance.valueField.set('code');
    fixture.detectChanges();
    cmp.handleOption(COUNTRIES[1]);
    fixture.detectChanges();
    // A different object instance with the same code is treated as selected.
    expect(cmp.isItemSelected({ name: 'Germany', code: 'DE' })).toBe(true);
    expect(cmp.isItemSelected(COUNTRIES[2])).toBe(false);
  });

  it('reports the disabled state from the form control', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    expect(cmp.disabled()).toBe(true);
  });

  it('exposes disabledItem as the disabledItemHandler', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.disabledItem.set((item) => item === 'Banana');
    fixture.detectChanges();
    expect(cmp.disabledItemHandler()('Banana')).toBe(true);
    expect(cmp.disabledItemHandler()('Apple')).toBe(false);
  });

  it('groups items by the groupBy field, preserving first-seen order', () => {
    const { fixture, cmp } = setup();
    const data = [
      { name: 'France', continent: 'Europe' },
      { name: 'Japan', continent: 'Asia' },
      { name: 'Germany', continent: 'Europe' },
    ];
    fixture.componentInstance.items.set(data);
    fixture.componentInstance.groupBy.set('continent');
    fixture.detectChanges();
    const groups = cmp.toGroups(data as never);
    expect(groups.map((g) => g.label)).toEqual(['Europe', 'Asia']);
    expect(groups[0].items).toEqual([data[0], data[2]]);
    expect(groups[1].items).toEqual([data[1]]);
  });
});
