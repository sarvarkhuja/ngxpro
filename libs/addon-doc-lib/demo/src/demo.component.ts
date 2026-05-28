import { Location, NgTemplateOutlet } from '@angular/common';
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Pipe,
  type PipeTransform,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  type AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { type Params, UrlSerializer, type UrlTree } from '@angular/router';
import { cx } from '@ngxpro/cdk';
import { ThemeService } from '@ngxpro/core';
import { NxpSegmentedComponent } from '@ngxpro/components/segmented';
import { NxpSwitchComponent } from '@ngxpro/components/switch';
import { skip } from 'rxjs';
import { NxpDocCodeComponent } from '@ngxpro/addon-doc-lib/code';
import {
  NXP_DOC_DEMO_TEXTS,
  NXP_DOC_ICONS,
  NXP_DOC_PREVIEW_TEXT,
  NXP_DOC_URL_STATE_HANDLER,
} from '@ngxpro/addon-doc-lib/tokens';
import type { NxpDocDemoParams } from '@ngxpro/addon-doc-lib/types';
import {
  nxpCleanObject,
  nxpCoerceValueIsTrue,
} from '@ngxpro/addon-doc-lib/utils';

/** Stringifies a value for the form-data preview, including BigInts. */
@Pipe({ name: 'nxpDocJson' })
export class NxpDocJsonPipe implements PipeTransform {
  public transform(value: unknown): string {
    return JSON.stringify(
      value,
      (_, x) => (typeof x === 'bigint' ? `${String(x)}n` : x),
      2,
    );
  }
}

type DemoTab = 'preview' | 'html' | 'typescript';

/**
 * Doc-page playground container. Wraps a small piece of demo UI (passed as a
 * `<ng-template>` content child or projected `<ng-content>`), exposes
 * controls for toggling theme/transparency and inspecting bound form data,
 * and persists state to the URL so deep links reproduce the same playground.
 *
 * Optional `html` / `typescript` inputs render an `nxp-segmented` tab strip
 * (Preview / HTML / TypeScript). Code tabs are rendered via `<nxp-doc-code>`,
 * which provides highlight.js syntax highlighting and a copy-to-clipboard
 * button.
 */
