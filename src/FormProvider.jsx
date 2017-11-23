/**
 * Form provider.
 * The provider allows to pass global props to all Form instances
 * in order to declare default behaviors on the top level scope.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const TValidationRules = PropTypes.shape({
  type: PropTypes.object, // type-specific field validation rules
  name: PropTypes.object // name-specific field validation rules
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
