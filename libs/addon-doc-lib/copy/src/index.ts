/**
 * `<nxp-doc-copy>` is a thin re-export of `@ngxpro/cdk/components/copy`'s
 * `NxpCopyComponent`. Kept as a separate symbol so callers can keep their
 * doc-time imports anchored under `@ngxpro/addon-doc-lib/*` without
 * reaching into the CDK directly.
 *
 * @example
 * import { NxpDocCopy, NxpDocCopyComponent } from '@ngxpro/addon-doc-lib/copy';
 * <nxp-copy>npm install @ngxpro/components</nxp-copy>
 */
export {
  NxpCopyComponent as NxpDocCopyComponent,
  NxpCopy as NxpDocCopy,
} from '@ngxpro/cdk/components/copy';
