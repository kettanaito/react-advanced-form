import validate from '.'
import * as recordUtils from '../recordUtils'

export default function validateAndReflect(args) {
  console.groupCollapsed('compositeValidate', args.fieldProps.name)
  console.log({ args })

  const validationResult = validate(args)
  console.log({ validationResult })

  const nextFieldRecord = recordUtils.reflectValidation({
    ...args,
    validationResult,
  })

  console.warn('nextFieldRecord:', nextFieldRecord && nextFieldRecord.toJS())
  console.groupEnd()

  return nextFieldRecord
}
