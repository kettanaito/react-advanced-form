import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import validateField from './validateField'

export default function handleFieldBlur({ event, fieldProps }, fields, form) {
  const updatedFieldProps = recordUtils.beginValidation(
    recordUtils.setFocus(fieldProps, false),
  )

  const validatedField = validateField({
    fieldProps: updatedFieldProps,
    fields,
    form,
  })

  const nextFieldProps = recordUtils.endValidation(validatedField)
  const nextFields = recordUtils.updateCollectionWith(nextFieldProps, fields)

  const { onBlur } = fieldProps
  if (onBlur) {
    dispatch(
      onBlur,
      {
        event,
        fieldProps: nextFieldProps,
        fields: nextFields,
        form,
      },
      form.context,
    )
  }

  console.groupCollapsed(`handleFieldBlur @ ${fieldProps.displayFieldPath}`)
  console.log('-> fieldProps', fieldProps.toJS())
  console.log('<- fieldProps:', nextFieldProps.toJS())
  console.groupEnd()

  return { nextFieldProps, nextFields }
}
