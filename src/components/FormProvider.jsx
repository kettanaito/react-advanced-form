/**
 * Form provider.
 * The provider allows to pass global props to all Form instances
 * in order to declare default behaviors on the top level scope.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

export const TValidationRules = PropTypes.shape({
  type: PropTypes.object, // type-specific field validation rules
  name: PropTypes.object // name-specific field validation rules
});

export const TValidationMessages = PropTypes.shape({
  general: PropTypes.object, // general validation messages
  type: PropTypes.object, // type-specific validation messages
  name: PropTypes.object // name-specific validation messages
});

export default class FormProvider extends React.Component {
  static propTypes = {
    rules: TValidationRules,
    messages: TValidationMessages,
    withImmutable: PropTypes.bool
  }

  static defaultProps = {
    messages: {},
    withImmutable: false
  }

  static childContextTypes = {
    rules: TValidationRules,
    messages: TValidationMessages,
    withImmutable: PropTypes.bool
  }

  getChildContext() {
    return {
      rules: fromJS(this.props.rules),
      messages: fromJS(this.props.messages),
      withImmutable: this.props.withImmutable
    };
  }

  render() {
    return this.props.children;
  }
}
