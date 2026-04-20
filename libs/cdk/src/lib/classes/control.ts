import {
  ChangeDetectorRef,
  Directive,
  inject,
  input,
  signal,
  computed,
  untracked,
  type Provider,
  type Type,
} from '@angular/core';
import {
  type ControlValueAccessor,
  NgControl,
  NgModel,
  type FormControlStatus,
} from '@angular/forms';
import {
  Subject,
  EMPTY,
  merge,
  delay,
  startWith,
  map,
  filter,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NXP_FALLBACK_VALUE } from '../tokens/fallback-value';
import { nxpProvide } from '../utils/provide';

function noop(): void { /* intentional */ }

@Directive()
export abstract class NxpControl<T> implements ControlValueAccessor {
  private readonly fallback = inject(NXP_FALLBACK_VALUE, { optional: true }) as T;
  private readonly refresh$ = new Subject<void>();
  private readonly internal = signal(this.fallback);

  protected readonly control = inject(NgControl, { self: true });
  protected readonly cdr = inject(ChangeDetectorRef);

  public readonly value = computed(() => this.internal() ?? this.fallback);
  public readonly readOnly = input(false);
  public readonly pseudoInvalid = input<boolean | null>(null);
  public readonly touched = signal(false);
  public readonly status = signal<FormControlStatus | undefined>(undefined);
  public readonly disabled = computed(() => this.status() === 'DISABLED');
  public readonly interactive = computed(() => !this.disabled() && !this.readOnly());
  public readonly invalid = computed(() =>
    this.pseudoInvalid() !== null
      ? !!this.pseudoInvalid() && this.interactive()
      : this.interactive() && this.touched() && this.status() === 'INVALID',
  );
  public readonly mode = computed(() =>
    this.readOnly() ? 'readonly' : this.invalid() ? 'invalid' : 'valid',
  );

  public onTouched: () => void = noop;
  public onChange: (value: T) => void = noop;

  constructor() {
    this.control.valueAccessor = this;
    this.refresh$
      .pipe(
        // Defer to next microtask — NgControl may not have its FormControl attached yet
        delay(0),
        // Run once immediately on construction to capture initial form state
        startWith(null),
        // Re-read the underlying FormControl (may change when reactive forms swap controls)
        map(() => this.control.control),
        // Guard against null control before Angular has wired up the form
        filter(Boolean),
        // Avoid re-subscribing when refresh$ fires but the control reference is the same
        distinctUntilChanged(),
        // Subscribe to value/status changes; switchMap unsubscribes from old control's streams
        switchMap((c) =>
          merge(c.valueChanges ?? EMPTY, c.statusChanges ?? EMPTY).pipe(
            // Sync immediately for the new control's current state
            startWith(null),
          ),
        ),
        // Automatic cleanup on directive destruction
        takeUntilDestroyed(),
      )
      .subscribe(() => this.sync());
  }

  registerOnChange(onChange: (value: unknown) => void): void {
    this.refresh$.next();
    this.onChange = (value: T) => {
      if (value === untracked(() => this.internal())) return;
      onChange(value);
      this.internal.set(value);
      this.sync();
    };
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = () => {
      onTouched();
      this.sync();
    };
  }

  setDisabledState(): void {
    this.sync();
  }

  writeValue(value: T | null): void {
    const safe = this.control instanceof NgModel ? this.control.model : value;
    this.internal.set(safe);
    this.sync();
  }

  private sync(): void {
    this.status.set(this.control.control?.status);
    this.touched.set(!!this.control.control?.touched);
    this.cdr.markForCheck();
  }
}

export function nxpAsControl<T>(control: Type<NxpControl<T>>): Provider {
  return nxpProvide(NxpControl, control);
}
