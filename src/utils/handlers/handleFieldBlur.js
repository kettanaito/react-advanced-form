import * as R from 'ramda'
import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import validateField from './validateField'

export default async function handleFieldBlur(
  { event, fieldProps },
  fields,
  form,
) {
  const updatedFieldProps = R.compose(
    recordUtils.setTouched(true),
    recordUtils.setFocus(false),
  )(fieldProps)

  const validatedFieldProps = await validateField({
    fieldProps: updatedFieldProps,
    fields,
    form,
  })

  const nextFields = recordUtils.updateCollectionWith(
    validatedFieldProps,
    fields,
  )

  dispatch(fieldProps.onBlur, {
    event,
    fieldProps: validatedFieldProps,
    fields: nextFields,
    form,
  })

  return {
    nextFieldProps: validatedFieldProps,
    nextFields,
  }
}
