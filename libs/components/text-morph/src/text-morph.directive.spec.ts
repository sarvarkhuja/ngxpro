import { Component, signal, ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextMorphDirective } from './text-morph.directive';
import { TextMorphComponent } from './text-morph.component';
import {
  NXP_TEXT_MORPH_OPTIONS,
  provideTextMorphOptions,
} from './text-morph.options';
import { NXP_TEXT_MORPH_DEFAULT_OPTIONS } from './text-morph.types';
import { NXP_IS_BROWSER } from '@nxp/cdk';

// Mock Web Animations API for test environment
function setupAnimationMocks() {
  const createMockAnimation = (): Animation => {
    let onfinishFn: (() => void) | null = null;
    return {
      get onfinish() {
        return onfinishFn;
      },
      set onfinish(fn: (() => void) | null) {
        onfinishFn = fn;
        if (fn) queueMicrotask(fn);
      },
      cancel: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      finished: Promise.resolve(),
    } as unknown as Animation;
  };
  if (!HTMLElement.prototype.animate) {
    (HTMLElement.prototype as unknown as { animate: () => Animation }).animate =
      vi.fn().mockImplementation(createMockAnimation);
  } else {
    vi.spyOn(HTMLElement.prototype, 'animate').mockImplementation(
      createMockAnimation,
    );
  }
  if (!HTMLElement.prototype.getAnimations) {
    HTMLElement.prototype.getAnimations = vi.fn().mockReturnValue([]);
  }
  // Mock matchMedia
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
}

@Component({
  standalone: true,
  imports: [TextMorphDirective],
  template: `
    <span
      nxpTextMorph
      [text]="text()"
      [duration]="duration()"
      [scale]="scale()"
      [debug]="debug()"
      [disabled]="disabled()"
      (animationStart)="onAnimationStart()"
      (animationComplete)="onAnimationComplete()"
      data-testid="morph"
    ></span>
  `,
})
class TestHostComponent {
  text = signal('Hello');
  duration = signal<number | undefined>(undefined);
  scale = signal<boolean | undefined>(undefined);
  debug = signal<boolean | undefined>(undefined);
  disabled = signal<boolean | undefined>(undefined);
  animationStartCount = 0;
  animationCompleteCount = 0;

  onAnimationStart() {
    this.animationStartCount++;
  }

  onAnimationComplete() {
    this.animationCompleteCount++;
  }
}

@Component({
  standalone: true,
  imports: [TextMorphComponent],
  template: `
    <nxp-text-morph
      [text]="text()"
      class="custom-class"
      data-testid="morph-component"
    />
  `,
})
class TestComponentHost {
  text = signal('World');
}

/** Trigger afterNextRender by ticking the ApplicationRef */
function flushRender() {
  TestBed.inject(ApplicationRef).tick();
}

describe('TextMorphDirective', () => {
  beforeEach(async () => {
    setupAnimationMocks();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    expect(element).toBeTruthy();
  });

  it('should set torph-root attribute after render', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    expect(element.hasAttribute('torph-root')).toBe(true);
  });

  it('should create torph-item spans for text', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    const items = element.querySelectorAll('[torph-item]');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should set torph-id attribute on each item', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    const items = element.querySelectorAll('[torph-item]');
    items.forEach((item: Element) => {
      expect(item.hasAttribute('torph-id')).toBe(true);
    });
  });

  it('should set torph-debug attribute when debug is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.debug.set(true);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    expect(element.hasAttribute('torph-debug')).toBe(true);
  });

  it('should set text content directly when disabled', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    expect(element.textContent).toBe('Hello');
    expect(element.querySelectorAll('[torph-item]').length).toBe(0);
  });

  it('should not set torph-root when disabled', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    expect(element.hasAttribute('torph-root')).toBe(false);
  });

  it('should update torph-item spans when text changes', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    const initialItems = element.querySelectorAll('[torph-item]');
    expect(initialItems.length).toBeGreaterThan(0);

    fixture.componentInstance.text.set('World');
    fixture.detectChanges();
    flushRender();
    await Promise.resolve();

    const updatedItems = element.querySelectorAll('[torph-item]');
    expect(updatedItems.length).toBeGreaterThan(0);
    expect(element.textContent?.trim()).toBe('World');
  });

  it('should emit animationStart when text changes after initial render', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    flushRender();

    expect(fixture.componentInstance.animationStartCount).toBe(0);

    fixture.componentInstance.text.set('World');
    fixture.detectChanges();
    flushRender();

    expect(fixture.componentInstance.animationStartCount).toBe(1);
  });

  it('should emit animationComplete after morph duration', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.duration.set(100);
    fixture.detectChanges();
    flushRender();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    Object.defineProperty(element, 'offsetWidth', {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(element, 'offsetHeight', {
      value: 20,
      configurable: true,
    });

    fixture.componentInstance.text.set('World');
    fixture.detectChanges();
    flushRender();
    await Promise.resolve();

    expect(fixture.componentInstance.animationCompleteCount).toBe(0);

    vi.advanceTimersByTime(200);

    expect(fixture.componentInstance.animationCompleteCount).toBe(1);
    vi.useRealTimers();
  });

  it('should respect scale false for exiting animation', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.scale.set(false);
    fixture.detectChanges();
    flushRender();

    const animateSpy = vi.spyOn(HTMLElement.prototype, 'animate');
    fixture.componentInstance.text.set('XYZ');
    fixture.detectChanges();
    flushRender();

    const exitingCalls = animateSpy.mock.calls.filter((call) => {
      const keyframes = call[0] as { transform?: string } | undefined;
      const transform = keyframes?.transform;
      return (
        transform &&
        typeof transform === 'string' &&
        transform.includes('translate') &&
        !transform.includes('scale')
      );
    });
    expect(exitingCalls.length).toBeGreaterThan(0);
    animateSpy.mockRestore();
  });

  it('should handle multiple rapid text updates', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    flushRender();

    fixture.componentInstance.text.set('A');
    fixture.detectChanges();
    fixture.componentInstance.text.set('AB');
    fixture.detectChanges();
    fixture.componentInstance.text.set('ABC');
    fixture.detectChanges();
    flushRender();
    await Promise.resolve();

    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph"]',
    );
    expect(element.textContent?.trim()).toBe('ABC');
  });
});

describe('TextMorphDirective with custom options', () => {
  beforeEach(async () => {
    setupAnimationMocks();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideTextMorphOptions({ duration: 800 })],
    }).compileComponents();
  });

  it('should use provided options', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const options = TestBed.inject(NXP_TEXT_MORPH_OPTIONS);
    expect(options.duration).toBe(800);
    expect(options.ease).toBe(NXP_TEXT_MORPH_DEFAULT_OPTIONS.ease);
  });
});

describe('TextMorphDirective SSR safety', () => {
  beforeEach(async () => {
    setupAnimationMocks();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: NXP_IS_BROWSER, useValue: false }],
    }).compileComponents();
  });

  it('should not throw when not in browser', () => {
    expect(() => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      flushRender();
    }).not.toThrow();
  });
});

describe('TextMorphComponent', () => {
  beforeEach(async () => {
    setupAnimationMocks();

    await TestBed.configureTestingModule({
      imports: [TestComponentHost],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponentHost);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph-component"]',
    );
    expect(element).toBeTruthy();
  });

  it('should apply inline-flex class', () => {
    const fixture = TestBed.createComponent(TestComponentHost);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="morph-component"]',
    );
    expect(element.classList.contains('inline-flex')).toBe(true);
  });
});
