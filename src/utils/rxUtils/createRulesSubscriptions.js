import * as R from 'ramda'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'

import filterSchemaByField from '../formUtils/filterSchemaByField'
import getRulesRefs from '../formUtils/getRulesRefs'
import stitchWith from '../stitchWith'
import flushFieldRefs from '../flushFieldRefs'

const shouldObserve = R.allPass([R.complement(R.isNil), R.is(Function)])

const createRuleObservable = R.curry((resolverArgs, ruleRecord) => {
  const { fieldProps, form } = resolverArgs
  const { refs, resolver } = ruleRecord

  if (refs.length > 0) {
    /**
     * Create observable for a rule that references another field(s).
     * The observable will listen for the referenced props change and re-evaluate
     * the validation rule(s) in which that prop is referenced.
     */
    makeObservable(resolver, resolverArgs, {
      /**
       * @todo This is a slight overhead, since "makeObservable" will also flush
       * the passed function field references. Since here it's done from the higher
       * scope, it should be considered to simply this logic, or remove refs flushing
       * from the schema.
       */
      subscribe() {
        const futureFieldProps = R.path(fieldProps.fieldPath, form.state.fields)

        form.eventEmitter.emit('validateField', {
          /**
           * Cannot hard-code "true" because that would validate
           * empty optional fields as unexpected.
           */
          force: !!recordUtils.getValue(futureFieldProps),
          fieldProps: futureFieldProps,
        })
      },
    })
  }
})

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

  const fieldRules = R.compose(
    getRulesRefs(resolverArgs),
    filterSchemaByField(validationSchema),
  )(fieldProps)

  fieldRules.forEach(createRuleObservable(resolverArgs))

  /* Add "Field.props.rule" in case the latter has fields references */
  const { rule } = fieldProps

  if (shouldObserve(rule)) {
    createRuleObservable(resolverArgs, {
      refs: flushFieldRefs(rule, resolverArgs).refs,
      resolver: rule,
    })
  }

  /* Stitch the list of field-related rules into an object */
  const stitchedRules = stitchWith(
    (entry, keyPath, acc) => R.append(entry, R.pathOr([], keyPath, acc)),
    ['keyPath'],
    fieldRules,
  )

  /* Merge field-related rules with the applicable rules */
  return R.mergeDeepRight(applicableRules, stitchedRules)
}
