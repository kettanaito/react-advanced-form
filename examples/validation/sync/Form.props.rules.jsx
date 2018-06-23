import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

export const fieldSelector = '[name="fieldOne"]'

const rules = {
  type: {
    text: ({ value }) => {
      console.groupCollapsed('type.text rule')
      console.log({ value })
      console.warn('passes?', value.length > 2)
      console.groupEnd()
      return value.length > 2
    },
  },
  name: {
    fieldOne: ({ value, fieldProps }) => {
      const {
        ref: { props },
      } = fieldProps

      console.groupCollapsed('name.fieldOne rule')
      console.log({ value })
      console.warn('passes?', value !== 'foo')
      console.groupEnd()

      return value !== 'foo'
    },
    fieldTwo: ({ value, get }) => {
      return value === get(['fieldOne', 'value'])
    },
  },
}

const messages = {
  general: {
    invalid: 'General invalid',
  },
  name: {
    fieldOne: {
      invalid: 'Must not equal to "foo"!',
    },
  },
}

export default class FormPropsRules extends React.Component {
  render() {
    return (
      <Form rules={rules} messages={messages}>
        <Input
          {...this.props}
          name="fieldOne"
          label="Field one"
          hint="Must be more than 2 characters and not equal to `foo`"
        />
        <Input
          name="fieldTwo"
          label="Field two"
          hint="Valid when equals to `fieldOne` value"
        />
      </Form>
    )
  }
}
