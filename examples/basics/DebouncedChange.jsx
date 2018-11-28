import React from 'react'
import { Form, Field } from 'react-advanced-form'
import { Input } from '@examples/fields'
import debounce from '../../src/utils/debounce'
import Button from '@examples/shared/Button'

export const debounceDuration = 500

export default class FieldUnmounting extends React.Component {
  state = {
    username: '',
  }

  handleUsernameChange = debounce(({ nextValue }) => {
    this.setState({ username: nextValue })
  }, debounceDuration)

  render() {
    const { username } = this.state

    return (
      <React.Fragment>
        <h1>Debounced change</h1>

        <Form>
          <Input
            name="username"
            rule={({ value }) => value !== 'f'}
            onChange={this.handleUsernameChange}
          />

          <p>
            <strong>Username:</strong>{' '}
            <span id="username-label">{username}</span>
          </p>
        </Form>
      </React.Fragment>
    )
  }
}
