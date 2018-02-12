import React from 'react';
import { Form } from '@lib';
import { Input, Radio, Checkbox, Select, Textarea } from '@components';

export default class InteractionsUncontrolled extends React.Component {
  render() {
    return (
      <div>
        <h3>Uncontrolled form</h3>
        <Form id="form" ref={ this.props.getRef }>
          { /* Inputs */ }
          <Input
            id="inputOne"
            name="inputOne" />
          <Input
            id="inputTwo"
            name="inputTwo"
            initialValue="foo" />

          { /* Radio */ }
          <Radio
            id="radio1"
            name="radio"
            value="cheese" />
          <Radio
            id="radio2"
            name="radio"
            value="potato"
            checked />
          <Radio
            id="radio3"
            name="radio"
            value="cucumber" />

          { /* Checkboxes */ }
          <Checkbox
            id="checkbox1"
            name="checkbox1"
            checked={ false } />
          <Checkbox
            id="checkbox2"
            name="checkbox2"
            checked />

          { /* Select */ }
          <Select
            id="select"
            name="select"
            initialValue="two">
            <option value="one">one</option>
            <option value="two">two</option>
            <option value="three">three</option>
          </Select>

          { /* Textareas */ }
          <Textarea
            id="textareaOne"
            name="textareaOne" />
          <Textarea
            id="textareaTwo"
            name="textareaTwo"
            initialValue="something" />
        </Form>
      </div>
    );
  }
}
