import React from 'react';
import { createField, fieldPresets } from '../../src';

class MyCheckbox extends React.Component {
  render() {
    return (
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <input { ...this.props.fieldProps } />
      </div>
    );
  }
}

export default createField(fieldPresets.checkbox)(MyCheckbox);
