import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'
import isEmail from 'validator/lib/isEmail'

export const submitTimeout = 500

const initialState = {
  message: null,
  isInvalid: false,
  isSubmitStart: false,
  isSubmitting: false,
  isSubmitted: false,
  isSubmitFailed: false,
  isSubmitEnd: false,
}

export default class Submit extends React.Component {
  state = initialState

  handleReset = () => {
    this.setState(initialState)
  }

  handleInvalidForm = () => {
    this.setState({
      ...initialState,
      isInvalid: true,
    })
  }

  handleSubmitStart = () => {
    this.setState({
      ...initialState,
      isSubmitStart: true,
    })
  }

  handleSubmitted = () => {
    this.setState({
      isSubmitted: true,
    })
  }

  handleSubmitFailed = () => {
    this.setState({
      isSubmitFailed: true,
    })
  }

  handleSubmitEnd = () => {
    this.setState({
      isSubmitStart: false,
      isSubmitEnd: true,
    })
  }

  handleSubmit = ({ serialized }) => {
    const { email } = serialized

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'expected@email.example') {
          return resolve()
        }

        const message = `Wrong email. Expected: "expected@email.example", got: "${email}".`
        this.setState({ message })

        return reject()
      }, submitTimeout)
    })
  }

  render() {
    const {
      message,
      isInvalid,
      isSubmitStart,
      isSubmitting,
      isSubmitted,
      isSubmitFailed,
      isSubmitEnd,
    } = this.state

    return (
      <React.Fragment>
        <h1>Submit callbacks</h1>

        <Form
          ref={(form) => (window.form = form)}
          action={this.handleSubmit}
          onReset={this.handleReset}
          onInvalid={this.handleInvalidForm}
          onSubmitStart={this.handleSubmitStart}
          onSubmitted={this.handleSubmitted}
          onSubmitFailed={this.handleSubmitFailed}
          onSubmitEnd={this.handleSubmitEnd}
        >
          <Input
            name="email"
            type="email"
            label="E-mail"
            rule={({ value }) => isEmail(value)}
            initialValue="expected@email.example"
            required
          />

          <Button type="submit">Submit</Button>

          {isInvalid && <p id="invalid">Form is invalid</p>}
          {isSubmitStart && <p id="submit-start">Starting submit...</p>}
          {isSubmitting && <p id="submitting">Submitting...</p>}
          {isSubmitted && <p id="submitted">Submitted!</p>}
          {isSubmitFailed && <p id="submit-failed">Failed!</p>}
          {isSubmitEnd && <p id="submit-end">Submit ended</p>}
          {message && <p>{message}</p>}
        </Form>
      </React.Fragment>
    )
  }
}
