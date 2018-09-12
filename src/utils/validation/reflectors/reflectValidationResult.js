import * as R from 'ramda'
import camelize from '../../camelize'
import * as recordUtils from '../../recordUtils'
import getMessages from '../messages/getMessages'

export default function reflectValidationResult(resolverArgs, shouldValidate = true) {
  return (validationResult) => {
    const {
      fieldProps,
      form: { messages },
    } = resolverArgs

    const { validators, expected } = validationResult
    const errorMessages = getMessages(validationResult, resolverArgs, messages)

    const validationProps = validators.reduce((props, validatorName) => {
      const validPropName = camelize('valid', validatorName)
      const validatedPropName = camelize('validated', validatorName)

      return {
        ...props,
        [validatedPropName]: true,
        [validPropName]: expected,
      }
    }, {})

    const updateFieldProps = R.compose(
      recordUtils.setErrors(errorMessages),
      recordUtils.updateValidityState(shouldValidate),
      R.compose(
        R.assoc('expected', expected),
        R.assoc('validated', true),
        R.mergeDeepLeft(validationProps),
      ),
    )

    return updateFieldProps(fieldProps)
  }
}
