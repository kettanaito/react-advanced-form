import * as R from 'ramda'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'

import filterSchemaByField from '../formUtils/filterSchemaByField'
import getRulesRefs from '../formUtils/getRulesRefs'
import stitchBy from '../stitchBy'

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
  // TODO this

  const fieldRules = filterSchemaByField(fieldProps, validationSchema)
  const nextFieldRules = getRulesRefs(resolverArgs, fieldRules)

  nextFieldRules.forEach((rule) => {
    const { refs, resolver } = rule

    if (refs.length > 0) {
      console.warn('should create observable for', refs)

      /**
       * Create observable for a rule that references another field(s).
       * The observable will listen for the referenced props change and re-evaluate
       * the validation rule(s) in which that prop is referenced.
       */
      makeObservable(resolver, resolverArgs, {
        subscribe() {
          const futureFieldProps = R.path(
            fieldProps.fieldPath,
            form.state.fields,
          )

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

  const stitchedRules = stitchBy(['keyPath'], nextFieldRules)
  console.log('stitched:', stitchedRules)

  return R.mergeDeepRight(applicableRules, stitchedRules)
}
