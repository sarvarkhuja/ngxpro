import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  Directive,
  DoCheck,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  computed,
  createComponent,
  inject,
  input,
  signal,
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { cx } from '@nxp/cdk';

/**
 * Internal counter component rendered below the textarea.
 * Displays "{current} / {limit}" with error state styling.
 */
@Component({
  selector: 'nxp-textarea-counter',
  standalone: true,
  template: `
    <span [class]="classes()">{{ current() }} / {{ limit() }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpTextareaCounterComponent {
  readonly current = signal(0);
  readonly limit = signal(0);

  readonly classes = computed(() =>
    cx(
      'text-xs tabular-nums',
      this.current() > this.limit()
        ? 'text-red-500 dark:text-red-400'
        : 'text-gray-400 dark:text-gray-500',
    ),
  );
}

/**
 * Directive that adds character limit validation + a live counter to a textarea.
 *
 * Selector: `textarea[nxpTextarea][limit]`
 *
 * Usage:
 * ```html
 * <textarea nxpTextarea [limit]="500"></textarea>
 * ```
 */
@Directive({
  selector: 'textarea[nxpTextarea][limit]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NxpTextareaLimitDirective,
      multi: true,
    },
  ],
  host: {
    '[attr.maxlength]': 'null', // Do NOT apply maxlength natively — show error instead
  },
})
export class NxpTextareaLimitDirective implements Validator, DoCheck, OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLTextAreaElement>).nativeElement;
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);

  /** Maximum number of characters allowed. */
  readonly limit = input.required<number>();

  private counterRef: ReturnType<typeof createComponent<NxpTextareaCounterComponent>> | null = null;
  private wrapperEl: HTMLElement | null = null;
  private _onChange: (() => void) | null = null;

  ngOnInit(): void {
    // Create a wrapper div to position the counter relative to the textarea
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-end mt-1';
    this.wrapperEl = wrapper;

    // Dynamically create the counter component
    const counterRef = createComponent(NxpTextareaCounterComponent, {
      environmentInjector: this.envInjector,
    });
    this.counterRef = counterRef;
    this.appRef.attachView(counterRef.hostView);

    // Append counter into the wrapper div
    wrapper.appendChild(counterRef.location.nativeElement);

    // Insert the wrapper after the textarea (or after nxp-textfield if nested)
    const tfWrapper = this.el.closest('nxp-textfield');
    const anchor: Element = tfWrapper ?? this.el;
    anchor.insertAdjacentElement('afterend', wrapper);

    this.updateCounter();
  }

  ngDoCheck(): void {
    this.updateCounter();
  }

  ngOnDestroy(): void {
    if (this.counterRef) {
      this.appRef.detachView(this.counterRef.hostView);
      this.counterRef.destroy();
      this.counterRef = null;
    }
    if (this.wrapperEl && this.wrapperEl.parentElement) {
      this.wrapperEl.parentElement.removeChild(this.wrapperEl);
      this.wrapperEl = null;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value ?? '';
    const len = typeof value === 'string' ? value.length : String(value).length;
    if (len > this.limit()) {
      return { maxlength: { requiredLength: this.limit(), actualLength: len } };
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private updateCounter(): void {
    if (!this.counterRef) return;
    const len = this.el.value.length;
    this.counterRef.instance.current.set(len);
    this.counterRef.instance.limit.set(this.limit());
    this.counterRef.changeDetectorRef.markForCheck();
  }
}
