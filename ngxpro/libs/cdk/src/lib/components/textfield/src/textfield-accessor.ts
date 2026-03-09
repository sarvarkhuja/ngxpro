// Re-export from the CDK barrel so consumers of @nxp/cdk/components/textfield
// continue to get these types from this entry point.
export {
  NXP_TEXTFIELD_ACCESSOR,
  nxpAsTextfieldAccessor,
  NXP_LABEL,
  NXP_TEXTFIELD,
} from '@nxp/cdk';
export type { NxpTextfieldAccessor } from '@nxp/cdk';
