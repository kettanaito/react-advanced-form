import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export const timeoutDuration = 500

export default class AjaxPrefilling extends React.Component {
  state = {
    isFetching: false,
  }

  handleButtonClick = (event) => {
    event.preventDefault()
    this.setState({ isFetching: true })

    setTimeout(() => {
      this.setState({
        isFetching: false,
      })

      this.formRef.setValues({
        street: 'Baker',
        deliveryAddress: {
          houseNumber: 'error',
          contactDetails: {
            firstName: 'John',
            lastName: 'Maverick',
          },
        },
      })
    }, timeoutDuration)
  }

  render() {
    const { isFetching } = this.state

    return (
      <React.Fragment>
        <h1>Ajax Pre-filling</h1>

        <Form ref={(form) => (this.formRef = form)}>
          <Input name="street" label="Street" disabled={isFetching} required />

          <Field.Group name="deliveryAddress">
            <Input
              name="houseNumber"
              label="House number"
              hint="Numbers only"
              rule={/^\d+$/}
              disabled={isFetching}
              required
            />

            <Field.Group name="contactDetails">
              <Input
                name="firstName"
                label="First name"
                disabled={isFetching}
              />
              <Input name="lastName" label="Last name" disabled={isFetching} />
            </Field.Group>
          </Field.Group>

          <Button
            id="ajax"
            type="button"
            disabled={isFetching}
            onClick={this.handleButtonClick}
          >
            {isFetching ? 'Fetching...' : 'Fetch data'}
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}
