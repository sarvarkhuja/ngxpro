import { DataListComponent } from './data-list.component';
import { OptGroupDirective } from './opt-group.directive';
import { OptionDirective } from './option.directive';

export { DataListComponent } from './data-list.component';
export { OptionDirective } from './option.directive';
export { OptGroupDirective } from './opt-group.directive';

/**
 * Convenience array — spread into `imports` to bring in all DataList pieces.
 * Mirrors the Taiga UI `TuiDataList` pattern.
 *
 * @example
 * @Component({ imports: [...NxpDataList] })
 */
export const NxpDataList = [
  DataListComponent,
  OptionDirective,
  OptGroupDirective,
] as const;
