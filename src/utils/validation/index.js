import * as R from 'ramda'
import { reduceWhileExpected } from '../reduceWhile'
import createRuleResolverArgs from './createRuleResolverArgs'
import validateSync from './validateSync'
import validateAsync from './validateAsync'
import filterSchemaByField from '../formUtils/filterSchemaByField'
import stitchWith from '../stitchWith'
import getRulesRefs from '../formUtils/getRulesRefs'

const defaultValidatorsList = [validateSync, validateAsync]

/**
 * Performs validation of the given field with the given parameters.
 * Returns the validation result.
 */
export default async function validate(args) {
  const { force, chain, fieldProps, form } = args
  const resolverArgs = createRuleResolverArgs(args)

  /**
   * Get the list of relevant rules for the validated field.
   */
  const relevantRules = R.compose(
    getRulesRefs(resolverArgs),
    filterSchemaByField(form.state.rules),
  )(fieldProps)

  /**
   * Stitch the list of relevant rules into a Map
   * where each "keyPath" of the rule is associated with the rule.
   * @example
   * [{ keyPath: ['type', 'email'], resolver: f() }]
   * // { type: { email: [{ keyPath: ['type', 'email'], resolver: f() }] }}
   */
  const stitchedRules = stitchWith(
    R.prop('keyPath'),
    (entry, keyPath, acc) => R.append(entry, R.pathOr([], keyPath, acc)),
    relevantRules,
  )

  const validatorsList = chain || defaultValidatorsList

  return reduceWhileExpected(validatorsList)(resolverArgs, stitchedRules, force)
}
