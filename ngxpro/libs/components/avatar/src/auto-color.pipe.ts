import { Pipe, type PipeTransform } from '@angular/core';

/* eslint-disable no-bitwise */
/**
 * Converts a string to a deterministic HSL color.
 * Same input always produces the same color.
 */
export function nxpAutoColor(value: string): string {
  if (value === '') {
    return '';
  }

  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash;
  }

  const hue = hash % 360;
  const saturation = 60 + (hash % 5);
  const lightness = 80 + (hash % 5);

  return `hsl(${hue},${saturation}%,${lightness}%)`;
}

@Pipe({ name: 'nxpAutoColor', standalone: true })
export class AutoColorPipe implements PipeTransform {
  transform(text: string): string {
    return nxpAutoColor(text);
  }
}
