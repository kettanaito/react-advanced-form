import React from 'react';
import { createField, fieldPresets } from '@lib';

class Select extends React.Component {
  render() {
    return (
      <div>
        <select { ...this.props.fieldProps }>
          { this.props.children }
        </select>
      </div>
    );
  }
}

export default createField(fieldPresets.select)(Select);
