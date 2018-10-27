import React from 'react'
import { Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

export const timeoutDuration = 500

export default class AjaxPrefilling extends React.Component {
  state = {
    isFetching: false,
    street: null,
  }

  handleButtonClick = (event) => {
    event.preventDefault()
    this.setState({ isFetching: true })

    setTimeout(
      () =>
        this.setState({
          isFetching: false,
          street: 'Baker',
        }),
      timeoutDuration,
    )
  }

  render() {
    const { isFetching, street } = this.state

    return (
      <Form>
        <Input
          name="street"
          label="Street"
          value={street}
          disabled={isFetching}
          onChange={({ nextValue }) => this.setState({ street: nextValue })}
          required
        />

        <Input
          name="streetRule"
          label="Street with validation"
          value={street}
          rule={/^\d+$/}
          onChange={({ nextValue }) => this.setState({ street: nextValue })}
          disabled={isFetching}
          required
        />

        <Button
          id="ajax"
          type="button"
          disabled={isFetching}
          onClick={this.handleButtonClick}
        >
          {isFetching ? 'Fetching...' : 'Fetch data'}
        </Button>
      </Form>
    )
  }
}
