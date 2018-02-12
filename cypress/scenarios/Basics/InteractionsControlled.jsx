import React from 'react';
import { Form } from '@lib';
import { Input, Radio, Checkbox, Select, Textarea } from '@components';

export default class InteractionsControlled extends React.Component {
  state = {
    inputOne: '',
    inputTwo: 'foo',
    radio: 'potato',
    checkbox1: false,
    checkbox2: true,
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
      checkbox1,
      checkbox2,
      select,
      textareaOne,
      textareaTwo
    } = this.state;

    return (
      <div>
        <h3>Controlled form</h3>
        <Form id="form" ref={ this.props.getRef }>
          { /* Inputs */ }
          <Input
            id="inputOne"
            name="inputOne"
            value={ inputOne }
            onChange={ this.handleFieldChange } />
          <Input
            id="inputTwo"
            name="inputTwo"
            value={ inputTwo }
            onChange={ this.handleFieldChange } />

          { /* Radio */ }
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

          { /* Checkboxes */ }
          <Checkbox
            id="checkbox1"
            name="checkbox1"
            checked={ checkbox1 }
            onChange={ this.handleFieldChange } />
          <Checkbox
            id="checkbox2"
            name="checkbox2"
            checked={ checkbox2 }
            onChange={ this.handleFieldChange } />

          { /* Select */ }
          <Select
            id="select"
            name="select"
            value={ select }
            onChange={ this.handleFieldChange }>
            <option value="one">one</option>
            <option value="two">two</option>
            <option value="three">three</option>
          </Select>

          { /* Textareas */ }
          <Textarea
            id="textareaOne"
            name="textareaOne"
            onChange={ this.handleFieldChange }
            value={ textareaOne }
            onChange={ this.handleFieldChange } />
          <Textarea
            id="textareaTwo"
            name="textareaTwo"
            onChange={ this.handleFieldChange }
            value={ textareaTwo }
            onChange={ this.handleFieldChange } />
        </Form>
      </div>
    );
  }
}
