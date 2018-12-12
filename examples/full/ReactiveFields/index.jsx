import React from 'react'
import { FormProvider, Form } from 'react-advanced-form'
import { Input, Checkbox } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class ReactiveFields extends React.Component {
  handleSubmitStart = ({ serialized }) => {
    console.warn(serialized)
  }

  render() {
    return (
      <Form onSubmitStart={this.handleSubmitStart} onInvalid={console.log}>
        <Input
          label="Input one"
          name="inputOne"
          hint={
            <span>
              Required when <code>checkboxOne</code> is checked
            </span>
          }
          onChange={(args) => console.log('! Change', args)}
          onFocus={(args) => console.log('! Focus', args)}
          onBlur={(args) => console.log('! Blur', args)}
          required={({ get }) => get(['checkboxOne', 'checked'])}
        />
        <Input
          label="Input two"
          name="inputTwo"
          hint={
            <span>
              Required when <code>checkboxTwo</code> is checked
            </span>
          }
          required={({ get }) => get(['checkboxTwo', 'checked'])}
        />
        <Checkbox
          id="checkboxOne"
          label="SMS"
          name="checkboxOne"
          hint={
            <span>
              Required when <code>checkboxTwo</code> is <strong>not</strong>{' '}
              checked
            </span>
          }
          required={({ get }) => !get(['checkboxTwo', 'checked'])}
        />
        <Checkbox
          id="checkboxTwo"
          label="E-mail"
          name="checkboxTwo"
          hint={
            <span>
              Required when <code>checkboxOne</code> is <strong>not</strong>{' '}
              checked
            </span>
          }
          required={({ get }) => !get(['checkboxOne', 'checked'])}
        />
        <Button type="primary">Submit</Button>
      </Form>
    )
  }
}
