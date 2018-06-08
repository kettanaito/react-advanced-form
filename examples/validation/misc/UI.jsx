import React from 'react'
import { Form } from '@lib'
import { Input } from '@fields'

export default class UI extends React.Component {
  render() {
    return (
      <Form>
        <Input name="fieldOne" rule={/^\d+$/} />
      </Form>
    )
  }
}
