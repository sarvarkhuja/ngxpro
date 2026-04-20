import { nxpCreateOptions } from '../../utils/create-options';

export interface NxpDropdownHoverOptions {
  readonly hideDelay: number;
  readonly showDelay: number;
}

export const NXP_DROPDOWN_HOVER_DEFAULT_OPTIONS: NxpDropdownHoverOptions = {
  showDelay: 200,
  hideDelay: 500,
};

export const [NXP_DROPDOWN_HOVER_OPTIONS, nxpDropdownHoverOptionsProvider] = nxpCreateOptions(
  NXP_DROPDOWN_HOVER_DEFAULT_OPTIONS,
);
