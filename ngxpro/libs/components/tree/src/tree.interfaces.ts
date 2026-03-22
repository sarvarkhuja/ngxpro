import type { TemplateRef } from '@angular/core';
import type { NxpTreeItemComponent } from './tree-item.component';

/** Controller for expand/collapse behavior on tree items. */
export interface NxpTreeController {
  isExpanded(item: NxpTreeItemComponent): boolean;
  toggle(item: NxpTreeItemComponent): void;
}

/** Accessor that maps component instances to arbitrary data values. */
export interface NxpTreeAccessor<T> {
  register(item: NxpTreeItemComponent, value: T): void;
  unregister(item: NxpTreeItemComponent): void;
}

/** Context passed to custom content templates rendered inside a tree node. */
export interface NxpTreeItemContext<T> {
  readonly $implicit: T;
  readonly node: NxpTreeItemComponent;
}

/** Handler type for extracting children from a data item. */
export type NxpTreeHandler<T> = (item: T) => readonly T[];
