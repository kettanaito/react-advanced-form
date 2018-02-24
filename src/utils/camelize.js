/**
 * Returns a string formatted in camelCase from the passed strings.
 * @param {string[]} args
 * @return {string}
 */
export default function camelize(...args) {
  return args.join('-').replace(/-(.)/g, (_, char) => char.toUpperCase());
}
