import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'

export default function handleFieldFocus({ event, fieldProps }, fields, form) {
  const nextFieldProps = recordUtils.setFocus(true, fieldProps)
  const nextFields = recordUtils.updateCollectionWith(nextFieldProps, fields)

  dispatch(
    fieldProps.onFocus,
    {
      event,
      fieldProps: nextFieldProps,
      fields: nextFields,
      form,
    },
    form.context,
  )

  return {
    nextFieldProps,
    nextFields
  }
}
