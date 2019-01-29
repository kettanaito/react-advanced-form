import React from 'react'
import { FormProvider, Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

const rules = {
  name: {
    fieldOne: ({ value }) => value !== 'foo',
  },
}

export default class DebounceTime extends React.Component {
  state = {
    providerRules: null,
  }

  handleButtonClick = (event) => {
    event.preventDefault()
    this.setState(({ providerRules }) => ({
      providerRules: providerRules === null ? rules : null,
    }))
  }

  render() {
    const { providerRules } = this.state

    return (
      <div>
        <h1>Prop updates</h1>

        <FormProvider rules={providerRules}>
          <Form {...this.props}>
            <Input name="fieldOne" initialValue="foo" />

            <Button>Submit</Button>
            <Button onClick={this.handleButtonClick}>
              Toggle provider rules
            </Button>
          </Form>
        </FormProvider>
      </div>
    )
  }
}
