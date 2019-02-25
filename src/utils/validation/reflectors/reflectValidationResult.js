import * as R from 'ramda'
import camelize from '../../camelize'
import * as recordUtils from '../../recordUtils'
import getMessages from '../messages/getMessages'

export default function reflectValidationResult(payload) {
  return (validationResult) => {
    const {
      fieldProps: fieldState,
      form: { messages },
    } = payload

    const { validators, expected } = validationResult
    const errors = getMessages(validationResult, payload, messages)

    const nextStatePatch = R.compose(
      recordUtils.updateValidityState(fieldState),
      R.ifElse(
        R.propEq('expected', true),
        recordUtils.setErrors(undefined),
        recordUtils.setErrors(errors),
      ),
      R.reduce(
        (acc, validatorName) => ({
          ...acc,
          [camelize('validated', validatorName)]: true,
          [camelize('valid', validatorName)]: expected,
        }),
        {
          expected,
          errors: null,
          validated: true,
        },
      ),
    )(validators)

    return nextStatePatch
  }
}
