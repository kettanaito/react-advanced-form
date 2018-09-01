import * as R from 'ramda'
import flushFieldRefs from '../flushFieldRefs'
import findRulesInSchema from '../formUtils/findRulesInSchema'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'

/**
 * Appends the "Field.props.rule" resolver function to the provided
 * rule groups in case the resolver is a reactive function.
 * @param {Map} ruleGroups
 * @param {Map} fieldProps
 * @param {Object} resolverArgs
 * @returns {Map}
 */
function addFieldPropsRule(ruleGroups, fieldProps, resolverArgs) {
  const { rule: resolver } = fieldProps

  if (typeof resolver !== 'function') {
    return ruleGroups
  }

  const { refs } = flushFieldRefs(resolver, resolverArgs)

  return R.assoc(
    'rule',
    [
      {
        refs,
        resolver,
      },
    ],
    ruleGroups,
  )
}

/**
 * Creates an observable for each validation rule which references
 * other fields' props. Flattens deep the validation schema, finding
 * the rules relevant to the currently registering field, and creates
 * observables for those rules which reference another fields.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {Object} form
 * @returns {Map}
 */
export default function createRulesSubscriptions({ fieldProps, fields, form }) {
  const {
    formRules,
    state: { applicableRules },
  } = form

  const resolverArgs = createRuleResolverArgs({
    fieldProps,
    fields,
    form,
  })

  /**
   * Get the collection of reactive rules from the form
   * validation schema relative to the registered field.
   */
  const schemaRuleGroups = findRulesInSchema({
    fieldProps,
    applicableRules: formRules,
    transformRule: (rule) => {
      const { resolver } = rule
      const { refs } = flushFieldRefs(resolver, resolverArgs)

      if (refs.length > 0) {
        /**
         * Create observable for a rule that references another field(s).
         * The observable will listen for the referenced props change and re-evaluate
         * the validation rule(s) in which that prop is referenced.
         */
        makeObservable(resolver, resolverArgs, {
          subscribe() {
            const currentFieldProps = R.path(fieldProps.fieldPath, form.state.fields)

            form.eventEmitter.emit('validateField', {
              /**
               * Cannot hard-code "true" because that would validate
               * empty optional fields as unexpected.
               */
              force: !!recordUtils.getValue(currentFieldProps),
              fieldProps: currentFieldProps,
            })
          },
        })
      }

      return {
        ...rule,
        refs,
      }
    },
  })

  console.log({ schemaRuleGroups })

  /* Add "Field.props.rule" in case the latter has fields references */
  const ruleGroups = addFieldPropsRule(schemaRuleGroups, fieldProps, resolverArgs)

  return R.mergeDeepLeft(applicableRules, ruleGroups)
}
