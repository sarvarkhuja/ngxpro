import {
  NgComponentOutlet,
  NgTemplateOutlet,
  isPlatformBrowser,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  TemplateRef,
  type Type,
  computed,
  inject,
  input,
  type OnChanges,
  resource,
  type Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  cx,
  fromIntersectionObserver,
  NXP_DOCUMENT,
  NXP_WINDOW,
  nxpInjectElement,
  nxpWriteToClipboard,
} from '@ngxpro/cdk';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NxpDocCodeComponent } from '@ngxpro/addon-doc-lib/code';
import {
  NXP_DOC_CODE_ACTIONS,
  NXP_DOC_CODE_EDITOR,
  NXP_DOC_COPY_TEXTS,
  NXP_DOC_EXAMPLE_CONTENT_PROCESSOR,
  NXP_DOC_ICONS,
  NXP_DOC_PREVIEW_TEXT,
} from '@ngxpro/addon-doc-lib/tokens';
import type { NxpRawLoaderContent } from '@ngxpro/addon-doc-lib/types';
import { nxpRawLoadRecord, nxpToKebab } from '@ngxpro/addon-doc-lib/utils';
import { NxpSegmentedComponent } from '@ngxpro/components/segmented';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import {
  NXP_DOC_EXAMPLE_OPTIONS,
  type NxpDocExampleOptions,
} from './example.options';
import { NxpDocExampleGetTabsPipe } from './example-get-tabs.pipe';

type ExampleComponentLoader = Promise<
  Type<unknown> | { default: Type<unknown> }
>;

/**
 * Live demo + tabbed source-code viewer for a single component.
 *
 * Renders an optional heading + description, a segmented tab strip, and the
 * tab body — either the projected preview content / lazily mounted demo
 * component, or a `<nxp-doc-code>` block per source file.
 *
 * Loads source files via Promises (`?raw` imports). Optional integration with
 * an external IDE (StackBlitz etc.) is gated behind `NXP_DOC_CODE_EDITOR`.
 *
 * @example
 * <nxp-doc-example
 *   heading="With icon"
 *   id="with-icon"
 *   [content]="{ TypeScript: 'import...', HTML: '<button>…</button>' }"
 * >
 *   <button nxp-button>Click me</button>
 * </nxp-doc-example>
 */
