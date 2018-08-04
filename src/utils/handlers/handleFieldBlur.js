import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import validateField from './validateField'

export default async function handleFieldBlur(
  { event, fieldProps },
  fields,
  form,
) {
  // TODO Intermediate update support.
  // Unclear how to reflect the validation start with the "shouldValidate"
  // logic being called deeply within the validation algorithm.
  const updatedFieldProps = recordUtils.setFocus(fieldProps, false)

  const nextFieldProps = await validateField({
    __SOURCE__: 'fieldBlur',
    fieldProps: updatedFieldProps,
    fields,
    form,
  })

  // const nextFieldProps = recordUtils.endValidation(validatedFieldProps)
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

  return { nextFieldProps, nextFields }
}
