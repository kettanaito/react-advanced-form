import PropTypes from 'prop-types'
import { fieldUtils } from '../utils'

export default function Condition(props, context) {
  const { fields, form } = context
  const { children, when } = props

  /* Resolve the condition in order to render the children */
  const serializedFields = fieldUtils.serializeFields(fields)
  const shouldRenderChildren = when({ fields: serializedFields, form })

  return shouldRenderChildren ? children : null
}

Condition.propTypes = {
  when: PropTypes.func.isRequired,
}

Condition.contextTypes = {
  fields: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
}
