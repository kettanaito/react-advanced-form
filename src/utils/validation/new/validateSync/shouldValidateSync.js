import getFieldRules from '../getFieldRules'

/**
 * Determines the necessity of the synchronous validation
 * of the given arguments.
 */
export default function shoulValidateSync(args) {
  console.groupCollapsed(
    'validateSync @ shoulValidateSync',
    args.fieldProps.name,
  )

  console.log({ args })

  const { fieldProps, form } = args

  console.log('is alredy valid sync?')

  if (fieldProps.validSync) {
    console.log('yes, bypass...')
    console.groupEnd()
    return false
  }

  console.log('no, continue...')

  const { rxRules } = form.state
  const fieldRules = getFieldRules(fieldProps, rxRules)

  const res =
    !!fieldProps.rule ||
    !!fieldRules.type ||
    !!fieldRules.name ||
    fieldProps.required

  console.warn('should validate?', res)
  console.groupEnd()

  return res
}
