import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { cx, calendarCellVariants } from '@nxp/cdk';

/** Number of years to show on each side of the current year. */
const YEAR_RANGE = 100;

/**
 * Year picker — renders a scrollable grid of years (4 per row).
 *
 * The currently viewed year is scrolled into view after the component renders.
 * Clicking a year emits `yearClick`.
 */
@Component({
  selector: 'nxp-calendar-year',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #scrollContainer
      class="h-56 overflow-y-auto overscroll-contain pr-1"
      role="listbox"
      [attr.aria-label]="'Select year'"
    >
      <div class="grid grid-cols-4 gap-1 p-1">
        @for (year of years(); track year) {
          <button
            type="button"
            [class]="yearBtnClass(year)"
            [disabled]="isYearDisabled(year)"
            [attr.aria-selected]="year === selectedYear() || null"
            [attr.aria-label]="year.toString()"
            role="option"
            (click)="!isYearDisabled(year) && yearClick.emit(year)"
          >
            {{ year }}
          </button>
        }
      </div>
    </div>
  `,
})
export class CalendarYearComponent implements AfterViewInit {
  /** The year currently in view (used to build the year list and scroll target). */
  readonly currentYear = input.required<number>();

  /** The year that is currently selected (highlighted). */
  readonly selectedYear = input<number | null>(null);

  /** Optional lower bound. */
  readonly min = input<Date | null>(null);

  /** Optional upper bound. */
  readonly max = input<Date | null>(null);

  /** Emitted when the user picks a year. */
  readonly yearClick = output<number>();

  @ViewChild('scrollContainer', { static: true })
  private readonly scrollContainer!: ElementRef<HTMLDivElement>;

  protected readonly years = computed(() => {
    const cy = this.currentYear();
    return Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, i) => cy - YEAR_RANGE + i);
  });

  ngAfterViewInit(): void {
    this.scrollToCurrentYear();
  }

  private scrollToCurrentYear(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ block: 'center', behavior: 'instant' });
    } else {
      // Scroll to the current year button (no year selected yet)
      const btns = container.querySelectorAll<HTMLButtonElement>('button');
      const target = Array.from(btns).find(
        (btn) => btn.textContent?.trim() === String(this.currentYear()),
      );
      target?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }

  protected isYearDisabled(year: number): boolean {
    const min = this.min();
    const max = this.max();
    if (min && year < min.getFullYear()) return true;
    if (max && year > max.getFullYear()) return true;
    return false;
  }

  protected yearBtnClass(year: number): string {
    const isSelected = year === this.selectedYear();
    const isCurrent = year === this.currentYear();
    const disabled = this.isYearDisabled(year);

    let state: 'disabled' | 'selected' | 'current' | 'default';
    if (disabled) state = 'disabled';
    else if (isSelected) state = 'selected';
    else if (isCurrent) state = 'current';
    else state = 'default';

    return cx(calendarCellVariants({ state }), 'px-2 py-1.5');
  }
}
