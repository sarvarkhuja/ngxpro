import { NxpCopyComponent } from './copy.component';
import { NxpCopyDirective } from './copy.directive';
import { NxpCopyProcessorDirective } from './copy-processor.directive';

/** Convenience array for importing all copy primitives in one go. */
export const NxpCopy = [
  NxpCopyComponent,
  NxpCopyDirective,
  NxpCopyProcessorDirective,
] as const;
