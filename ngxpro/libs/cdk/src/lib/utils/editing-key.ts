const KEYS: readonly string[] = [
  'Spacebar',
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'Left',
  'Right',
  'End',
  'Home',
];

/**
 * Returns true if the given keyboard key is considered an editing key
 * (single character input or navigation/edit keys).
 */
export function nxpIsEditingKey(key = ''): boolean {
  return key.length === 1 || KEYS.includes(key);
}
