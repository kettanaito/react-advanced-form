import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'

export default function handleFieldFocus({ event, fieldProps }, fields, form) {
  const nextFieldProps = recordUtils.setFocus(fieldProps)
  const nextFields = recordUtils.updateCollectionWith(nextFieldProps, fields)

  const { onFocus } = fieldProps
  if (onFocus) {
    dispatch(
      onFocus,
      {
        event,
        fieldProps: nextFieldProps,
        fields: nextFields,
        form,
      },
      form.context,
    )
  }

  console.groupCollapsed(`handleFieldFocus @ ${fieldProps.displayFieldPath}`)
  console.log('-> fieldProps:', fieldProps.toJS())
  console.log('<- fieldProps:', nextFieldProps.toJS())
  console.groupEnd()

  return { nextFieldProps, nextFields }
}
