import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

const initialState = {
  isDirty: false,
}

export default class OnFirstChange extends React.Component {
  state = initialState

  resetForm = () => {
    window.form.reset()
  }

  handleReset = () => {
    this.setState(initialState)
  }

  handleFirstChange = () => {
    this.setState({
      isDirty: true,
    })
  }

  render() {
    const { isDirty } = this.state

    return (
      <React.Fragment>
        <h1>First change</h1>

        <Form
          ref={(form) => (window.form = form)}
          onReset={this.handleReset}
          onFirstChange={this.handleFirstChange}
        >
          <Input
            name="email"
            type="email"
            label="E-mail"
            initialValue="initial@email.example"
          />

          <Button id="reset" type="reset" onClick={this.resetForm}>
            Reset
          </Button>

          {isDirty ? (
            <p id="dirty">Form is dirty</p>
          ) : (
            <p id="not-dirty">Form is not dirty</p>
          )}
        </Form>
      </React.Fragment>
    )
  }
}
