import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  cx,
  NXP_DOCUMENT,
  nxpInjectElement,
  nxpWriteToClipboard,
} from '@ngxpro/cdk';
import {
  NXP_DOC_COPY_TEXTS,
  NXP_DOC_EXAMPLE_MARKDOWN_CODE_PROCESSOR,
  NXP_DOC_ICONS,
} from '@ngxpro/addon-doc-lib/tokens';
import type { NxpRawLoaderContent } from '@ngxpro/addon-doc-lib/types';
import { nxpRawLoad } from '@ngxpro/addon-doc-lib/utils';
import { Highlight } from 'ngx-highlightjs';
import {
  BehaviorSubject,
  map,
  startWith,
  Subject,
  switchMap,
  timer,
} from 'rxjs';

/**
 * Maps human-readable tab/file labels to highlight.js language identifiers.
 * Falls back to the lowercased input so consumers can pass an hljs name
 * directly (e.g. `'typescript'`, `'scss'`).
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  html: 'xml',
  htm: 'xml',
  xml: 'xml',
  svg: 'xml',
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'javascript',
  tsx: 'typescript',
  scss: 'scss',
  sass: 'scss',
  less: 'less',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  md: 'markdown',
  markdown: 'markdown',
};

function resolveHljsLanguage(value: string): string {
  if (!value) return 'plaintext';
  const key = value.trim().toLowerCase();
  return LANGUAGE_ALIASES[key] ?? key;
}

/**
 * Renders one or more code blocks with a copy-to-clipboard control.
 *
 * Highlighting is provided by `ngx-highlightjs` — consumers register the
 * loader via `provideHighlightOptions(...)` at the application level.
 *
 * Markdown fenced blocks are split via `NXP_DOC_EXAMPLE_MARKDOWN_CODE_PROCESSOR`.
 *
 * @example
 * <nxp-doc-code [code]="ts" filename="example.ts" language="typescript" />
 *
 * @example
 * <nxp-doc-code [code]="markdown">
 *   <button (click)="openInEditor()">Edit</button>
 * </nxp-doc-code>
 */
@Component({
  selector: 'nxp-doc-code',
  imports: [Highlight],
  template: `
    @if (filename()) {
      <p class="text-sm font-bold mb-1 text-text-primary">{{ filename() }}</p>
    }
    @for (content of processor(); track content) {
      <pre
        class="relative m-0 rounded-s overflow-hidden border border-border-normal bg-bg-base text-sm font-mono whitespace-pre-wrap break-words p-4 mt-4 first:mt-0"
      ><code class="block hljs" [highlight]="content" [language]="hljsLanguage()"></code><div
          class="absolute top-3 right-3 inline-flex items-center justify-center flex-row-reverse rounded-xs bg-bg-neutral-1 dark:bg-bg-neutral-2 gap-1 p-0.5"
        ><button
            type="button"
            class="inline-flex items-center justify-center rounded-xs p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-neutral-2 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
            [attr.aria-label]="copyText()"
            (click)="onCopy(content); $event.stopPropagation()"
          >
            <i [class]="iconClasses()" aria-hidden="true"></i>
          </button>
          <ng-content />
        </div></pre>
    }
  `,
  host: {
    class: 'block',
    '[class._has-filename]': 'hasFilename()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocCodeComponent implements OnChanges {
  private readonly icons = inject(NXP_DOC_ICONS);
  private readonly rawLoader$$ = new BehaviorSubject<NxpRawLoaderContent>('');
  private readonly texts = inject(NXP_DOC_COPY_TEXTS);
  private readonly doc = inject(NXP_DOCUMENT);
  protected readonly host = nxpInjectElement<HTMLElement>();

  protected readonly markdownCodeProcessor = inject(
    NXP_DOC_EXAMPLE_MARKDOWN_CODE_PROCESSOR,
  );

  protected readonly copy$ = new Subject<void>();
  protected readonly copyText = computed(() => this.texts()[0]);

  protected readonly icon = toSignal(
    this.copy$.pipe(
      switchMap(() =>
        timer(2000).pipe(
          map(() => this.icons.copy),
          startWith(this.icons.check),
        ),
      ),
    ),
    { initialValue: this.icons.copy },
  );

  protected readonly iconClasses = computed(() =>
    cx(this.icon(), 'text-base leading-none'),
  );

  protected readonly processor = toSignal(
    this.rawLoader$$.pipe(
      switchMap(nxpRawLoad),
      map((value: string) => this.markdownCodeProcessor(value)),
    ),
    { initialValue: [] },
  );

  /** Optional filename label shown above the code block. */
  public readonly filename = input('');
  /** Source code (raw string or `import('./file.ts?raw')` Promise). */
  public readonly code = input<NxpRawLoaderContent>('');
  /** Reserved for future "show line numbers" toggle (visual hook only). */
  public readonly lineNumbers = input(true);
  /**
   * Highlight.js language hint. Accepts hljs names (`typescript`, `xml`) or
   * common aliases (`HTML`, `TypeScript`, `ts`, `scss`). When empty, defaults
   * to `plaintext`.
   */
  public readonly language = input('');

  public readonly hasFilename = computed(() => !!this.filename());

  protected readonly hljsLanguage = computed(() =>
    resolveHljsLanguage(this.language() || this.filename()),
  );

  public ngOnChanges(): void {
    this.rawLoader$$.next(this.code());
  }

  protected async onCopy(content: string): Promise<void> {
    await nxpWriteToClipboard(content, this.doc);
    this.copy$.next();
  }
}
