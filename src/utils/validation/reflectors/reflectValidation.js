import { Map } from 'immutable'
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
  const { validators, expected, rejectedRules } = validationResult
  const errorMessages = getMessages(
    validationResult,
    resolverArgs,
    form.messages,
  )

  console.log('errorMessages', errorMessages)

  const validationProps = validators.reduce((props, validatorName) => {
    const validPropName = camelize('valid', validatorName)
    const validatedPropName = camelize('validated', validatorName)
    return props.set(validPropName, expected).set(validatedPropName, true)
  }, Map())

  const validatedField = fieldProps
    .set('validated', true)
    .set('expected', expected)
    .merge(validationProps)

  const f = recordUtils.updateValidityState(validatedField, shouldValidate)
  const n = recordUtils.setErrors(f, errorMessages)

  return n
}
