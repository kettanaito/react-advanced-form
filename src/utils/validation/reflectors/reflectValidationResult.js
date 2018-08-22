import compose from 'ramda/src/compose'
import camelize from '../../camelize'
import * as recordUtils from '../../recordUtils'
import getMessages from '../messages/getMessages'

export default function reflectValidationResult(
  resolverArgs,
  shouldValidate = true,
) {
  return (validationResult) => {
    const {
      fieldProps,
      form: { messages },
    } = resolverArgs

    const { validators, expected } = validationResult
    const errorMessages = getMessages(validationResult, resolverArgs, messages)

    const validationProps = validators.reduce((props, validatorFuncName) => {
      const validPropName = camelize('valid', validatorFuncName)
      const validatedPropName = camelize('validated', validatorFuncName)

      return {
        ...props,
        [validatedPropName]: true,
        [validPropName]: expected,
      }
    }, {})

    const nextFieldProps = compose(
      recordUtils.setErrors(errorMessages),
      recordUtils.updateValidityState(shouldValidate),
      (fieldProps) =>
        fieldProps
          .merge(validationProps)
          .set('validated', true)
          .set('expected', expected),
    )(fieldProps)

    return nextFieldProps
  }
}
