import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NXP_ANIMATIONS_SPEED, NXP_IS_MOBILE, NXP_REDUCED_MOTION } from './root.tokens';
import { NxpPlatformDirective } from './platform.directive';
import { NxpVisualViewportDirective } from './visual-viewport.directive';
import { NxpPopupsComponent } from './popups.component';
import { NXP_DROPDOWN_COMPONENT, NxpDropdownComponent } from '../../../portals';

@Component({
  selector: 'nxp-root',
  standalone: true,
  imports: [NxpPopupsComponent],
  template: `
    <div class="nxp-root-content">
      <ng-content />
    </div>
    @if (isTop()) {
      <nxp-popups>
        <ng-content select="[nxpOverContent]" />
      </nxp-popups>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    nxp-root {
      position: relative;
      display: block;
    }

    .nxp-root-content {
      position: relative;
      block-size: 100%;
      isolation: isolate;
    }
  `],
  providers: [
    { provide: NXP_DROPDOWN_COMPONENT, useValue: NxpDropdownComponent },
  ],
  hostDirectives: [NxpPlatformDirective, NxpVisualViewportDirective],
  host: {
    class: 'nxp-root',
    '[style.--nxp-duration.ms]': 'animationDuration',
    '[style.--nxp-scroll-behavior]': 'reducedMotion ? "auto" : "smooth"',
    '[class.nxp-root--mobile]': 'isMobile',
    '(document:fullscreenchange)': 'onFullscreenChange()',
  },
})
export class NxpRootComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly child = !!inject(NxpRootComponent, { optional: true, skipSelf: true });

  protected readonly reducedMotion = inject(NXP_REDUCED_MOTION);
  protected readonly animationsSpeed = inject(NXP_ANIMATIONS_SPEED);
  protected readonly isMobile = inject(NXP_IS_MOBILE);
  protected readonly animationDuration = Math.round(300 * this.animationsSpeed);
  protected readonly isTop = signal(this.isParent);

  protected onFullscreenChange(): void {
    this.isTop.set(this.isParent);
  }

  private get isParent(): boolean {
    return this.doc.fullscreenElement === this.el || !this.child;
  }
}
