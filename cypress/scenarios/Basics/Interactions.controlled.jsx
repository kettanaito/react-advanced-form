import React from 'react';
import { Form } from '@lib';
import { Input, Radio, Select, Textarea } from '@components';

export default class Interactions extends React.Component {
  state = {}

  handleFieldChange = ({ nextValue, fieldProps }) => {
    this.setState({ [fieldProps.name]: nextValue });
  }

  render() {
    const {
      inputOne,
      inputTwo,
      radio,
      select,
      textareaOne,
      textareaTwo
    } = this.state;

    return (
      <Form ref={ this.props.getRef } id="form">
        <Input name="inputOne" />
        <Input name="inputTwo" initialValue="foo" />

        <Radio id="radio1" name="radio" value="cheese" />
        <Radio id="radio2" name="radio" value="potato" checked />
        <Radio id="radio3" name="radio" value="cucumber" />

        <Select name="select" initialValue="two">
          <option value="one">one</option>
          <option value="two">two</option>
          <option value="three">three</option>
        </Select>

        <Textarea name="textareaOne" />
        <Textarea name="textareaTwo" initialValue="Something" />
      </Form>
    );
  }
}
