import React from 'react'
import { Form } from '@lib'
import { Input, Radio, Checkbox, Select, Textarea } from '@fields'
import Button from '@shared/Button'

export default class ControlledFields extends React.Component {
  state = {
    inputOne: '',
    inputTwo: 'foo',
    radio: 'potato',
    checkbox1: false,
    checkbox2: true,
    select: 'two',
    textareaOne: '',
    textareaTwo: 'something',
  }

  handleFieldChange = ({ nextValue, fieldProps }) => {
    this.setState({ [fieldProps.name]: nextValue })
  }

  render() {
    const {
      inputOne,
      inputTwo,
      radio,
      checkbox1,
      checkbox2,
      select,
      textareaOne,
      textareaTwo,
    } = this.state

    return (
      <React.Fragment>
        <h1>Controlled fields</h1>

        <Form
          id="form"
          ref={this.props.getRef}
          onSubmitStart={this.props.onSubmitStart}
        >
          {/* Inputs */}
          <Input
            id="inputOne"
            name="inputOne"
            label="Field one"
            value={inputOne}
            onChange={this.handleFieldChange}
          />
          <Input
            id="inputTwo"
            label="Field two"
            name="inputTwo"
            value={inputTwo}
            onChange={this.handleFieldChange}
          />

          {/* Radio */}
          <Radio
            id="radio1"
            name="radio"
            label="Radio one"
            value="cheese"
            checked={radio === 'cheese'}
            onChange={this.handleFieldChange}
          />
          <Radio
            id="radio2"
            name="radio"
            label="Radio two"
            value="potato"
            checked={radio === 'potato'}
            onChange={this.handleFieldChange}
          />
          <Radio
            id="radio3"
            name="radio"
            label="Radio three"
            value="cucumber"
            checked={radio === 'cucumber'}
            onChange={this.handleFieldChange}
          />

          {/* Checkboxes */}
          <Checkbox
            id="checkbox1"
            name="checkbox1"
            label="Checkbox one"
            checked={checkbox1}
            onChange={this.handleFieldChange}
          />
          <Checkbox
            id="checkbox2"
            name="checkbox2"
            label="Checkbox two"
            checked={checkbox2}
            onChange={this.handleFieldChange}
          />

          {/* Select */}
          <Select
            id="select"
            name="select"
            label="Select"
            value={select}
            onChange={this.handleFieldChange}
          >
            <option value="one">one</option>
            <option value="two">two</option>
            <option value="three">three</option>
          </Select>

          {/* Textareas */}
          <Textarea
            id="textareaOne"
            name="textareaOne"
            label="Textarea one"
            onChange={this.handleFieldChange}
            value={textareaOne}
            onChange={this.handleFieldChange}
          />
          <Textarea
            id="textareaTwo"
            name="textareaTwo"
            label="Textarea two"
            onChange={this.handleFieldChange}
            value={textareaTwo}
            onChange={this.handleFieldChange}
          />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
