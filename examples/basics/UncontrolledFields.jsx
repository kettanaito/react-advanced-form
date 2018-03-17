import React from 'react';
import { Form } from '@lib';
import { Input, Radio, Checkbox, Select, Textarea } from '@fields';

export default class UncontrolledFields extends React.Component {
  render() {
    return (
      <div>
        <Form id="form" ref={ this.props.getRef }>
          { /* Inputs */ }
          <Input
            id="inputOne"
            name="inputOne"
            label="Field one" />
          <Input
            id="inputTwo"
            name="inputTwo"
            label="Field two"
            initialValue="foo" />

          { /* Radio */ }
          <Radio
            id="radio1"
            name="radio"
            label="Radio one"
            value="cheese" />
          <Radio
            id="radio2"
            name="radio"
            label="Radio two"
            value="potato"
            checked />
          <Radio
            id="radio3"
            name="radio"
            label="Radio three"
            value="cucumber" />

          { /* Checkboxes */ }
          <Checkbox
            id="checkbox1"
            name="checkbox1"
            label="Checkbox one"
            checked={ false } />
          <Checkbox
            id="checkbox2"
            name="checkbox2"
            label="Checkbox two"
            checked />

          { /* Select */ }
          <Select
            id="select"
            name="select"
            label="Select"
            initialValue="two">
            <option value="one">one</option>
            <option value="two">two</option>
            <option value="three">three</option>
          </Select>

          { /* Textareas */ }
          <Textarea
            id="textareaOne"
            label="Textarea one"
            name="textareaOne" />
          <Textarea
            id="textareaTwo"
            name="textareaTwo"
            label="Textarea two"
            initialValue="something" />
        </Form>
      </div>
    );
  }
}
