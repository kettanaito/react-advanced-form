/**
 * Form provider.
 * The provider allows to pass global props to all Form instances
 * in order to declare default behaviors on the top level scope.
 */
import React from 'react'
import PropTypes from 'prop-types'

export const defaultDebounceTime = 250

export const ValidationRulesPropType = PropTypes.shape({
  type: PropTypes.object,
  name: PropTypes.object,
})

export const ValidationMessagesPropType = PropTypes.shape({
  general: PropTypes.object,
  type: PropTypes.object,
  name: PropTypes.object,
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

    if (this.props.hasOwnProperty('withImmutable')) {
      console.warn(
        'FormProvider: `withImmutable` prop has been deprecated. Please remove it and treat exposed library instances as plain JavaScript data types. See more details: https://goo.gl/h5YUiS',
      )
    }

    return {
      rules,
      messages,
      debounceTime,
    }
  }

  render() {
    return this.props.children
  }
}
