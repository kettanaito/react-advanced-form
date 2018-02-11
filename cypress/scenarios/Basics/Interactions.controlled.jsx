import React from 'react';
import { Form } from '@lib';
import { Input, Radio, Select, Textarea } from '@components';

export default class Interactions extends React.Component {
  state = {
    inputOne: '',
    inputTwo: 'foo',
    radio: 'potato',
    select: 'two',
    textareaOne: '',
    textareaTwo: 'something'
  }

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
        <Input
          name="inputOne"
          value={ inputOne }
          onChange={ this.handleFieldChange } />
        <Input
          name="inputTwo"
          value={ inputTwo }
          onChange={ this.handleFieldChange } />

        <Radio
          id="radio1"
          name="radio"
          value="cheese"
          checked={ radio === 'cheese' }
          onChange={ this.handleFieldChange } />
        <Radio
          id="radio2"
          name="radio"
          value="potato"
          checked={ radio === 'potato' }
          onChange={ this.handleFieldChange } />
        <Radio
          id="radio3"
          name="radio"
          value="cucumber"
          checked={ radio === 'cucumber' }
          onChange={ this.handleFieldChange } />

        <Select name="select" value={ select } onChange={ this.handleFieldChange }>
          <option value="one">one</option>
          <option value="two">two</option>
          <option value="three">three</option>
        </Select>

        <Textarea
          name="textareaOne"
          onChange={ this.handleFieldChange }
          value={ textareaOne }
          onChange={ this.handleFieldChange } />
        <Textarea
          name="textareaTwo"
          onChange={ this.handleFieldChange }
          value={ textareaTwo }
          onChange={ this.handleFieldChange } />
      </Form>
    );
  }
}
