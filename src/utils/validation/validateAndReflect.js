import { when } from 'ramda'
import validate from '.'
import * as recordUtils from '../recordUtils'

export default function validateAndReflect(args) {
  console.groupCollapsed('compositeValidate', args.fieldProps.name)
  console.log({ args })

  const validationResult = validate(args)
  const hasResult = () => !!validationResult

  console.log({ validationResult })

  const nextFieldRecord = when(hasResult, () =>
    recordUtils.reflectValidation({ ...args, validationResult }),
  )(args.fieldProps)

  console.warn('nextFieldRecord:', nextFieldRecord && nextFieldRecord.toJS())
  console.groupEnd()

  return nextFieldRecord
}
