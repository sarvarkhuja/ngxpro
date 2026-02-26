import { Directive, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[nxpVisualViewport]',
  standalone: true,
})
export class NxpVisualViewportDirective implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly handler = (): void => this.update();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.visualViewport?.addEventListener('resize', this.handler);
    window.visualViewport?.addEventListener('scroll', this.handler);
    this.update();
  }

  ngOnDestroy(): void {
    window.visualViewport?.removeEventListener('resize', this.handler);
    window.visualViewport?.removeEventListener('scroll', this.handler);
  }

  private update(): void {
    const vv = window.visualViewport;
    // Fallback to window dimensions when visualViewport API is unavailable
    const x = vv?.offsetLeft ?? 0;
    const y = vv?.offsetTop ?? 0;
    const height = vv?.height ?? window.innerHeight;
    const width = vv?.width ?? window.innerWidth;
    const scale = vv?.scale ?? 1;

    this.el.style.setProperty('--nxp-viewport-x', `${x}px`);
    this.el.style.setProperty('--nxp-viewport-y', `${y}px`);
    this.el.style.setProperty('--nxp-viewport-height', `${height}px`);
    this.el.style.setProperty('--nxp-viewport-width', `${width}px`);
    this.el.style.setProperty('--nxp-viewport-scale', String(scale));
    this.el.style.setProperty('--nxp-viewport-vh', `${window.innerHeight / 100}px`);
    this.el.style.setProperty('--nxp-viewport-vw', `${window.innerWidth / 100}px`);
  }
}
