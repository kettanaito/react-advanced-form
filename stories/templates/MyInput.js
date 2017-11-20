import React from 'react';
import { Field } from '../../src';

const inputStyles = {
  border: '1px solid #ccc',
  borderRadius: '3px',
  margin: 0,
  padding: '.45rem .65rem',
  fontSize: '14px'
};

export default class MyCustomInput extends React.Component {
  render() {
    const { valid, ...fieldProps } = this.props;

    console.log('| | | MyInput @ render');

    return (
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        {/* <Field style={ inputStyles } /> */}

        <Field.Input {...fieldProps} style={ inputStyles } />

        {/* { !valid && (
          <p style={{ color: 'red', marginTop: 0 }}>The field is invalid.</p>
        ) } */}
      </div>
    );
  }
}
