import camelize from '../../camelize'
import * as recordUtils from '../../recordUtils'
import getMessages from '../messages/getMessages'

export default function reflectValidationResult(resolverArgs, shouldValidate) {
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

    return recordUtils.setErrors(
      recordUtils.updateValidityState(
        fieldProps
          .merge(validationProps)
          .set('validated', true)
          .set('expected', expected),
        shouldValidate,
      ),
      errorMessages,
    )
  }
}
