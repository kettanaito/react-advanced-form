// @flow
/**
 * Takes the given string parts and returns them as a single
 * string formatted in cammelCase.
 * @example
 * camelize('foo', 'bar')
 * // "fooBar"
 */
export default function camelize(...args: string[]): string {
  return args
    .join('-')
    .replace(/-(.)/g, (_, char: string) => char.toUpperCase())
}
