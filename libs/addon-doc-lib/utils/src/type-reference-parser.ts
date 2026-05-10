export type NxpDocTypeReferenceParsed = ReadonlyArray<{
  type: string;
  extracted: string;
}>;

/**
 * Splits a TypeScript type expression into individual reference fragments,
 * extracting the "interesting" inner type per fragment so consumers can map
 * it to a documentation URL. Mirrors `tuiTypeReferenceParser`.
 *
 * Note: only the parser is exposed by default — the API table renderer
 * accepts pre-parsed strings. Consumers that want auto-parsing register a
 * handler via `NXP_DOC_TYPE_REFERENCE_HANDLER`.
 */
export function nxpTypeReferenceParser(
  types: string,
): NxpDocTypeReferenceParsed {
  const generics = types.match(/<[^>]+>/g);

  const escaped = generics
    ? generics
        .reduce(
          (result, current) =>
            result.replace(current, current.replaceAll('|', '&')),
          types,
        )
        .split('|')
        .map((item) => item.trim())
    : types.split('|').map((item) => item.trim());

  return escaped.reduce<NxpDocTypeReferenceParsed>((result, type) => {
    let extracted = type
      .trim()
      .replaceAll('readonly ', '')
      .replaceAll('[]', '');

    extracted =
      /ReadonlyArray<([^>]+)>/.exec(extracted)?.[1]?.split('&')?.[0] ??
      extracted;
    extracted =
      /\[([^\]]+)\]/.exec(extracted)?.[1]?.split(',')?.[0] ?? extracted;
    extracted = (extracted.split('<')?.[0] ?? extracted)?.trim() ?? '';
    extracted = Number.isNaN(Number.parseFloat(extracted))
      ? extracted
      : 'number';
    extracted = /^'.+'$|^".+"$|^`.+`$/.test(extracted) ? 'string' : extracted;
    extracted = extracted.length === 1 ? 'unknown' : extracted;

    return result.concat({ type: type.replaceAll('&', '|'), extracted });
  }, []);
}
