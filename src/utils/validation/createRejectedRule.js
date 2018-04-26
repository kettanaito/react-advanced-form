// @flow
export type TFieldSelector = 'name' | 'type';
export type TRejectedRule = {
  name: string,
  selector?: TFieldSelector,
  isCustom?: boolean
};

/**
 * Creates a rejected rule.
 * Used as the unification function to produce the validation result
 * in case of rejected validation rule.
 */
export default function createRejectedRule(
  name: string,
  selector?: TFieldSelector,
  isCustom?: boolean = false
): TRejectedRule {
  return {
    name,
    selector,
    isCustom
  };
}
