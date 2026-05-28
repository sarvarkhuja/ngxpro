import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  signal,
} from '@angular/core';
import {
  NxpDocPageComponent,
  NxpDocPageTabConnectorDirective,
} from '@ngxpro/addon-doc-lib/page';
import { NxpDocTocComponent } from '@ngxpro/addon-doc-lib/toc';
import { NxpDocApiTabDirective } from './api-tab.directive';
import { NxpDocExamplesTabDirective } from './examples-tab.directive';

/**
 * High-level shell for a component documentation page.
 *
 * Bundles `<nxp-doc-page>` with two standardized tabs — **Examples** and
 * **API** — projected via `<ng-template nxpExamplesTab>` and
 * `<ng-template nxpApiTab>`.
 * The Examples-tab table of contents (`<nxp-doc-toc>`) is rendered
 * automatically and only while the Examples tab is active.
 *
 * Anything outside the two templates (description paragraphs) renders before
 * the tab strip and stays visible across tabs.
 *
 * @example
 * <nxp-doc-component-page
 *   header="Accordion"
 *   package="components"
 *   type="component"
 *   path="components/accordion"
 * >
 *   <p>Description...</p>
 *
 *   <ng-template nxpExamplesTab>
 *     <nxp-doc-example heading="Multiple">...</nxp-doc-example>
 *   </ng-template>
 *
 *   <ng-template nxpApiTab>
 *     <app-accordion-api />
 *   </ng-template>
 * </nxp-doc-component-page>
 */
@Component({
  selector: 'nxp-doc-component-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    NxpDocPageComponent,
    NxpDocPageTabConnectorDirective,
    NxpDocTocComponent,
  ],
  template: `
    <nxp-doc-page
      [header]="header()"
      [package]="package()"
      [type]="type()"
      [tags]="tags()"
      [path]="path()"
      [(activeItemIndex)]="activeTab"
    >
      @if (activeTab() === 0) {
        <nxp-doc-toc />
      }
      <ng-content />

      @if (examplesTab(); as t) {
        <ng-template pageTab="Examples">
          <ng-container [ngTemplateOutlet]="t.template" />
        </ng-template>
      }

      @if (apiTab(); as t) {
        <ng-template pageTab="API">
          <ng-container [ngTemplateOutlet]="t.template" />
        </ng-template>
      }
    </nxp-doc-page>
  `,
})
export class NxpDocComponentPageComponent {
  protected readonly examplesTab = contentChild(NxpDocExamplesTabDirective);
  protected readonly apiTab = contentChild(NxpDocApiTabDirective);
  protected readonly activeTab = signal(0);

  public readonly header = input('');
  public readonly package = input('');
  public readonly type = input('');
  public readonly tags = input<string[]>([]);
  public readonly path = input('');
}