@Component({
  selector: 'nxp-doc-example',
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    NxpDocCodeComponent,
    NxpDocExampleGetTabsPipe,
    NxpSegmentedComponent,
    RouterLink,
  ],
  template: `
    @if (heading()) {
      <header class="flex flex-col gap-1">
        <h3 class="text-base font-bold">
          <a
            routerLink="."
            data-nxp-example-link
            [class]="linkClasses"
            [attr.title]="copy()"
            [fragment]="resolvedId()"
            [relativeTo]="route.firstChild ?? route"
            (click)="copyExampleLink($event.currentTarget)"
          >
            {{ heading() }}
            <i [class]="linkIconClass" aria-hidden="true"></i>
          </a>
        </h3>
        @if (descriptionTemplate(); as tpl) {
          <div class="text-sm text-text-secondary">
            <ng-container [ngTemplateOutlet]="tpl" />
          </div>
        } @else if (descriptionString()) {
          <div class="text-sm text-text-secondary">
            {{ descriptionString() }}
          </div>
        }
      </header>
    }
    <div [class]="exampleClasses()">
      @if (processor() | nxpDocExampleGetTabs: defaultTab(); as all) {
        @let tabs = preview() ? all : all.slice(1);
        @if (tabs.length) {
          <div [class]="headerClasses">
            <nxp-segmented [(activeItemIndex)]="activeItemIndex" class="flex-1">
              @for (tab of tabs; track tab) {
                <button type="button">
                  @let custom = getTabTitle(tab);
                  @if (isTemplate(custom); as templ) {
                    <ng-container
                      [ngTemplateOutlet]="$any(custom)"
                      [ngTemplateOutletContext]="{ $implicit: tab }"
                    />
                  } @else {
                    {{ custom }}
                  }
                </button>
              }
            </nxp-segmented>
            @if (canEdit()) {
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-neutral-2 transition-colors duration-normal"
                [attr.disabled]="loading() ? true : null"
                (click)="edit(processor())"
              >
                Edit on {{ codeEditor?.name }}
              </button>
            }
            @if (fullscreenEnabled && preview()) {
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xs p-1 text-text-secondary hover:text-text-primary hover:bg-bg-neutral-2 transition-colors duration-normal"
                [attr.aria-label]="
                  fullscreen() ? 'Exit fullscreen' : 'Enter fullscreen'
                "
                (click)="toggleFullscreen()"
              >
                <i
                  [class]="
                    (fullscreen() ? icons.shrink : icons.expand) +
                    ' text-base leading-none'
                  "
                  aria-hidden="true"
                ></i>
              </button>
            }
          </div>
        }
        @for (tab of tabs; track tab) {
          <div class="rounded-m">
            @if (!$index && preview()) {
              <section
                data-nxp-doc-example
                [class]="demoClasses()"
                [style.display]="
                  activeItemIndex() === $index ? 'block' : 'none'
                "
              >
                <ng-container *ngTemplateOutlet="defaultContent" />
                <ng-container
                  *ngComponentOutlet="lazyComponent.value() ?? null"
                />
              </section>
            }
            @let code = processor()[tab] || '';
            <nxp-doc-code
              [code]="code"
              [style.display]="
                activeItemIndex() === $index && ($index || !preview())
                  ? 'block'
                  : 'none'
              "
            >
              @for (action of codeActions; track $index) {
                @if (isTemplate(action); as templ) {
                  <ng-container
                    [ngTemplateOutlet]="$any(action)"
                    [ngTemplateOutletContext]="{ $implicit: code }"
                  />
                } @else {
                  {{ action }}
                }
              }
            </nxp-doc-code>
          </div>
        } @empty {
          <div class="rounded-m">
            <section [class]="demoClasses()">
              <ng-container *ngTemplateOutlet="defaultContent" />
            </section>
          </div>
        }
      }
    </div>
    <ng-template #defaultContent>
      <ng-content />
    </ng-template>
  `,
  host: {
    class: 'relative block pt-8 scroll-mt-16',
    '[attr.id]': 'resolvedId()',
    '[class._fullsize]': 'fullsize()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocExampleComponent implements OnChanges {
  private readonly doc = inject(NXP_DOCUMENT);
  private readonly win = inject(NXP_WINDOW);
  private readonly host = nxpInjectElement<HTMLElement>();
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly copyTexts = inject(NXP_DOC_COPY_TEXTS);
  private readonly processContent = inject(NXP_DOC_EXAMPLE_CONTENT_PROCESSOR);

  private readonly rawLoader$$ = new BehaviorSubject<
    Record<string, NxpRawLoaderContent>
  >({});

  protected readonly fullscreenEnabled =
    this.isBrowser && this.doc.fullscreenEnabled;
  protected readonly icons = inject(NXP_DOC_ICONS);
  protected readonly options: NxpDocExampleOptions = inject(
    NXP_DOC_EXAMPLE_OPTIONS,
  );
  protected readonly defaultTab = inject(NXP_DOC_PREVIEW_TEXT);
  protected readonly codeEditor = inject(NXP_DOC_CODE_EDITOR, {
    optional: true,
  });
  protected readonly codeActions = inject(NXP_DOC_CODE_ACTIONS);
  protected readonly route = inject(ActivatedRoute);
  protected readonly activeItemIndex = signal(0);
  protected readonly fullscreen = signal(false);
  protected readonly copy = computed(() => this.copyTexts()[0]);
  protected readonly loading = signal(false);

  protected readonly resolvedId = computed(
    () => this.id() || nxpToKebab(this.heading()),
  );

  protected readonly processor: Signal<Record<string, string>> = toSignal(
    this.rawLoader$$.pipe(
      switchMap((value) => nxpRawLoadRecord(value)),
      map((value) => this.processContent(value)),
    ),
    { initialValue: {} },
  );

  protected readonly lazyComponent = resource<
    Type<unknown> | null,
    ExampleComponentLoader | undefined
  >({
    params: () => this.component(),
    loader: async ({ params }): Promise<Type<unknown> | null> => {
      if (!params) return null;
      const component = await params;
      return component &&
        typeof component === 'object' &&
        'default' in component
        ? (component as { default: Type<unknown> }).default
        : (component as Type<unknown>);
    },
    defaultValue: null,
  });

  /** Heading shown above the demo. Doubles as the auto-generated `id` source. */
  public readonly heading = input('');
  /** Optional explicit `id` override; falls back to `kebab(heading)`. */
  public readonly id = input('');
  /** Description shown under the heading. Either a string or a `TemplateRef`. */
  public readonly description = input<string | TemplateRef<unknown> | null>(
    null,
  );
  /** Whether the demo box should fill the parent width. */
  public readonly fullsize = input(this.options.fullsize);
  /** Lazy-loaded demo component (resolved via dynamic import). */
  public readonly component = input<ExampleComponentLoader>();
  /** Map of tab name → file source (string or `?raw` Promise). */
  public readonly content = input<Record<string, NxpRawLoaderContent>>({});
  /** Whether to render the live "Preview" tab (set false for documentation-only blocks). */
  public readonly preview = input(true);

  protected readonly linkClasses = cx(
    'inline-flex items-center gap-1 no-underline text-text-primary',
    'hover:after:text-text-secondary',
  );

  protected readonly linkIconClass = cx(
    'ri-link text-base leading-none text-transparent transition-colors duration-normal',
  );

  protected readonly headerClasses = cx(
    'flex justify-between items-center gap-1 overflow-auto pb-1 pr-0.5 bg-bg-neutral-1 dark:bg-bg-neutral-2',
  );

  protected readonly descriptionTemplate = computed(() =>
    this.description() instanceof TemplateRef
      ? (this.description() as TemplateRef<unknown>)
      : null,
  );

  protected readonly descriptionString = computed(() =>
    typeof this.description() === 'string'
      ? (this.description() as string)
      : '',
  );

  protected readonly exampleClasses = computed(() =>
    cx(
      'relative rounded-m border-4 border-bg-neutral-1 dark:border-bg-neutral-2 overflow-hidden mt-5',
      this.fullscreen() && 'fixed inset-0 z-[1000] mt-0',
    ),
  );

  protected readonly demoClasses = computed(() =>
    cx(
      'relative p-8 max-w-full overflow-x-auto',
      !this.fullsize() && 'min-w-[21rem] w-fit',
    ),
  );

  public constructor() {
    if (this.isBrowser) {
      fromIntersectionObserver(this.host)
        .pipe(takeUntilDestroyed())
        .subscribe((entries) => {
          for (const entry of entries) {
            this.doc.dispatchEvent(
              new CustomEvent('nxp-example', {
                detail: {
                  id: this.resolvedId(),
                  intersecting: entry.isIntersecting,
                },
              }),
            );
          }
        });
    }
  }

  public ngOnChanges(): void {
    this.rawLoader$$.next(this.content());
  }

  protected canEdit(): boolean {
    if (!this.codeEditor) return false;
    return this.options.codeEditorVisibilityHandler(this.processor());
  }

  protected getTabTitle(fileName: string): string | TemplateRef<unknown> {
    return this.options.tabTitles.get(fileName) || fileName;
  }

  protected isTemplate(value: unknown): TemplateRef<unknown> | null {
    return value instanceof TemplateRef ? value : null;
  }

  protected toggleFullscreen(): void {
    this.fullscreen.update((v) => !v);
  }

  protected async copyExampleLink(target: EventTarget | null): Promise<void> {
    const href = (target as HTMLAnchorElement | null)?.href ?? '';
    if (!href) return;
    await nxpWriteToClipboard(href, this.doc);
  }

  protected edit(files: Record<string, string>): void {
    if (!this.codeEditor) return;
    const pathname = this.win?.location.pathname.slice(1) ?? '';
    this.loading.set(true);
    this.codeEditor
      .edit(pathname, this.resolvedId() || '', files)
      .finally(() => this.loading.set(false));
  }
}
