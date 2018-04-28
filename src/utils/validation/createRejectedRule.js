// @flow
export type TFieldSelector = 'name' | 'type';

type TCreateRejectedRuleArgs = {
  name: string,
  selector?: TFieldSelector,
  isCustom?: boolean
};

export type TRejectedRule = {
  name: string,
  selector?: TFieldSelector,
  isCustom?: boolean
};

/**
 * Creates a rejected rule with the standardized shape.
 */
export default function createRejectedRule({
  name,
  selector,
  isCustom = false
}: TCreateRejectedRuleArgs): TRejectedRule {
  return {
    name,
    selector,
    isCustom
  };
}
