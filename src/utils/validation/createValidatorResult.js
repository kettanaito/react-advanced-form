//
// TODO
// Consider removing this.
//
export default function createValidatorResult(name, result) {
  return {
    ...(result || { expected: result }),
    name,
  }
}
