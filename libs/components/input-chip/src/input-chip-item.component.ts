import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cx } from '@nxp/cdk';
import { CHIP_SIZE_CLASSES, type NxpChipSize } from '@nxp/components/chip';

@Component({
  selector: 'nxp-input-chip-item',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      #editInput
      class="w-full bg-transparent outline-none min-w-0"
      [class.hidden]="!editing()"
      [class.block]="editing()"
      [ngModel]="internal()"
      (ngModelChange)="internal.set($event)"
      (blur)="cancel()"
      (keydown.enter)="$event.preventDefault(); save()"
      (keydown.escape)="$event.preventDefault(); cancel()"
    />
    <span
      class="truncate"
      [class.hidden]="editing()"
      [class.block]="!editing()"
    >{{ displayText() }}</span>
    @if (interactive() && !editing()) {
      <button
        type="button"
        tabindex="-1"
        class="flex shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        [class]="removeButtonSize()"
        (click)="$event.stopPropagation(); remove.emit()"
        (pointerdown)="$event.preventDefault()"
        aria-label="Remove"
      >
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    }
  `,
  host: {
    '[class]': 'hostClasses()',
    '[attr.tabIndex]': 'interactive() ? -1 : null',
    '(keydown.backspace)': '$event.preventDefault(); remove.emit()',
    '(keydown.enter)': '$event.preventDefault(); edit()',
    '(dblclick)': 'edit()',
    '(click)': 'editing() && $event.stopPropagation()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpInputChipItemComponent {
  private readonly editInputRef = viewChild<ElementRef<HTMLInputElement>>('editInput');

  /** The chip item value. */
  readonly item = input.required<unknown>();
  /** Display text for the chip. */
  readonly text = input.required<string>();
  /** Whether the chip can be edited. */
  readonly editable = input(true);
  /** Whether the chip is interactive (not disabled). */
  readonly interactive = input(true);
  /** Whether the chip is disabled. */
  readonly chipDisabled = input(false);
  /** Chip size. */
  readonly size = input<NxpChipSize>('s');

  /** Emitted when the chip should be removed. */
  readonly remove = output<void>();
  /** Emitted when the chip value is edited. */
  readonly edited = output<string>();

  readonly editing = signal(false);
  readonly internal = signal('');

  readonly displayText = computed(() => this.text());

  readonly hostClasses = computed(() => {
    const s = this.size();
    return cx(
      'inline-flex items-center rounded-full font-medium select-none whitespace-nowrap transition-colors cursor-pointer',
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      CHIP_SIZE_CLASSES[s],
      this.chipDisabled() && 'opacity-50 pointer-events-none',
      this.editing() && 'ring-2 ring-primary/30 bg-white dark:bg-gray-900',
    );
  });

  readonly removeButtonSize = computed(() => {
    const s = this.size();
    return s === 'xs' ? 'h-3.5 w-3.5' : s === 's' ? 'h-4 w-4' : 'h-5 w-5';
  });

  edit(): void {
    if (!this.editable() || !this.interactive() || typeof this.item() !== 'string') return;
    this.internal.set(this.text());
    this.editing.set(true);
    // Focus the edit input after view update
    requestAnimationFrame(() => {
      this.editInputRef()?.nativeElement?.focus();
    });
  }

  save(): void {
    const value = this.internal().trim();
    this.editing.set(false);
    if (value && value !== this.text()) {
      this.edited.emit(value);
    } else if (!value) {
      this.remove.emit();
    }
  }

  cancel(): void {
    this.editing.set(false);
    this.internal.set(this.text());
  }
}
