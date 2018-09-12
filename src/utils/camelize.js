// @flow
/**
 * Takes the given string and returns it formatted it in cammelCase.
 */
export default function camelize(...args: string[]): string {
  return args
    .join('-')
    .replace(/-(.)/g, (_, char: string) => char.toUpperCase())
}
