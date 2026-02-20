import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cx } from '@ngxpro/cdk';
import { TextMorphDirective } from './text-morph.directive';

@Component({
  selector: 'ngxpro-text-morph',
  standalone: true,
  hostDirectives: [
    {
      directive: TextMorphDirective,
      inputs: [
        'text',
        'duration',
        'ease',
        'locale',
        'scale',
        'disabled',
        'respectReducedMotion',
        'debug',
      ],
      outputs: ['animationStart', 'animationComplete'],
    },
  ],
  template: ``,
  host: {
    '[class]': 'hostClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMorphComponent {
  /** Additional CSS classes. */
  readonly class = input<string>('');

  readonly hostClasses = computed(() => cx('inline-flex', this.class()));
}
