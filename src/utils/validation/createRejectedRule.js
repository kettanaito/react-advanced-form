/**
 * Creates a rejected rule with the standardized shape.
 */
export default function createRejectedRule({
  name,
  selector,
  isCustom = false,
}) {
  return {
    name,
    selector,
    isCustom,
  }
}
