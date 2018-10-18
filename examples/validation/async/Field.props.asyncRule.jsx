import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'
import Button from '@shared/Button'

const messages = {
  type: {
    text: {
      async: 'Fallback message',
    },
  },
  name: {
    fieldFour: {
      rule: {
        async: ({ extra }) => extra,
      },
    },
  },
}

export default class FieldPropsAsyncRule extends React.Component {
  validateAsync = ({ value, fieldProps }) => {
    const fieldRef = fieldProps.getRef()

    return new Promise((resolve) => {
      setTimeout(resolve, 500)
    }).then(() => ({
      valid:
        fieldProps.name === 'fieldThree' ? value !== '123' : value !== 'foo',
      extra: fieldProps.name === 'fieldFour' && 'Data from async response',
    }))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Field async rule</h1>
        <Form ref={(form) => (window.form = form)} messages={messages}>
          <Input
            name="fieldOne"
            label="Field one"
            hint="Must not equal to `foo` (async)"
            asyncRule={this.validateAsync}
          />

          <Input
            name="fieldTwo"
            label="Field two"
            hint="Must be provided and not equal to `foo` (async)"
            asyncRule={this.validateAsync}
            required
          />

          <Input
            name="fieldFour"
            label="Required field with async rule and extra response props"
            hint="Propagates response data to the validation message on fail"
            asyncRule={this.validateAsync}
            required
          />

          <Button
            type="reset"
            onClick={(event) => {
              event.preventDefault()
              window.form.reset()
            }}
          >
            Reset
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
