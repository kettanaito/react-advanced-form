import React from 'react'
import { Form } from 'react-advanced-form'
import { Input, Checkbox } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class FormSubmit extends React.Component {
  state = {
    isSubmitting: false,
  }

  handleSubmit = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
  }

  handleSubmitStart = () => {
    this.setState({ isSubmitting: true })
  }

  render() {
    const { isSubmitting } = this.state

    return (
      <React.Fragment>
        <h1>Submit</h1>

        <Form action={this.handleSubmit} onSubmitStart={this.handleSubmitStart}>
          <Input name="email" type="email" label="E-mail" required />
          <Input name="password" type="password" label="Password" required />
          <Checkbox
            name="termsAndConditions"
            label="I agree to Terms and Conditions"
            required
          />

          <Button type="submit">Submit</Button>

          {isSubmitting && <span id="submitting">Submitting...</span>}
        </Form>
      </React.Fragment>
    )
  }
}
