/**
 * Returns a camelCase event name based on the provided set of strings.
 * @param {string[]} args
 * @return {string}
 */
export default function createEvent(...args) {
  return args.join('-').replace(/-(.)/g, (substr, char) => char.toUpperCase());
}
