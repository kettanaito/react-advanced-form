import dispatch from '../dispatch'
import createRuleResolverArgs from '../validation/createRuleResolverArgs'
import makeObservable from './makeObservable'

/**
 * @param {Record} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function createSubscriptions({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps')
  if (!rxProps) {
    return
  }

  const { fieldPath: subscriberFieldPath } = fieldProps
  const resolverArgs = createRuleResolverArgs({ fieldProps, fields, form })

  Object.keys(rxProps).forEach((rxPropName) => {
    const resolver = rxProps[rxPropName]

    console.log({ rxPropName })
    console.log({ resolver })

    makeObservable(resolver, resolverArgs, {
      initialCall: true,
      subscribe({ nextContextProps, shouldValidate = true }) {
        const { fields } = form.state
        const { fieldPath: refFieldPath } = nextContextProps
        const nextFieldProps = fields.getIn(subscriberFieldPath)
        const nextFields = fields.set(refFieldPath, nextContextProps)
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

        console.warn(
          'Should update `%s` of `%s` to `%s`',
          rxPropName,
          subscriberFieldPath.join('.'),
          nextPropValue,
        )
        console.log('shouldValidate?', shouldValidate)

        /* Set the next value of reactive prop on the respective field record */
        const updatedFieldProps = nextFieldProps.set(rxPropName, nextPropValue)
        const updatedFields = nextFields.setIn(
          subscriberFieldPath,
          updatedFieldProps,
        )

        console.log(
          'updatedFieldProps',
          updatedFieldProps && updatedFieldProps.toJS(),
        )

        if (shouldValidate) {
          return form.validateField({
            force: true,
            forceProps: true,
            fieldProps: updatedFieldProps
              .set('valid', false)
              .set('invalid', false),
            fields: updatedFields,
            form,
          })
        }

        return form.updateFieldsWith(updatedFieldProps)
      },
    })
  })
}
