let autoId = 0;

/**
 * Generates a unique string id for portal context and similar use cases.
 * Pattern from Taiga UI CDK.
 */
export function nxpGenerateId(): string {
  return `nxp_${++autoId}_${Date.now()}`;
}
