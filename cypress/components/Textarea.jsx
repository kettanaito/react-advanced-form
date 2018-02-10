import React from 'react';
import { createField, fieldPresets } from '@lib';

class Textarea extends React.Component {
  render() {
    return (
      <div>
        <textarea { ...this.props.fieldProps } />
      </div>
    );
  }
}

export default createField()(Textarea);
