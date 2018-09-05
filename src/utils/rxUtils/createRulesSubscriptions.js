import * as R from 'ramda'
import flushFieldRefs from '../flushFieldRefs'
import findRulesInSchema from '../formUtils/findRulesInSchema'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'
import getLeavesWhich from '../getLeaves'

/**
 * Appends the "Field.props.rule" resolver function to the provided
 * rule groups in case the resolver is a reactive function.
 * @param {Object} ruleGroups
 * @param {Object} fieldProps
 * @param {Object} resolverArgs
 * @returns {Object}
 */
const addFieldPropsRule = (ruleGroups, fieldProps, resolverArgs) => {
  const { rule: resolver } = fieldProps

  if (typeof resolver !== 'function') {
    return ruleGroups
  }

  const { refs } = flushFieldRefs(resolver, resolverArgs)

  console.log({ ruleGroups })
  console.log('flushed refs:', refs)

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
 * @param {Object} fieldProps
 * @param {Object} fields
 * @param {Object} form
 * @returns {Object}
 */
export default function createRulesSubscriptions({ fieldProps, fields, form }) {
  const {
    validationSchema,
    state: { applicableRules },
  } = form

  const resolverArgs = createRuleResolverArgs({
    fieldProps,
    fields,
    form,
  })

  /* Add "Field.props.rule" in case the latter has fields references */
  // const nextValidationSchema = addFieldPropsRule(
  //   validationSchema,
  //   fieldProps,
  //   resolverArgs,
  // )
  const nextValidationSchema = R.assocPath(
    ['fieldProps', 'rule'],
    {
      resolver: fieldProps.rule,
    },
    validationSchema,
  )

  //
  // TODO
  // Maybe consider handling these rules as arrays of rule objects.
  // And then write a custom mergin function that would do
  // R.assocPath(rule.keyPath, rule, {})
  // and return a deep object with rules to store in the state.
  //

  /**
   * Get the collection of reactive rules from the form
   * validation schema relative to the registered field.
   */
  const schemaRuleGroups = findRulesInSchema({
    fieldProps,
    validationSchema: nextValidationSchema,
    transformRule: (rule, rulePath) => {
      console.log('transform rule')
      console.log({ rule })
      console.log({ rulePath })

      /* Omit any transformations for a rule that is already present in the applicable rules */
      if (R.path(rulePath, applicableRules)) {
        return rule
      }

      const { resolver } = rule
      const { refs } = flushFieldRefs(resolver, resolverArgs)

      if (refs.length > 0) {
        console.warn('should create observable for', refs)
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
  console.log('rules leaves:', getLeavesWhich(R.has('selector'), schemaRuleGroups))

  return R.mergeDeepRight(applicableRules, schemaRuleGroups)
}
