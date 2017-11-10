/**
 * Form provider.
 * This provider allows to pass global props to all Form instances
 * in order to declare default behaviors on the top level scope.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const TValidationRules = PropTypes.shape({
  type: PropTypes.object,
  name: PropTypes.object
});

export default class FormProvider extends Component {
  static propTypes = {
    rules: TValidationRules
  }

  static childContextTypes = {
    rules: TValidationRules
  }

  getChildContext() {
    return {
      rules: this.props.rules
    };
  }

  render() {
    return this.props.children;
  }
}
