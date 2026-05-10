function inspectArray(array: readonly unknown[], depth: number): string {
  if (depth === 0) {
    return '[…]';
  }

  let result = '';
  let first = true;

  for (let index = 0; index < array.length; index++) {
    if (first) {
      first = false;
    } else {
      result += ', ';
    }

    result += index in array ? nxpInspect(array[index], depth - 1) : 'empty';
  }

  return `[${result}]`;
}

function inspectObject(object: Record<string, unknown>, depth: number): string {
  if (depth === 0) {
    return '{…}';
  }

  let result = '';
  let first = true;

  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      continue;
    }

    if (first) {
      first = false;
    } else {
      result += ', ';
    }

    result += `${key}: ${nxpInspect(object[key], depth - 1)}`;
  }

  return `{${result}}`;
}

/**
 * Returns a readable JS representation of `data` up to the given `depth`.
 * Used by `<nxp-doc-api>` to format property values for the table.
 */
export function nxpInspect<T>(data: T, depth: number): string {
  if (data === null) {
    return 'null';
  }

  switch (typeof data) {
    case 'boolean':
    case 'function':
    case 'number':
    case 'undefined':
      return String(data);
    case 'string':
      return `'${data}'`;
    default:
      break;
  }

  if (data instanceof RegExp) {
    return String(data);
  }

  return Array.isArray(data)
    ? inspectArray(data, depth)
    : inspectObject(data as unknown as Record<string, unknown>, depth);
}
