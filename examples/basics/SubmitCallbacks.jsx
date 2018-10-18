import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'
import Button from '@shared/Button'
import isEmail from 'validator/lib/isEmail'

export const submitTimeout = 1000
const initialState = {
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
    this.setState({ isInvalid: true })
  }

  handleSubmitStart = () => {
    this.setState({
      isSubmitted: false,
      isInvalid: false,
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
        if (email === 'correct@email.example') {
          return resolve()
        }

        return reject()
      }, submitTimeout)
    })
  }

  render() {
    const {
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
            initialValue="correct@email.example"
            required
          />

          <Button type="submit">Submit</Button>
          <Button
            type="reset"
            onClick={(event) => {
              event.preventDefault()
              window.form.reset()
            }}
          >
            Reset
          </Button>

          {isInvalid && <p id="invalid">Form is invalid</p>}
          {isSubmitStart && <p id="submit-start">Starting submit...</p>}
          {isSubmitting && <p id="submitting">Submitting...</p>}
          {isSubmitted && <p id="submitted">Submitted!</p>}
          {isSubmitFailed && <p id="submit-failed">Failed!</p>}
          {isSubmitEnd && <p id="submit-end">Submit ended</p>}
        </Form>
      </React.Fragment>
    )
  }
}
