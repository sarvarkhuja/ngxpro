import { nxpCreateOptions } from '@nxp/cdk';
import { NXP_TEXT_MORPH_DEFAULT_OPTIONS, type NgxproTextMorphOptions } from './text-morph.types';

export const [NXP_TEXT_MORPH_OPTIONS, provideTextMorphOptions] =
  nxpCreateOptions<NgxproTextMorphOptions>(NXP_TEXT_MORPH_DEFAULT_OPTIONS);
