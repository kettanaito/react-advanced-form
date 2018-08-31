import path from 'ramda/src/path'
import values from 'ramda/src/values'
import assoc from 'ramda/src/assoc'
import mergeDeepLeft from 'ramda/src/mergeDeepLeft'

import flushFieldRefs from '../flushFieldRefs'
import getFieldRules from '../formUtils/getFieldRules'
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

  return assoc(
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
  const { validationSchema } = form.state

  const resolverArgs = createRuleResolverArgs({
    fieldProps,
    fields,
    form,
  })

  /**
   * Get the collection of reactive rules from the form
   * validation schema relative to the registered field.
   */
  const schemaRuleGroups = getFieldRules({
    fieldProps,
    schema: form.formRules,
    validationSchema,
    transformRule(ruleParams) {
      const { refs } = flushFieldRefs(ruleParams.resolver, resolverArgs)

      return {
        ...ruleParams,
        refs,
      }
    },
  })

  /* Add "Field.props.rule" in case the latter has field references */
  const ruleGroups = addFieldPropsRule(schemaRuleGroups, fieldProps, resolverArgs)

  if (Object.keys(ruleGroups).length === 0) {
    return validationSchema
  }

  /**
   * Create observable for each rule in which another field(s) is referenced.
   * The observable will listen for the referenced props change and re-evaluate
   * the validation rule(s) in which that prop is referenced.
   */
  values(ruleGroups).forEach((ruleGroup) => {
    ruleGroup.forEach((rule) => {
      const { refs, resolver } = rule

      /**
       * Rule resolver without field references are not reactive,
       * thus there is no need to create an observable for it.
       */
      if (refs.length === 0) {
        return
      }

      makeObservable(resolver, resolverArgs, {
        subscribe() {
          const currentFieldProps = path(fieldProps.fieldPath, form.state.fields)

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
    })
  })

  return mergeDeepLeft(validationSchema, ruleGroups)
}
