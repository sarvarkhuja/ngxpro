import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NxpMenuComponent } from './menu.component';
import { NxpMenuItemDirective } from './menu-item.directive';

@Component({
  standalone: true,
  imports: [NxpMenuComponent, NxpMenuItemDirective],
  template: `
    <nxp-menu [checkedIndex]="checked()" (checkedIndexChange)="checked.set($event)">
      <button nxpMenuItem>Profile</button>
      <button nxpMenuItem>Settings</button>
      <button nxpMenuItem>Sign out</button>
    </nxp-menu>
  `,
})
class MenuHost {
  readonly checked = signal<number | null>(0);
}

function keydown(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true });
}

describe('NxpMenuComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(MenuHost);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement.querySelector('nxp-menu');
    const items: HTMLButtonElement[] = Array.from(
      host.querySelectorAll('[nxpMenuItem]'),
    );
    items.forEach((el, i) => {
      Object.defineProperty(el, 'offsetLeft', { value: 0, configurable: true });
      Object.defineProperty(el, 'offsetTop', { value: i * 32, configurable: true });
      Object.defineProperty(el, 'offsetWidth', { value: 240, configurable: true });
      Object.defineProperty(el, 'offsetHeight', { value: 32, configurable: true });
    });
    fixture.detectChanges();
    return { fixture, host, items };
  }

  it('assigns sequential data-proximity-index on each item', () => {
    const { items } = setup();
    expect(items.map((el) => el.getAttribute('data-proximity-index'))).toEqual(
      ['0', '1', '2'],
    );
  });

  it('marks the checked item with aria-checked="true"', () => {
    const { items } = setup();
    expect(items[0]?.getAttribute('aria-checked')).toBe('true');
    expect(items[1]?.getAttribute('aria-checked')).toBe('false');
  });

  it('two-way binds checkedIndex on click', () => {
    const { fixture, items } = setup();
    items[2]?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(2);
    expect(items[2]?.getAttribute('aria-checked')).toBe('true');
    expect(items[0]?.getAttribute('aria-checked')).toBe('false');
  });

  it('ArrowDown wraps from last to first', () => {
    const { items } = setup();
    items[2]?.focus();
    items[2]?.dispatchEvent(keydown('ArrowDown'));
    expect(document.activeElement).toBe(items[0]);
  });

  it('ArrowUp wraps from first to last', () => {
    const { items } = setup();
    items[0]?.focus();
    items[0]?.dispatchEvent(keydown('ArrowUp'));
    expect(document.activeElement).toBe(items[2]);
  });

  it('Home focuses the first item, End focuses the last', () => {
    const { items } = setup();
    items[1]?.focus();
    items[1]?.dispatchEvent(keydown('End'));
    expect(document.activeElement).toBe(items[2]);
    items[2]?.dispatchEvent(keydown('Home'));
    expect(document.activeElement).toBe(items[0]);
  });

  it('has role="menu" on the host', () => {
    const { host } = setup();
    expect(host.getAttribute('role')).toBe('menu');
  });
});
