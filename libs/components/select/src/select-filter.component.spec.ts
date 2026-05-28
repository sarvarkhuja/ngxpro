import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NXP_DROPDOWN_COMPONENT,
  NxpDropdownComponent,
  NxpPortalService,
} from '@ngxpro/cdk';
import { NxpSelectOptionComponent } from '@ngxpro/components/combo-box';
import { NxpSelectFilterComponent } from './select-filter.component';

class StubPortalService extends NxpPortalService {}

@Component({
  imports: [NxpSelectFilterComponent, NxpSelectOptionComponent],
  template: `
    <nxp-select-filter
      [items]="items()"
      [autoFocus]="false"
      placeholder="Search"
      emptyLabel="No results"
      createLabel="Create"
      (create)="onCreate($event)"
    >
      <ng-template let-list>
        @for (item of list; track item) {
          <nxp-select-option [value]="item" />
        }
      </ng-template>
    </nxp-select-filter>
  `,
})
class FilterHost {
  readonly items = signal<string[]>(['Apple', 'Avocado', 'Banana', 'Mango']);
  created: string[] = [];
  onCreate(value: string): void {
    this.created.push(value);
  }
}

describe('NxpSelectFilterComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NxpPortalService, useClass: StubPortalService },
        { provide: NXP_DROPDOWN_COMPONENT, useValue: NxpDropdownComponent },
      ],
    });
    const fixture = TestBed.createComponent(FilterHost);
    fixture.detectChanges();
    const host: HTMLElement =
      fixture.nativeElement.querySelector('nxp-select-filter');
    const filterInput = host.querySelector(
      'input[nxpInput]',
    ) as HTMLInputElement;
    const options = () =>
      Array.from(host.querySelectorAll<HTMLElement>('nxp-select-option'));
    const createButton = () =>
      host.querySelector<HTMLButtonElement>('button[role="option"]');
    function type(value: string) {
      filterInput.value = value;
      filterInput.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    }
    return {
      fixture,
      host,
      filterInput,
      options,
      createButton,
      type,
    };
  }

  it('renders all projected options when the search is empty', () => {
    const { options } = setup();
    expect(options().length).toBe(4);
  });

  it('filters the projected items as the user types', () => {
    const { options, type } = setup();
    type('av');
    expect(options().length).toBe(1);
    expect(options()[0]?.textContent?.trim()).toBe('Avocado');
  });

  it('hides the create row when at least one item matches', () => {
    const { createButton, type } = setup();
    type('app');
    expect(createButton()).toBeNull();
  });

  it('shows the create row with the trimmed search when nothing matches', () => {
    const { createButton, type } = setup();
    type('  zzz  ');
    const btn = createButton();
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('aria-label')).toBe('Create zzz');
    expect(btn?.textContent).toContain('Create');
    expect(btn?.textContent).toContain('zzz');
  });

  it('does not show the create row when the search is empty', () => {
    const { createButton, type } = setup();
    type('');
    expect(createButton()).toBeNull();
  });

  it('emits (create) with the trimmed search text and resets the input on click', () => {
    const { fixture, filterInput, createButton, type } = setup();
    type('  brand new tag  ');
    createButton()?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.created).toEqual(['brand new tag']);
    expect(filterInput.value).toBe('');
  });

  it('clears the search when Escape is pressed while typing', () => {
    const { fixture, filterInput, type } = setup();
    type('av');
    filterInput.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(filterInput.value).toBe('');
  });
});
