import React from 'react'
import { Form } from 'react-advanced-form'
import { Input, Radio } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class Clear extends React.Component {
  handleButtonClick = () => {
    window.form.clear()
  }

  handlePredicateButtonClick = () => {
    window.form.clear((fieldProps) =>
      ['username', 'password'].includes(fieldProps.name),
    )
  }

  render() {
    return (
      <Form ref={(form) => (window.form = form)}>
        <Input name="username" label="User name" />
        <Input name="password" type="password" label="Password" />
        <Radio name="customerType" label="Private" value="b2c" />
        <Radio name="customerType" label="Business" value="b2b" />

        <Button id="clear" onClick={this.handleButtonClick}>
          Clear
        </Button>
        <Button id="clear-predicate" onClick={this.handlePredicateButtonClick}>
          Clear with predicate
        </Button>
      </Form>
    )
  }
}
