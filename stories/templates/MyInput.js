import React from 'react';
import { Field, withContext } from '../../src';

const inputStyles = {
  border: '1px solid #ccc',
  borderRadius: '3px',
  margin: 0,
  padding: '.45rem .65rem',
  fontSize: '14px'
};

class MyCustomInput extends React.Component {
  render() {
    const { name, fieldProps, ...restProps } = this.props;

    // const valid = !!fieldProps.value && fieldProps.validated && fieldProps.expected;
    // const invalid = fieldProps.validated && !fieldProps.expected;

    return (
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex' }}>
          <Field.Input name={ name } {...restProps} style={ inputStyles } />
          { fieldProps.valid && (
            <span style={{ color: 'green' }}>✓</span>
          ) }
        </div>

        { fieldProps.invalid && (
          <p style={{ color: 'red', marginTop: '4px' }}>Please provide a proper value.</p>
        ) }
      </div>
    );
  }
}

export default withContext(MyCustomInput);
