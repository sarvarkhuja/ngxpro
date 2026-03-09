import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
  type QueryList,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import {
  cx,
  nxpSanitizeText,
  nxpGetClipboardDataText,
  nxpInjectElement,
  focusInput,
  NXP_ITEMS_HANDLERS,
  type NxpItemsHandlers,
} from '@nxp/cdk';
import {
  NXP_TEXTFIELD,
  type NxpTextfieldComponent,
} from '@nxp/cdk/components/textfield';
import type { NxpChipSize } from '@nxp/components/chip';
import { NxpInputChipItemComponent } from './input-chip-item.component';
import { NXP_INPUT_CHIP_OPTIONS } from './input-chip.options';

@Component({
  selector: 'nxp-input-chip',
  standalone: true,
  imports: [NxpInputChipItemComponent, FormsModule],
  template: `
    <div class="flex flex-wrap items-center gap-1 min-h-[inherit] w-full p-1.5">
      @for (item of value(); track identityTrack($index, item)) {
        <nxp-input-chip-item
          [item]="item"
          [text]="stringify(item)"
          [editable]="true"
          [interactive]="!disabled()"
          [chipDisabled]="isDisabledItem(item)"
          [size]="chipSize()"
          (remove)="removeAt($index)"
          (edited)="editAt($index, $event)"
        />
      }
      <input
        #nativeInput
        class="min-w-[4rem] flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed"
        [disabled]="disabled()"
        [placeholder]="value().length ? '' : placeholder()"
        [ngModel]="inputValue()"
        (ngModelChange)="inputValue.set($event)"
        (keydown.enter)="$event.preventDefault(); onEnter()"
        (keydown.backspace)="onBackspace()"
        (input)="onInput()"
        (paste)="$event.preventDefault(); onPaste($event)"
        (drop)="$event.preventDefault(); onDrop($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        enterkeyhint="enter"
      />
    </div>
  `,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'focusInput()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NxpInputChipComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpInputChipComponent<T = string> implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el = nxpInjectElement();
  private readonly options = inject(NXP_INPUT_CHIP_OPTIONS);
  private readonly handlers = inject<NxpItemsHandlers<T>>(NXP_ITEMS_HANDLERS);
  private readonly textfield = inject(NXP_TEXTFIELD, { optional: true });

  private readonly nativeInputRef = viewChild<ElementRef<HTMLInputElement>>('nativeInput');

  /** Separator used to split typed text into multiple chips. */
  readonly separator = input<RegExp | string>(this.options.separator);
  /** Whether to deduplicate values. */
  readonly unique = input<boolean>(this.options.unique);
  /** Placeholder text shown when no chips exist. */
  readonly placeholder = input('');
  /** Chip size variant. */
  readonly chipSize = input<NxpChipSize>('s');
  /** Additional host CSS classes. */
  readonly class = input('');

  /** Internal state. */
  readonly value = signal<T[]>([]);
  readonly inputValue = signal('');
  readonly focused = signal(false);
  readonly disabled = signal(false);

  private onChange: (value: T[]) => void = () => {};
  private onTouched: () => void = () => {};

  readonly hostClasses = computed(() =>
    cx(
      'relative flex flex-wrap rounded-md border transition-colors duration-150 cursor-text',
      'bg-white dark:bg-gray-950',
      'border-gray-300 dark:border-gray-800',
      this.focused() && 'ring-2 ring-primary/30 border-primary',
      this.disabled() && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900',
      this.class(),
    ),
  );

  // ---- CVA ----

  writeValue(value: T[] | null): void {
    this.value.set(value ?? []);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  // ---- Public API ----

  stringify(item: T): string {
    return this.handlers.stringify()(item);
  }

  isDisabledItem(item: T): boolean {
    return this.handlers.disabledItemHandler()(item);
  }

  identityTrack(index: number, item: T): unknown {
    return this.handlers.identityMatcher()(item, item) ? item : index;
  }

  removeAt(index: number): void {
    const current = [...this.value()];
    current.splice(index, 1);
    this.setValue(current);
    this.focusInput();
  }

  editAt(index: number, newValue: string): void {
    const current = [...this.value()];
    current[index] = newValue as unknown as T;
    this.setValue(current);
    this.focusInput();
  }

  // ---- Event handlers ----

  onEnter(rawValue?: string): void {
    const raw = rawValue ?? this.inputValue();
    if (!raw.trim()) return;

    const items = typeof this.separator() === 'string'
      ? raw.split(this.separator() as string)
      : raw.split(this.separator() as RegExp);

    const valid = items
      .map((item) => nxpSanitizeText(item) as unknown as T)
      .filter(
        (item) =>
          (item as unknown as string) !== '' &&
          !this.handlers.disabledItemHandler()(item) &&
          !!this.handlers.stringify()(item),
      );

    if (!valid.length) return;

    const current = [...this.value(), ...valid];
    this.setValue(current);
    this.inputValue.set('');
  }

  onInput(): void {
    const raw = this.inputValue();
    const sep = this.separator();

    // Auto-trigger if separator found in input
    if (typeof sep === 'string' && raw.includes(sep)) {
      this.onEnter(raw);
    } else if (sep instanceof RegExp && sep.test(raw)) {
      this.onEnter(raw);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const text = nxpGetClipboardDataText(event);
    if (text) {
      this.onEnter(text);
    }
  }

  onDrop(event: DragEvent): void {
    const text = event.dataTransfer?.getData('text/plain') ?? '';
    if (text) {
      this.onEnter(text);
    }
  }

  onBackspace(): void {
    if (this.inputValue()) return;
    const current = this.value();
    if (current.length) {
      this.removeAt(current.length - 1);
    }
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
    // Commit any remaining text on blur
    const raw = this.inputValue().trim();
    if (raw) {
      this.onEnter(raw);
      this.inputValue.set('');
    }
  }

  focusInput(): void {
    this.nativeInputRef()?.nativeElement?.focus();
  }

  // ---- Private ----

  private setValue(items: T[]): void {
    const result = this.unique()
      ? items.filter((item, i, arr) =>
          arr.findIndex((other) => this.handlers.identityMatcher()(item, other)) === i,
        )
      : items;
    this.value.set(result);
    this.onChange(result);
  }
}
