import React from 'react';
import { Field } from '../../src';

const inputStyles = {
  border: '1px solid #ccc',
  borderRadius: '3px',
  margin: 0,
  padding: '.45rem .65rem',
  fontSize: '14px'
};

export default function MyCustomInput(props) {
  const { name, ...fieldProps } = props;

  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {/* <Field style={ inputStyles } /> */}

      <Field.Input name={ name } {...fieldProps} style={ inputStyles } />

      <Field.Condition forField={ name } when={({ valid }) => !valid}>
        <p style={{ color: 'red' }}>Please provide a proper value!</p>
      </Field.Condition>

      {/* <Field.Condition
        forField={ name }
        render={(fieldProps) => {
          if (!fieldProps.valid) return (<p>Please pass a correct value.</p>);
          if (fieldProps.value === 'foo') return (<p>Entered some foo!</p>);
        }} /> */}

      {/* { !valid && (
        <p style={{ color: 'red', marginTop: 0 }}>The field is invalid.</p>
      ) } */}
    </div>
  );
}
