// @flow

export type TRuleSelector = 'type' | 'name'
export type TRuleName = string | void

type TCreateRejectedRuleArgs = {
  errorType: string,
  selector: TRuleSelector,
  ruleName: TRuleName,
}

export type TRejectedRule = {
  errorType: string,
  selector: TRuleSelector,
  ruleName: TRuleName,
}

/**
 * Creates a rejected rule with the standardized shape.
 */
export default function createRejectedRule({
  errorType,
  selector,
  ruleName,
}: TCreateRejectedRuleArgs) {
  return {
    errorType,
    selector,
    ruleName,
  }
}
