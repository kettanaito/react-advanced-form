/**
 * Asynchronous version of R.evolve.
 * Accepts transformation function that return a Promise,
 * and await until it resolves into the next value.
 * Useful for fields evolving that includes asynchronous validation.
 */
export default async function evolveP(transformations, obj) {
  let result = {}
  let transformation, key, type

  for (key in obj) {
    transformation = transformations[key]
    type = typeof transformation
    result[key] =
      type === 'function'
        ? await transformation(obj[key])
        : transformation && type === 'object'
        ? await evolveP(transformation, obj[key])
        : obj[key]
  }

  return result
}
