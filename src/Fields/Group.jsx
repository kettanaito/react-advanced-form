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
