import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'

/**
 * Creates Observable for the reactive props of the given field.
 * @param {Record} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function createPropsSubscriptions({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps')
  if (!rxProps) {
    return
  }

  const { fieldPath: subscriberFieldPath } = fieldProps
  const resolverArgs = createRuleResolverArgs({ fieldProps, fields, form })

  Object.keys(rxProps).forEach((rxPropName) => {
    const resolver = rxProps[rxPropName]

    makeObservable(resolver, resolverArgs, {
      initialCall: true,
      subscribe({ nextTargetRecord, shouldValidate = true }) {
        const { fields } = form.state
        const { fieldPath: targetFieldPath } = nextTargetRecord

        const currentSubscriberRecord = fields.getIn(subscriberFieldPath)
        const nextFields = fields.set(targetFieldPath, nextTargetRecord)

        const nextResolverArgs = createRuleResolverArgs({
          fieldProps,
          fields: nextFields,
          form,
        })

        /**
         * Get the next reactive prop value by invoking the same resolver
         * with the updated arguments.
         */
        const nextPropValue = dispatch(resolver, nextResolverArgs, form.context)

        /* Set the next value of reactive prop on the respective field record */
        const nextSubscriberRecord = recordUtils.resetValidityState(
          currentSubscriberRecord.set(rxPropName, nextPropValue),
        )

        const updatedFields = nextFields.setIn(
          subscriberFieldPath,
          nextSubscriberRecord,
        )

        if (shouldValidate) {
          return form.validateField({
            force: true,
            forceProps: true,
            fieldProps: nextSubscriberRecord,
            fields: updatedFields,
            form,
          })
        }

        return form.updateFieldsWith(nextSubscriberRecord)
      },
    })
  })
}