@Component({
  selector: 'nxp-doc-demo',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
    NxpDocCodeComponent,
    NxpDocJsonPipe,
    NxpSegmentedComponent,
    NxpSwitchComponent,
  ],
  template: `
    <div [class]="settingsClass">
      <div class="inline-flex items-center gap-2 text-xs">
        <nxp-switch
          size="s"
          [checked]="dark()"
          (checkedChange)="onModeChange($event)"
        />
        <small>{{ texts()[0] }}</small>
      </div>
      <div class="inline-flex items-center gap-2 text-xs">
        <nxp-switch
          size="s"
          [checked]="opaque()"
          (checkedChange)="changeOpaque($event)"
        />
        <small>{{ texts()[1] }}</small>
      </div>
    </div>
    @if (tabs().length > 1) {
      <div class="flex items-center px-3 pb-2">
        <nxp-segmented size="sm" [(activeItemIndex)]="activeTabIndex">
          @for (tab of tabs(); track tab.id) {
            <button type="button">{{ tab.label }}</button>
          }
        </nxp-segmented>
      </div>
    }
    @if (activeTab() === 'preview') {
      <div
        [class]="wrapperClass()"
        [style.visibility]="rendered() ? 'visible' : 'hidden'"
      >
        <div class="flex-1 min-w-0 p-6">
          <div #content id="demo-content">
            @if (form) {
              <form id="nxp-demo-form" [formGroup]="form">
                <ng-container [ngTemplateOutlet]="template() || null" />
              </form>
            }
            <ng-content />
          </div>
        </div>
      </div>
      @if (form) {
        <div class="p-2">
          @if (expanded()) {
            <pre class="bg-bg-base rounded-m p-3 text-xs overflow-auto"
              >{{ texts()[2] }}: {{ form.value | nxpDocJson }}</pre
            >
          }
          <div class="flex gap-1 p-1">
            <button
              type="button"
              [class]="buttonClass"
              (click)="toggleDetails()"
            >
              {{ expanded() ? '−' : '+' }} {{ texts()[2] }}
            </button>
            <select
              [class]="selectClass"
              [ngModel]="updateOn()"
              (ngModelChange)="updateOnChange($event)"
              [ngModelOptions]="{ standalone: true }"
            >
              @for (variant of updateOnVariants; track variant) {
                <option [ngValue]="variant">{{ variant }}</option>
              }
            </select>
            <button form="nxp-demo-form" type="reset" [class]="buttonClass">
              Reset
            </button>
            <button form="nxp-demo-form" type="submit" [class]="buttonClass">
              Submit
            </button>
          </div>
        </div>
      }
    } @else if (activeTab() === 'html') {
      <div class="p-2">
        <nxp-doc-code [code]="html()" language="HTML" />
      </div>
    } @else if (activeTab() === 'typescript') {
      <div class="p-2">
        <nxp-doc-code [code]="typescript()" language="TypeScript" />
      </div>
    }
  `,
  host: {
    class:
      'relative block min-w-full mb-6 text-sm rounded-m overflow-hidden ' +
      'text-text-primary bg-bg-neutral-1 dark:bg-bg-neutral-2 ' +
      'shadow-[0_0_1rem_0.5rem_var(--nxp-bg-base,white)] dark:shadow-none',
    '[attr.data-theme]': 'theme()',
    '[class._sticky]': 'sticky()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocDemoComponent implements AfterViewInit {
  private readonly locationRef = inject(Location);
  private readonly urlSerializer = inject(UrlSerializer);
  private readonly urlStateHandler = inject(NXP_DOC_URL_STATE_HANDLER);
  private readonly themeService = inject(ThemeService);

  protected readonly template = contentChild(
    TemplateRef<Record<string, unknown>>,
  );
  protected readonly rendered = signal(false);
  protected readonly icons = inject(NXP_DOC_ICONS);
  protected readonly previewText = inject(NXP_DOC_PREVIEW_TEXT);

  protected readonly dark = signal(
    nxpCoerceValueIsTrue(this.params.darkMode ?? this.themeService.isDark()),
  );

  protected readonly theme = computed(() => (this.dark() ? 'dark' : 'light'));

  protected readonly $ = toObservable(this.themeService.isDark)
    .pipe(skip(1), takeUntilDestroyed())
    .subscribe((mode) => this.onModeChange(mode));

  protected form?: FormGroup;
  protected readonly updateOnVariants = ['change', 'blur', 'submit'] as const;

  protected readonly updateOn = signal<'blur' | 'change' | 'submit'>(
    this.params.updateOn || 'change',
  );
  protected readonly opaque = signal(
    nxpCoerceValueIsTrue(this.params.sandboxOpaque ?? true),
  );
  protected readonly expanded = signal(
    nxpCoerceValueIsTrue(this.params.sandboxExpanded ?? false),
  );
  protected readonly texts = inject(NXP_DOC_DEMO_TEXTS);

  public readonly control = input<AbstractControl | null>(null);
  public readonly sticky = input(true);
  /** Optional HTML source — when set, adds an "HTML" tab. */
  public readonly html = input('');
  /** Optional TypeScript source — when set, adds a "TypeScript" tab. */
  public readonly typescript = input('');

  protected readonly activeTabIndex = signal(0);

  protected readonly tabs = computed<readonly { id: DemoTab; label: string }[]>(
    () => {
      const list: { id: DemoTab; label: string }[] = [
        { id: 'preview', label: this.previewText() },
      ];
      if (this.html()) list.push({ id: 'html', label: 'HTML' });
      if (this.typescript())
        list.push({ id: 'typescript', label: 'TypeScript' });
      return list;
    },
  );

  protected readonly activeTab = computed<DemoTab>(
    () => this.tabs()[this.activeTabIndex()]?.id ?? 'preview',
  );

  protected readonly settingsClass = cx(
    'flex gap-4 items-center justify-end px-3 py-2',
  );

  protected readonly wrapperClass = computed(() =>
    cx(
      'flex max-w-full min-h-24 w-full p-1 box-border rounded-m overflow-hidden bg-bg-base',
      this.opaque()
        ? ''
        : 'bg-[linear-gradient(45deg,_var(--nxp-bg-neutral-1,_#f9fafb)_25%,_transparent_25%),_linear-gradient(-45deg,_var(--nxp-bg-neutral-1,_#f9fafb)_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_var(--nxp-bg-neutral-1,_#f9fafb)_75%),_linear-gradient(-45deg,_transparent_75%,_var(--nxp-bg-neutral-1,_#f9fafb)_75%)] bg-[length:1.25rem_1.25rem]',
    ),
  );

  protected readonly buttonClass = cx(
    'inline-flex items-center justify-center px-2 py-1 rounded-s text-xs font-medium border border-border-normal bg-bg-base text-text-primary hover:bg-bg-neutral-1 transition-colors',
  );

  protected readonly selectClass = cx(
    'ml-auto px-2 py-1 rounded-s text-xs border border-border-normal bg-bg-base text-text-primary',
  );

  public ngAfterViewInit(): void {
    this.createForm();
    this.rendered.set(true);
  }

  protected onModeChange(darkMode: boolean): void {
    this.dark.set(darkMode);
    this.updateUrl({ darkMode });
  }

  protected toggleDetails(): void {
    this.expanded.update((v) => !v);
    this.updateUrl({ sandboxExpanded: this.expanded() });
  }

  protected changeOpaque(opaque: boolean): void {
    this.opaque.set(opaque);
    this.updateUrl({ sandboxOpaque: opaque });
  }

  protected updateOnChange(updateOn: 'blur' | 'change' | 'submit'): void {
    this.updateOn.set(updateOn);
    this.updateUrl({ updateOn });
    this.createForm();
  }

  private get params(): Params | NxpDocDemoParams {
    return this.getUrlTree().queryParams;
  }

  private updateUrl(params: NxpDocDemoParams): void {
    const tree = this.getUrlTree();
    tree.queryParams = {
      ...tree.queryParams,
      ...nxpCleanObject({ ...params }),
    };
    this.locationRef.go(this.urlStateHandler(tree));
  }

  private createForm(): void {
    const control = this.control();
    if (control) {
      this.form = new FormGroup(
        { value: control },
        { updateOn: this.updateOn() },
      );
    }
  }

  private getUrlTree(): UrlTree {
    return this.urlSerializer.parse(this.locationRef.path());
  }
}
