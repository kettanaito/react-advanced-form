import PropTypes from 'prop-types'
import { CustomPropTypes, fieldUtils } from '../utils'

export default function Condition(props, context) {
    const { fields, form } = context
    const { children, when } = props

    /* Resolve the condition in order to render the children */
    const operableFields = fieldUtils.serializeFields(fields, form.context.withImmutable)
    const shouldRenderChildren = when({ fields: operableFields })

    return shouldRenderChildren ? children : null
}

Condition.propTypes = {
    when: PropTypes.func.isRequired
}

Condition.contextTypes = {
    fields: CustomPropTypes.Map.isRequired,
    form: PropTypes.object.isRequired,
}
