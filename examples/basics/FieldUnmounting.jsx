import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class FieldUnmounting extends React.Component {
  state = {
    shouldDisplayInput: true,
  }

  componentDidMount() {
    this.setState({ shouldDisplayInput: false })
  }

  handleToggleField = () => {
    this.setState(({ shouldDisplayInput }) => ({
      shouldDisplayInput: !shouldDisplayInput,
    }))
  }

  render() {
    const { shouldDisplayInput } = this.state

    return (
      <React.Fragment>
        <h1>Field unmounting</h1>

        <Form ref={(form) => (window.form = form)}>
          <Input name="fieldOne" initialValue="foo" required />

          {shouldDisplayInput && (
            <Field.Group name="groupName">
              <Input name="fieldTwo" initialValue="bar" required />
              <Input name="fieldThree" required />
            </Field.Group>
          )}

          <Button onClick={this.handleToggleField}>Toggle field</Button>
        </Form>
      </React.Fragment>
    )
  }
}
