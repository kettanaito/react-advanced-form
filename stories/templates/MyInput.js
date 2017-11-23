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

    return (
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex' }}>
          <Field.Input name={ name } {...restProps} style={ inputStyles } />
          { fieldProps.validated && fieldProps.valid && <span style={{ color: 'green' }}>✓</span>}
        </div>

        { !fieldProps.valid && (
          <p style={{ color: 'red', marginTop: '4px' }}>Please provide a proper value.</p>
        ) }
      </div>
    );
  }
}

export default withContext(MyCustomInput);
