import dispatch from '../dispatch'
import createResolverArgs from '../validation/createResolverArgs'
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
  const resolverArgs = createResolverArgs({ fieldProps, fields, form })

  Object.keys(rxProps).forEach((rxPropName) => {
    const resolver = rxProps[rxPropName]

    console.log({ rxPropName })
    console.log({ resolver })

    makeObservable(resolver, resolverArgs, {
      initialCall: true,
      subscribe({ nextContextProps, shouldValidate = true }) {
        const { fieldPath: refFieldPath } = nextContextProps
        const nextFields = form.state.fields.set(refFieldPath, nextContextProps)
        const nextResolverArgs = createResolverArgs({
          fieldProps,
          fields: nextFields,
          form,
        })

        /* Get the next reactive prop value by invoking the same resolver with the next args */
        const nextPropValue = dispatch(resolver, nextResolverArgs, form.context)

        console.warn(
          'Should update `%s` of `%s` to `%s',
          rxPropName,
          subscriberFieldPath.join('.'),
          nextPropValue,
        )

        // const fieldUpdated = form.updateField({
        //   fieldPath: subscriberFieldPath,
        //   update: fieldProps => fieldProps.set(rxPropName, nextPropValue)
        // });

        /* Set the next value of reactive prop on the respective field record */
        // const nextFieldProps = fieldProps.set(rxPropName, nextPropValue)

        if (shouldValidate) {
          //
          // TODO
          // Validate the field when its reactive prop changes.
          //
          // return form.validateField({
          //   chain: (validators) => [validators.sync, types.async],
          //   force: true,
          //   fieldProps: nextFieldProps,
          //   fields: nextFields,
          //   form,
          // })
          // form.validateField({
          //   force: true, // TODO This must force validation even if "shouldValidate" rejects
          //   fieldPath: subscriberFieldPath,
          //   fieldProps: nextFieldProps,
          //   forceProps: true,
          //   fields: nextFields
          // });
        }

        // return form.updateFieldsWith(nextFieldProps)
      },
    })
  })
}
