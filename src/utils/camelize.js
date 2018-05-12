/**
 * Returns a string formatted in camelCase from the passed strings.
 * @param {string[]} args
 * @return {string}
 * @flow
 */
export default function camelize(...args: string[]): string {
  return args
    .join('-')
    .replace(/-(.)/g, (_, char: string) => char.toUpperCase())
}
