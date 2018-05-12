export default function createValidatorResult(name, result) {
  return {
    ...result,
    name,
  }
}
