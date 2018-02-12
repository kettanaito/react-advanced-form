import React from 'react';
import { createField, fieldPresets } from '@lib';

class Radio extends React.Component {
  render() {
    return (
      <div>
        <input
          id={ this.props.id }
          className={ this.props.className }
          { ...this.props.fieldProps } />
      </div>
    );
  }
}

export default createField(fieldPresets.radio)(Radio);
