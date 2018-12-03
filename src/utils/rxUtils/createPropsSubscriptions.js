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

        /* Set the next value of reactive prop on the respective field record */
        const nextSubscriberState = R.compose(
          recordUtils.resetValidityState,
          recordUtils.resetValidationState,
          R.assoc(propName, nextPropValue),
        )(prevSubscriberState)

        const fieldsWithSubscriber = R.assocPath(
          subscriberFieldPath,
          nextSubscriberState,
          nextFields,
        )

        if (shouldValidate) {
          return form.validateField({
            /**
             * Forcing validation that originates from reactive subscription
             * shouldn't be force if a field's validity and validation state are reset,
             * and the reset field state is being validated.
             * @see https://github.com/kettanaito/react-advanced-form/issues/344
             */
            // force: true,
            forceProps: true,
            fieldProps: nextSubscriberState,
            fields: fieldsWithSubscriber,
            form,
          })
        }

        return form.updateFieldsWith(nextSubscriberState)
      },
    })
  })
}
