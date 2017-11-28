import React from 'react';
import PropTypes from 'prop-types';
import { IterableInstance } from './utils';

export default class Condition extends React.Component {
  static propTypes = {
    when: PropTypes.func.isRequired
  }

  static contextTypes = {
    fields: IterableInstance
  }

  render() {
    const { fields } = this.context;
    const { children, when } = this.props;

    /* Resolve the condition in order to render the children */
    const resolved = when({ fields: fields.toJS() });

    return resolved ? children : null;
  }
}
