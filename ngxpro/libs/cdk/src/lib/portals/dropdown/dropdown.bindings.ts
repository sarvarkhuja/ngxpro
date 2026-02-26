import { type Signal, type WritableSignal } from '@angular/core';
import { nxpDirectiveBinding } from '../../utils/directive-binding';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { NxpDropdownDirective } from './dropdown.directive';
import { NxpDropdownOpen } from './dropdown-open.directive';

type C = PolymorpheusContent;

/**
 * Creates a reactive binding to the nxpDropdown input of NxpDropdownDirective.
 * Use within an injection context (e.g. constructor or field initializer).
 */
export function nxpDropdown(value: C | WritableSignal<C>): WritableSignal<C>;
export function nxpDropdown(value: Signal<C>): Signal<C>;
export function nxpDropdown(value: C | Signal<C>): Signal<C> {
  return nxpDirectiveBinding(NxpDropdownDirective, 'nxpDropdown', value, {});
}

/**
 * Creates a reactive binding to the enabled input of NxpDropdownOpen.
 * Use within an injection context.
 */
export function nxpDropdownEnabled(
  value: WritableSignal<boolean> | boolean,
): WritableSignal<boolean>;
export function nxpDropdownEnabled(value: Signal<boolean>): Signal<boolean>;
export function nxpDropdownEnabled(value: Signal<boolean> | boolean): Signal<boolean> {
  return nxpDirectiveBinding(NxpDropdownOpen, 'enabled', value, {});
}
