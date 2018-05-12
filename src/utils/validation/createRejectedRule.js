/**
 * Creates a rejected rule with the standardized shape.
 */
export default function createRejectedRule({
  errorType,
  ruleKeyPath,
  isCustom = false,
}) {
  return {
    errorType,
    ruleKeyPath,
    isCustom,
  }
}
