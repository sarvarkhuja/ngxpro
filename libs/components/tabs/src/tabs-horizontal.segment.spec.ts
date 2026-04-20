import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NxpTabDirective } from './tab.directive';
import { NxpTabsHorizontal } from './tabs-horizontal.component';

@Component({
  standalone: true,
  imports: [NxpTabsHorizontal, NxpTabDirective],
  template: `
    <nxp-tabs
      [activeItemIndex]="active()"
      (activeItemIndexChange)="active.set($event)"
    >
      <button nxpTab>First</button>
      <button nxpTab>Second</button>
      <button nxpTab>Third</button>
    </nxp-tabs>
  `,
})
class TabsHost {
  readonly active = signal(0);
}

describe('NxpTabsHorizontal (segment)', () => {
  function setup() {
    const fixture = TestBed.createComponent(TabsHost);
    const host: HTMLElement = fixture.nativeElement.querySelector('nxp-tabs');
    // Give the tabs fixed layout so offset* values are non-zero in jsdom.
    host.style.position = 'relative';
    const tabs: HTMLButtonElement[] = Array.from(
      host.querySelectorAll('[nxpTab]'),
    );
    tabs.forEach((t, i) => {
      Object.defineProperty(t, 'offsetLeft', { value: i * 80, configurable: true });
      Object.defineProperty(t, 'offsetTop', { value: 0, configurable: true });
      Object.defineProperty(t, 'offsetWidth', { value: 80, configurable: true });
      Object.defineProperty(t, 'offsetHeight', { value: 40, configurable: true });
    });
    fixture.detectChanges();
    return { fixture, host, tabs };
  }

  it('renders the segment indicator layout by default', async () => {
    const { fixture, host } = setup();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.className).toContain('rounded-lg');
    expect(host.className).toContain('bg-gray-100');
  });

  it('moves the active indicator when active index changes', async () => {
    const { fixture, host } = setup();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.active.set(1);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const tabs = host.querySelectorAll('[nxpTab]');
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
  });
});
