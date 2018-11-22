/**
 * Field group.
 * A component to separate form's data structure on the render level.
 * Wrapping fields in the group makes them available in the form's state
 * as "fieldGroup.fieldName". This also applies for serialization.
 */
import React from 'react'
import PropTypes from 'prop-types'

export default class Group extends React.Component {
  static displayName = 'Field.Group'

  static propTypes = {
    name: PropTypes.string.isRequired,
    exact: PropTypes.bool,
  }

  static contextTypes = {
    fieldGroup: PropTypes.arrayOf(PropTypes.string),
  }

  static childContextTypes = {
    fieldGroup: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  getChildContext() {
    const { name, exact } = this.props
    const parentGroupName = this.context.fieldGroup || []

    return {
      fieldGroup: exact ? [name] : parentGroupName.concat(name),
    }
  }

  render() {
    return this.props.children
  }
}
