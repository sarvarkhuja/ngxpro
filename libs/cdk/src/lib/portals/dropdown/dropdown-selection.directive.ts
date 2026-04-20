import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  computed,
  Directive,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EMPTY_CLIENT_RECT, NXP_TRUE_HANDLER } from '../../constants';
import { nxpAsDriver, NxpDriver } from '../../classes/driver';
import { nxpAsRectAccessor, type NxpRectAccessor } from '../../classes/accessors';
import { nxpInjectElement } from '../../utils/inject-element';
import { nxpIsString } from '../../utils/is-string';
import { nxpGetWordRange } from '../../utils/get-word-range';
import { NXP_SELECTION_STREAM } from '../../tokens';
import type { NxpBooleanHandler } from '../../types';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  startWith,
  tap,
  throttleTime,
} from 'rxjs';
import { NxpDropdownDirective } from './dropdown.directive';

/**
 * Directive that opens a dropdown based on text selection within the host element.
 * Useful for "comment on selection" or rich text toolbar patterns.
 */
@Directive({
  selector: '[nxpDropdownSelection]',
  providers: [nxpAsDriver(NxpDropdownSelection), nxpAsRectAccessor(NxpDropdownSelection)],
})
export class NxpDropdownSelection
  extends NxpDriver
  implements NxpRectAccessor
{
  protected readonly doc = inject(DOCUMENT);
  protected readonly dropdown = inject(NxpDropdownDirective);
  protected readonly el = nxpInjectElement();
  protected readonly handler = computed((visible = this.nxpDropdownSelection()) =>
    nxpIsString(visible) ? NXP_TRUE_HANDLER : visible,
  );

  protected readonly stream$ = combineLatest([
    toObservable(this.handler),
    inject(NXP_SELECTION_STREAM).pipe(
      map(() => this.getRange()),
      filter((range) => this.isValid(range)),
      distinctUntilChanged(
        (x, y) =>
          x.startOffset === y.startOffset &&
          x.endOffset === y.endOffset &&
          x.commonAncestorContainer === y.commonAncestorContainer,
      ),
    ),
    merge(fromEvent(this.el, 'scroll', { passive: true, capture: true })).pipe(
      throttleTime(16),
      startWith(0),
    ),
  ]).pipe(
    tap(([, range]) => {
      this.range =
        this.el.contains(range.commonAncestorContainer) &&
        range.commonAncestorContainer.nodeType === Node.TEXT_NODE
          ? range
          : this.range;
    }),
    map(([handler, range]) => {
      const contained = this.el.contains(range.commonAncestorContainer);
      const valid = contained && handler(this.range);
      return valid || this.inDropdown(range);
    }),
  );

  protected range = isPlatformBrowser(inject(PLATFORM_ID))
    ? new Range()
    : ({} as unknown as Range);

  public readonly type = 'dropdown';
  public readonly nxpDropdownSelection = input<NxpBooleanHandler<Range> | string>('');
  public readonly nxpDropdownSelectionPosition = input<'selection' | 'tag' | 'word'>(
    'selection',
  );

  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
  }

  public getClientRect(): DOMRect {
    switch (this.nxpDropdownSelectionPosition()) {
      case 'tag': {
        const { commonAncestorContainer } = this.range;
        const element =
          commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            ? (commonAncestorContainer as Element)
            : commonAncestorContainer.parentNode;
        return element instanceof Element
          ? element.getBoundingClientRect()
          : EMPTY_CLIENT_RECT;
      }
      case 'word':
        return nxpGetWordRange(this.range).getBoundingClientRect();
      default:
        return this.range.getBoundingClientRect();
    }
  }

  private getRange(): Range {
    const selection = this.doc.getSelection();
    const range = (selection?.rangeCount && selection.getRangeAt(0)) || this.range;
    return range.cloneRange();
  }

  private inDropdown(range: Range): boolean {
    const { startContainer, endContainer } = range;
    const inDropdown = this.boxContains(range.commonAncestorContainer);
    const hostToDropdown =
      this.boxContains(endContainer) && this.el.contains(startContainer);
    const dropdownToHost =
      this.boxContains(startContainer) && this.el.contains(endContainer);
    return inDropdown || hostToDropdown || dropdownToHost;
  }

  private boxContains(node: Node): boolean {
    return !!this.dropdown.ref()?.location.nativeElement.contains(node);
  }

  private isValid(range: Range): boolean {
    return !this.el.contains(range.commonAncestorContainer);
  }
}
