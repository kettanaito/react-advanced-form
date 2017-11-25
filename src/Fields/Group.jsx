/**
 * Field group.
 * A component to separate form's data structure on the render level. Wrapping fields in the group makes them available
 * in the form's state as "fieldGroup.fieldName". This also applies for serialization. Although nested groups are
 * technically possible, it is not recommended to abuse this feature.
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class Group extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  static childContextTypes = {
    fieldGroup: PropTypes.string.isRequired
  }

  getChildContext() {
    return {
      fieldGroup: this.props.name
    };
  }

  render() {
    return this.props.children;
  }
}
