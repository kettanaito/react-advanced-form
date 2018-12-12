import * as R from 'ramda'
import * as recordUtils from '../recordUtils'
import validateField from './validateField'

export default async function handleFieldBlur({ fieldProps }, fields, form) {
  const updatedFieldProps = R.compose(
    recordUtils.setTouched(true),
    recordUtils.setFocused(false),
  )(fieldProps)

  return validateField({
    fieldProps: updatedFieldProps,
    fields,
    form,
  })
}
