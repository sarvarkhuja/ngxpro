import { nxpIsString } from '@ngxpro/cdk';

export type NxpDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? NxpDeepPartial<T[K]> : T[K];
};

type EmptyValue = '' | null | undefined;

function checkValueIsEmpty<T>(value: EmptyValue | T): value is EmptyValue {
  return nxpIsString(value)
    ? value.trim() === ''
    : value == null || Number.isNaN(value);
}

/**
 * Returns a copy of `object` with empty / nullish leaves stripped. Used to
 * keep query-param state minimal in `<nxp-doc-demo>` and `<nxp-doc-api>`.
 */
export function nxpCleanObject<T>(object: T): NxpDeepPartial<T> {
  return JSON.parse(
    JSON.stringify(object, (_key: string, value: unknown) =>
      checkValueIsEmpty(value) ? undefined : value,
    ),
  );
}
