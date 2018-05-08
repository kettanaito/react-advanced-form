import PropTypes from 'prop-types'
import { CustomPropTypes, fieldUtils } from '../utils'

export default function Condition(props, context) {
  const { fields } = context
  const { children, when } = props

  /* Resolve the condition in order to render the children */
  const extendedFields = fieldUtils.serializeFields(fields, (fieldProps) => fieldProps)
  const satisfied = when({ fields: extendedFields.toJS() })

  return satisfied ? children : null
}

Condition.propTypes = {
  when: PropTypes.func.isRequired,
}

Condition.contextTypes = {
  fields: CustomPropTypes.Map.isRequired,
}
