import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

const schemaOne = {
  name: {
    fieldOne: ({ value }) => value === 'foo',
  },
}

const schemaTwo = {
  name: {
    fieldOne: ({ value }) => value === 'bar',
  },
}

export default class ConditionalSchema extends React.Component {
  state = {
    flag: true,
  }

  render() {
    const { flag } = this.state
    const rules = flag ? schemaOne : schemaTwo

    return (
      <React.Fragment>
        <h1>Conditional schema</h1>

        <Form rules={rules}>
          <Input
            name="fieldOne"
            label="Field one"
            hint={
              <span>
                Validates differently based on <code>form.props.rules</code>
              </span>
            }
            required
          />

          <Button
            onClick={() => this.setState(({ flag }) => ({ flag: !flag }))}
          >
            Toggle rules
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
