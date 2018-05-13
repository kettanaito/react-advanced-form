import when from 'ramda/src/when'
import validate from '.'
import * as recordUtils from '../recordUtils'

/**
 * Composite function that performs the requested validation and
 * reflects its results on the given field record. In case no
 * validation has occurred, field record is returned as is.
 */
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
