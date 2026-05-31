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
import { NxpComboBoxComponent } from './combo-box.component';

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

interface Size {
  readonly text: string;
  readonly value: number;
}

const SIZES: readonly Size[] = [
  { text: 'Small', value: 1 },
  { text: 'Medium', value: 2 },
  { text: 'Large', value: 3 },
];

@Component({
  imports: [NxpComboBoxComponent, ReactiveFormsModule],
  template: `
    <nxp-combo-box
      [formControl]="ctrl"
      [items]="items()"
      [strict]="strict()"
      [textField]="textField()"
      [valueField]="valueField()"
      [valuePrimitive]="valuePrimitive()"
    />
  `,
})
class ComboHost {
  readonly ctrl = new FormControl<unknown>(null);
  readonly items = signal<readonly unknown[]>(['Small', 'Medium', 'Large']);
  readonly strict = signal(true);
  readonly textField = signal<string | undefined>(undefined);
  readonly valueField = signal<string | undefined>(undefined);
  readonly valuePrimitive = signal(false);
}

describe('NxpComboBoxComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NxpPortalService, useClass: StubPortalService },
        { provide: NXP_DROPDOWN_COMPONENT, useValue: NxpDropdownComponent },
        { provide: NXP_IS_BROWSER, useValue: false },
      ],
    });
    const fixture = TestBed.createComponent(ComboHost);
    fixture.detectChanges();
    const cmp = fixture.debugElement.query(By.directive(NxpComboBoxComponent))
      .componentInstance as NxpComboBoxComponent<unknown>;
    const input = fixture.nativeElement.querySelector(
      'input[role="combobox"]',
    ) as HTMLInputElement;
    const type = (v: string) => {
      input.value = v;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    };
    const blur = () => {
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    };
    const enter = () => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      fixture.detectChanges();
    };
    return { fixture, cmp, input, type, blur, enter };
  }

  it('gives the trigger input a stable id so it is not an anonymous form field', () => {
    const { input } = setup();
    // Chrome's "a form field element should have an id or name attribute"
    // audit fires for any input lacking both. The trigger must carry an id.
    expect(input.id).toBeTruthy();
  });

  it('filters items by case-insensitive substring as the user types', () => {
    const { cmp, type } = setup();
    type('med');
    expect(cmp.filteredItems()).toEqual(['Medium']);
  });

  it('reverts to the previous state on blur when strict and nothing matches', () => {
    const { fixture, cmp, input, type, blur } = setup();
    type('xyz');
    blur();
    expect(input.value).toBe('');
    expect(cmp.inputText()).toBe('');
    expect(fixture.componentInstance.ctrl.value).toBeNull();
  });

  it('accepts free text on blur when not strict', () => {
    const { fixture, cmp, type, blur } = setup();
    fixture.componentInstance.strict.set(false);
    fixture.detectChanges();
    type('Custom');
    blur();
    expect(fixture.componentInstance.ctrl.value).toBe('Custom');
    expect(cmp.inputText()).toBe('Custom');
  });

  it('emits item[valueField] when valuePrimitive is set', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.items.set(SIZES);
    fixture.componentInstance.textField.set('text');
    fixture.componentInstance.valueField.set('value');
    fixture.componentInstance.valuePrimitive.set(true);
    fixture.detectChanges();
    cmp.handleOption(SIZES[1]);
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(2);
    expect(cmp.inputText()).toBe('Medium');
  });

  it('selects the sole filtered match on Enter', () => {
    const { fixture, cmp, type, enter } = setup();
    type('med');
    enter();
    expect(fixture.componentInstance.ctrl.value).toBe('Medium');
    expect(cmp.inputText()).toBe('Medium');
  });

  it('selects and emits the full object by default on option click', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.items.set(SIZES);
    fixture.componentInstance.textField.set('text');
    fixture.detectChanges();
    cmp.handleOption(SIZES[2]);
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(SIZES[2]);
    expect(cmp.inputText()).toBe('Large');
  });

  it('reflects an external primitive write via valueField lookup', () => {
    const { fixture, cmp } = setup();
    fixture.componentInstance.items.set(SIZES);
    fixture.componentInstance.textField.set('text');
    fixture.componentInstance.valueField.set('value');
    fixture.componentInstance.valuePrimitive.set(true);
    fixture.detectChanges();
    fixture.componentInstance.ctrl.setValue(3);
    fixture.detectChanges();
    expect(cmp.inputText()).toBe('Large');
  });
});
