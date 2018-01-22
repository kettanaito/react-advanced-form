import React from 'react';

const selectStyles = {
  border: '1px solid blue',
  borderRadius: '3px',
  margin: 0,
  padding: '.45rem .65rem',
  fontSize: '14px'
};

export default class MyCustomSelect extends React.Component {
  render() {
    const { valid } = this.props;

    return (
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        {/* <Field style={ selectStyles } /> */}

        <select  { ...fieldHandlers } style={ selectStyles } />

        { !valid && (
          <p style={{ color: 'red', marginTop: 0 }}>The field is invalid.</p>
        ) }
      </div>
    );
  }
}
