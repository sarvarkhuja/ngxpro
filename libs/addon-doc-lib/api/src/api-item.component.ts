import { Location, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
  model,
  type OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, type Params, UrlSerializer } from '@angular/router';
import { cx } from '@ngxpro/cdk';
import { NXP_DOC_URL_STATE_HANDLER } from '@ngxpro/addon-doc-lib/tokens';
import { nxpCoerceValue } from '@ngxpro/addon-doc-lib/utils';
import { NxpDocApiNumberItemDirective } from './api-item-number.directive';
import { NxpInspectPipe } from './inspect.pipe';
import { NxpTypeReferencePipe } from './type-reference.pipe';

const SERIALIZED_SUFFIX = '$';

/**
 * Single property row inside `<table nxpDocApi>`. Renders the property name,
 * its type signature, and an editor appropriate for the property's runtime
 * type (boolean → checkbox, number → number input, string → text input,
 * enumerated → `<select>`).
 *
 * Property values are persisted to the URL query string so a deep-linked
 * page reflects the current playground state.
 */
@Component({
  selector: 'tr[nxpDocApiItem]',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    NxpInspectPipe,
    NxpTypeReferencePipe,
  ],
  template: `
    <td class="align-top py-6 pr-8 max-md:py-2 max-md:pr-0">
      <code [class]="nameClasses()">{{ name() }}</code>
      <div class="hidden max-md:block mt-4">
        <ng-container *ngTemplateOutlet="hint" />
      </div>
      <ng-template #hint>
        <ng-content>{{ name() }}</ng-content>
      </ng-template>
    </td>
    <td class="align-top py-6 pr-8 max-md:py-2 max-md:pr-0">
      <code
        class="font-bold leading-6 inline-flex flex-wrap items-center gap-1 m-0"
      >
        @for (item of type() | nxpTypeReference; track item) {
          @if (item.reference) {
            <a
              rel="noreferrer"
              target="_blank"
              class="inline-flex items-center justify-center gap-1 text-text-action no-underline"
              [attr.href]="item.reference"
              >{{ item.type }}</a
            >
          } @else {
            <span>{{ item.type }}</span>
          }
          @if (!$last) {
            <span class="text-text-secondary">&nbsp;|&nbsp;</span>
          }
        }
      </code>
    </td>
    <td
      class="align-top py-6 pr-0 text-end min-w-40 max-md:py-2 max-md:text-start"
    >
      @if (items().length) {
        <select
          [class]="inputClasses"
          [ngModel]="value() ?? null"
          (ngModelChange)="onValueChange($event)"
        >
          <option [ngValue]="null"></option>
          @for (option of items(); track $index) {
            <option [ngValue]="option">{{ option | nxpInspect }}</option>
          }
        </select>
      } @else if (value() !== undefined) {
        @if (type() === 'boolean') {
          <input
            type="checkbox"
            class="size-5 align-middle"
            [id]="name()"
            [ngModel]="!!value()"
            (ngModelChange)="onValueChange($event)"
          />
        }
        @if (type() === 'string') {
          <input
            type="text"
            [class]="inputClasses"
            [id]="name()"
            [ngModel]="value() ?? ''"
            (ngModelChange)="onValueChange($event)"
          />
        }
        @if (
          type() === 'number' ||
          type() === 'bigint' ||
          type() === 'number | bigint'
        ) {
          <input
            type="number"
            [class]="inputClasses"
            [id]="name()"
            [max]="numberItem?.max() ?? null"
            [min]="numberItem?.min() ?? null"
            [step]="1"
            [ngModel]="value() ?? 0"
            (ngModelChange)="onValueChange($event ?? 0)"
          />
        }
      }
    </td>
  `,
  host: {
    class:
      'shadow-[inset_0_-1px_0_0_var(--nxp-border-normal,theme(colors.gray.200))] ' +
      'dark:shadow-[inset_0_-1px_0_0_var(--nxp-border-normal,theme(colors.gray.800))]',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxpDocApiItemComponent<T> implements OnInit {
  private readonly locationRef = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly urlSerializer = inject(UrlSerializer);
  private readonly urlStateHandler = inject(NXP_DOC_URL_STATE_HANDLER);

  protected readonly numberItem = inject(NxpDocApiNumberItemDirective, {
    self: true,
    optional: true,
  });

  protected readonly isBananaBox = computed(() => this.name().startsWith('[('));
  protected readonly isInput = computed(() => this.name().startsWith('['));
  protected readonly isOutput = computed(() => this.name().startsWith('('));

  public readonly name = input('');
  public readonly type = input('');
  public readonly value = model<T>();
  public readonly items = input([], {
    transform: (v?: readonly T[]) => v || [],
  });

  protected readonly nameClasses = computed(() =>
    cx(
      'flex items-center min-h-6 w-fit font-bold m-0 outline-none',
      this.isBananaBox() && 'text-text-action',
      this.isInput() && !this.isBananaBox() && 'text-status-negative',
      this.isOutput() && 'text-status-info',
      !this.isBananaBox() &&
        !this.isInput() &&
        !this.isOutput() &&
        'text-text-primary',
    ),
  );

  protected readonly inputClasses = cx(
    'block min-w-40 px-2 py-1 rounded-s border border-border-normal bg-bg-base text-text-primary',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus',
  );

  public ngOnInit(): void {
    this.parseParams(this.activatedRoute.snapshot.queryParams);
  }

  public onValueChange(value: T): void {
    this.value.set(value);
    this.setQueryParam(value);
  }

  private clearBrackets(value: string): string {
    return value.replaceAll(/[()[\]]/g, '');
  }

  private parseParams(params: Params): void {
    const name = this.clearBrackets(this.name());
    const propertyValue: string | undefined = params[name];
    const propertyValueWithSuffix: number | string | undefined =
      params[`${name}${SERIALIZED_SUFFIX}`];

    if (!propertyValue && !propertyValueWithSuffix) return;

    const items = this.items();
    let value =
      !!propertyValueWithSuffix && items
        ? items[propertyValueWithSuffix as number]
        : nxpCoerceValue(propertyValue);

    if (this.type() === 'string' && typeof value === 'number') {
      value = value.toString();
    }

    this.onValueChange(value as T);
  }

  private setQueryParam(value: T | boolean | number | string | null): void {
    const tree = this.urlSerializer.parse(this.locationRef.path());
    const isValueAvailableByKey = value instanceof Object;
    const items = this.items();

    const computedValue =
      isValueAvailableByKey && items ? items.indexOf(value as T) : value;

    const suffix = isValueAvailableByKey ? SERIALIZED_SUFFIX : '';
    const propName = `${this.clearBrackets(this.name())}${suffix}`;

    tree.queryParams = {
      ...tree.queryParams,
      [propName]: computedValue,
    };

    this.locationRef.go(this.urlStateHandler(tree));
  }
}
