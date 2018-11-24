import React from 'react'
import { Form } from 'react-advanced-form'
import { Input, Radio, Checkbox, Select, Textarea } from '@examples/fields'
import Button from '@examples/shared/Button'

export default class UncontrolledFields extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Uncontrolled fields</h1>

        <Form
          id="form"
          ref={(form) => (window.form = form)}
          onSubmitStart={this.props.onSubmitStart}
        >
          {/* Inputs */}
          <Input id="inputOne" name="inputOne" label="Field one" />
          <Input
            id="inputTwo"
            name="inputTwo"
            label="Field two"
            initialValue="foo"
          />

          {/* Radio */}
          <Radio id="radio1" name="radio" label="Radio one" value="cheese" />
          <Radio
            id="radio2"
            name="radio"
            label="Radio two"
            value="potato"
            checked
          />
          <Radio
            id="radio3"
            name="radio"
            label="Radio three"
            value="cucumber"
          />

          {/* Checkboxes */}
          <Checkbox
            id="checkboxOne"
            name="checkboxOne"
            label="Checkbox one"
            checked={false}
          />
          <Checkbox
            id="checkboxTwo"
            name="checkboxTwo"
            label="Checkbox two"
            checked
          />

          {/* Select */}
          <Select id="select" name="select" label="Select" initialValue="two">
            <option value="one">one</option>
            <option value="two">two</option>
            <option value="three">three</option>
          </Select>

          {/* Textareas */}
          <Textarea id="textareaOne" label="Textarea one" name="textareaOne" />
          <Textarea
            id="textareaTwo"
            name="textareaTwo"
            label="Textarea two"
            initialValue="something"
          />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
