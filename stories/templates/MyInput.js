import React from 'react';

const inputStyles = {
  border: '1px solid #ccc',
  borderRadius: '3px',
  margin: 0,
  padding: '.45rem .65rem',
  fontSize: '14px'
};

export default class MyInput extends React.Component {
  componentDidMount() {
    console.log('| | | MyInput @ componentDidMount');
  }

  render() {
    const { fieldProps } = this.props;
    const { valid } = fieldProps;

    console.log('| | | MyInput @ render');

    return (
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <input
          style={ inputStyles }
          {...fieldProps} />

        { !valid && (
          <p style={{ color: 'red', marginTop: 0 }}>The field is invalid.</p>
        ) }
      </div>
    );
  }
}
