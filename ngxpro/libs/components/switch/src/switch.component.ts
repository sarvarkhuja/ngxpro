import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { cx } from '@nxp/cdk';
import {
  NXP_SWITCH_OPTIONS,
  type NxpSwitchColor,
  type NxpSwitchSize,
} from './switch.options';

@Component({
  selector: 'input[type="checkbox"][nxpSwitch]',
  standalone: true,
  template: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'switch',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[class]': 'hostClasses()',
    '[disabled]': 'isDisabled()',
  },
  styles: [
    `
      /* ── Base track ── */
      input[nxpSwitch] {
        appearance: none;
        position: relative;
        display: inline-block;
        flex-shrink: 0;
        border-radius: 9999px;
        cursor: pointer;
        transition:
          background-color 200ms ease,
          box-shadow 200ms ease;
        outline: none;
      }

      /* ── Thumb ── */
      input[nxpSwitch]::before {
        content: '';
        position: absolute;
        background: white;
        border-radius: 50%;
        transition: transform 200ms ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      }

      /* ── Size: small ── */
      input[nxpSwitch][data-size='s'] {
        width: 2rem;
        height: 1.125rem;
      }
      input[nxpSwitch][data-size='s']::before {
        width: 0.875rem;
        height: 0.875rem;
        top: 0.125rem;
        left: 0.125rem;
      }
      input[nxpSwitch][data-size='s']:checked::before {
        transform: translateX(0.875rem);
      }

      /* ── Size: medium ── */
      input[nxpSwitch][data-size='m'] {
        width: 2.75rem;
        height: 1.5rem;
      }
      input[nxpSwitch][data-size='m']::before {
        width: 1.25rem;
        height: 1.25rem;
        top: 0.125rem;
        left: 0.125rem;
      }
      input[nxpSwitch][data-size='m']:checked::before {
        transform: translateX(1.25rem);
      }

      /* ── Size: large ── */
      input[nxpSwitch][data-size='l'] {
        width: 3.5rem;
        height: 1.875rem;
      }
      input[nxpSwitch][data-size='l']::before {
        width: 1.625rem;
        height: 1.625rem;
        top: 0.125rem;
        left: 0.125rem;
      }
      input[nxpSwitch][data-size='l']:checked::before {
        transform: translateX(1.625rem);
      }

      /* ── Colors: primary ── */
      input[nxpSwitch][data-color='primary'] {
        background-color: rgb(209, 213, 219);
      }
      input[nxpSwitch][data-color='primary']:checked {
        background-color: rgb(37, 99, 235);
      }
      input[nxpSwitch][data-color='primary']:focus-visible {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
      }
      :is(.dark) input[nxpSwitch][data-color='primary'] {
        background-color: rgb(75, 85, 99);
      }
      :is(.dark) input[nxpSwitch][data-color='primary']:checked {
        background-color: rgb(96, 165, 250);
      }

      /* ── Colors: secondary ── */
      input[nxpSwitch][data-color='secondary'] {
        background-color: rgb(209, 213, 219);
      }
      input[nxpSwitch][data-color='secondary']:checked {
        background-color: rgb(75, 85, 99);
      }
      input[nxpSwitch][data-color='secondary']:focus-visible {
        box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.45);
      }
      :is(.dark) input[nxpSwitch][data-color='secondary'] {
        background-color: rgb(55, 65, 81);
      }
      :is(.dark) input[nxpSwitch][data-color='secondary']:checked {
        background-color: rgb(156, 163, 175);
      }

      /* ── Colors: danger ── */
      input[nxpSwitch][data-color='danger'] {
        background-color: rgb(209, 213, 219);
      }
      input[nxpSwitch][data-color='danger']:checked {
        background-color: rgb(220, 38, 38);
      }
      input[nxpSwitch][data-color='danger']:focus-visible {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.45);
      }
      :is(.dark) input[nxpSwitch][data-color='danger'] {
        background-color: rgb(75, 85, 99);
      }
      :is(.dark) input[nxpSwitch][data-color='danger']:checked {
        background-color: rgb(248, 113, 113);
      }

      /* ── Disabled ── */
      input[nxpSwitch]:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class NxpSwitchComponent implements OnInit, DoCheck {
  private readonly options = inject(NXP_SWITCH_OPTIONS);
  private readonly control = inject(NgControl, { self: true, optional: true });
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly size = input<NxpSwitchSize>(this.options.size);
  readonly color = input<NxpSwitchColor>(this.options.color);
  readonly showIcons = input(this.options.showIcons);
  readonly class = input<string>('');

  readonly isDisabled = signal(false);
  readonly isChecked = signal(false);

  ngOnInit(): void {
    this.isDisabled.set(this.control?.disabled ?? false);
  }

  ngDoCheck(): void {
    this.isDisabled.set(this.control?.disabled ?? false);
    this.isChecked.set(this.el.nativeElement.checked);
  }

  readonly hostClasses = computed(() => cx('nxp-switch', this.class()));
}
