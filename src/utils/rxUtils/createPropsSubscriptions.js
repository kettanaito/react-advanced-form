import * as R from 'ramda'
import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'

/**
 * Creates Observable for the reactive props of the given field.
 * @param {Object} fieldProps
 * @param {Object} fields
 * @param {Object} form
 */
export default function createPropsSubscriptions({ fieldProps, fields, form }) {
  const { reactiveProps } = fieldProps

  if (!reactiveProps) {
    return
  }

  const { fieldPath: subscriberFieldPath } = fieldProps
  const resolverArgs = createRuleResolverArgs({ fieldProps, fields, form })

  Object.keys(reactiveProps).forEach((propName) => {
    const resolver = reactiveProps[propName]

    makeObservable(resolver, resolverArgs, {
      initialCall: true,
      subscribe({ nextTargetRecord, shouldValidate = true }) {
        const { fields } = form.state
        const { fieldPath: targetFieldPath } = nextTargetRecord
        const prevSubscriberState = R.path(subscriberFieldPath, fields)

        const nextFields = R.assocPath(
          targetFieldPath,
          nextTargetRecord,
          fields,
        )

        const nextResolverArgs = createRuleResolverArgs({
          fieldProps,
          fields: nextFields,
          form,
        })

        /**
         * Get the next reactive prop value by invoking the same resolver
         * with the updated arguments.
         */
        const nextPropValue = dispatch(resolver, nextResolverArgs)
        const nextSubscriberStatePatch = R.compose(
          /**
           * Reset validity and validation state on a reactive field
           * so it triggers validation regardless of its previous validity state.
           */
          recordUtils.resetValidityState,
          recordUtils.resetValidationState,
          R.assoc(propName, nextPropValue),
        )({})

        const nextSubscriberState = R.mergeDeepLeft(
          nextSubscriberStatePatch,
          prevSubscriberState,
        )

        if (shouldValidate) {
          /**
           * Dispatch field validation in parallel with reactive prop update
           * because due to patched nature of updates, the next field state chunks
           * produces by these two actions do not intersect, and can be merged
           * simultaneously.
           */
          form.validateField({
            /**
             * Forcing validation that originates from reactive subscription
             * shouldn't be forced if a field's validity and validation state are reset,
             * and the reset field state is being validated.
             * @see https://github.com/kettanaito/react-advanced-form/issues/344
             */
            // force: true,
            fieldProps: nextSubscriberState,
            form,
          })
        }

        form.eventEmitter.emit(
          'applyStatePatch',
          subscriberFieldPath,
          nextSubscriberStatePatch,
        )
      },
    })
  })
}
