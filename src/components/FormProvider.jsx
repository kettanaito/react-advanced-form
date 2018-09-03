/**
 * Form provider.
 * The provider allows to pass global props to all Form instances
 * in order to declare default behaviors on the top level scope.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'

export const defaultDebounceTime = 250

export const ValidationRulesPropType = PropTypes.shape({
  type: PropTypes.object, // type-specific field validation rules
  name: PropTypes.object, // name-specific field validation rules
})

export const ValidationMessagesPropType = PropTypes.shape({
  general: PropTypes.object, // general validation messages
  type: PropTypes.object, // type-specific validation messages
  name: PropTypes.object, // name-specific validation messages
})

export default class FormProvider extends React.Component {
  static propTypes = {
    rules: ValidationRulesPropType,
    messages: ValidationMessagesPropType,
    debounceTime: PropTypes.number,
  }

  static defaultProps = {
    messages: {},
    debounceTime: defaultDebounceTime,
  }

  static childContextTypes = {
    rules: ValidationRulesPropType,
    messages: ValidationMessagesPropType,
    debounceTime: PropTypes.number,
  }

  getChildContext() {
    const { rules, messages, debounceTime } = this.props

    return {
      rules,
      messages: fromJS(messages),
      debounceTime,
    }
  }

  render() {
    return this.props.children
  }
}
