import React from 'react';
import { createField, Form } from '@lib';

class CustomField extends React.Component {
  state = {
    count: 0
  }

  handleFieldChange = (event) => {
    this.setState(({ count }) => ({ count: count + 1 }));
    this.props.handleFieldChange({ event });
  }

  render() {
    const { count } = this.state;

    return (
      <div>
        <input { ...this.props.fieldProps } onChange={ this.handleFieldChange } />
        <span id="count">{ count }</span>
      </div>
    );
  }
}

const EnhancedField = createField()(CustomField);

export default class CreateFieldScenario extends React.Component {
  render() {
    return (
      <Form ref={ this.props.getRef }>
        <EnhancedField name="fieldOne" />
      </Form>
    )
  }
}
