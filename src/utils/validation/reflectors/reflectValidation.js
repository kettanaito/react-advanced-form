import camelize from '../../camelize'
import * as recordUtils from '../../recordUtils'
import getMessages from '../messages/getMessages'

export default function reflectValidation(
  resolverArgs,
  validationResult,
  shouldValidate,
) {
  console.log('resolverArgs', resolverArgs)
  console.log('validationResult', validationResult)

  const { fieldProps, form } = resolverArgs
  const { validators, expected } = validationResult
  const errorMessages = getMessages(
    validationResult,
    resolverArgs,
    form.messages,
  )

  console.log('errorMessages', errorMessages)

  const validationProps = validators.reduce((props, validatorName) => {
    const validPropName = camelize('valid', validatorName)
    const validatedPropName = camelize('validated', validatorName)
    return Object.assign({}, props, {
      [validatedPropName]: true,
      [validPropName]: expected,
    })
  }, {})

  const validatedField = fieldProps
    .set('validated', true)
    .set('expected', expected)
    .merge(validationProps)

  return recordUtils.setErrors(
    recordUtils.updateValidityState(validatedField, shouldValidate),
    errorMessages,
  )
}
