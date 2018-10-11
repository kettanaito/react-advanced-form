// @flow
export type TRuleSelector = 'type' | 'name'
export type TRuleName = string | void

export type TRejectedRule = {
  name: TRuleName,
  selector: TRuleSelector,
  errorType: string,
}

type TCreateRejectedRuleArgs = {
  name: TRuleName,
  selector: TRuleSelector,
  errorType: string,
}

/**
 * Creates a rejected rule with the standardized shape.
 */
export default function createRejectedRule({
  name,
  selector,
  errorType,
}: TCreateRejectedRuleArgs) {
  return {
    name,
    selector,
    errorType,
  }
}
