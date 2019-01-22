import * as R from 'ramda'
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
    const errors = getMessages(validationResult, resolverArgs, messages)

    const validationProps = validators.reduce(
      (props, validatorName) => {
        const validPropName = camelize('valid', validatorName)
        const validatedPropName = camelize('validated', validatorName)

        return {
          ...props,
          [validatedPropName]: true,
          [validPropName]: expected,
        }
      },
      {
        expected,
        validated: true,
      },
    )

    /**
     * @todo This intermediate state patch is annoying to construct.
     */
    const tempStatePatch = R.compose(
      recordUtils.setErrors(errors),
      R.mergeDeepLeft(validationProps),
    )({})

    const nextFieldState = R.mergeDeepLeft(tempStatePatch, fieldProps)

    /**
     * @todo Better way get next validity state?
     * It requires "value" prop, which is outside of the scope
     * of the validation state chunk.
     */
    const nextValidityState = recordUtils.updateValidityState(
      shouldValidate,
      nextFieldState,
      {},
    )

    const nextStateChunk = {
      ...tempStatePatch,
      ...nextValidityState,
    }

    // const createUpdateChunk = R.compose(
    //   // update validity state computes return value based on "fieldProps.expected"
    //   // and value. "fieldProps" doesn't have "expected" prop updated yet, as it's
    //   // in the same composition below.
    //   recordUtils.updateValidityState(shouldValidate, fieldProps),
    //   R.compose(
    //     R.assoc('expected', expected),
    //     R.assoc('validated', true),
    //     R.mergeDeepLeft(validationProps),
    //   ),
    // )

    return nextStateChunk
  }
}
