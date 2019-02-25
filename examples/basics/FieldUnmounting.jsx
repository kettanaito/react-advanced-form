import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class FieldUnmounting extends React.Component {
  state = {
    shouldDisplayInput: true,
    shouldDisplayFirst: false,
    shouldDisplaySecond: true,
  }

  componentDidMount() {
    this.setState({ shouldDisplaySecond: false })
  }

  toggleFields = () => {
    this.setState(({ shouldDisplayFirst, shouldDisplaySecond }) => ({
      shouldDisplayFirst: !shouldDisplayFirst,
      shouldDisplaySecond: !shouldDisplaySecond,
    }))
  }

  render() {
    const { shouldDisplayFirst, shouldDisplaySecond } = this.state

    return (
      <React.Fragment>
        <h1>Field unmounting</h1>

        <Form ref={(form) => (window.form = form)}>
          <Input
            name="fieldOne"
            label="Field one"
            initialValue="foo"
            required
          />

          {(shouldDisplayFirst || shouldDisplaySecond) && (
            <Field.Group name="groupName">
              {shouldDisplayFirst && (
                <Input
                  name="fieldTwo"
                  label="Field two"
                  initialValue="bar"
                  required
                />
              )}

              {shouldDisplaySecond && (
                <Input name="fieldThree" label="Field three" required />
              )}
            </Field.Group>
          )}

          <Button type="button" onClick={this.toggleFields}>
            Toggle fields
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
