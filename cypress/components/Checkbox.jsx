import React from 'react';
import { createField, fieldPresets } from '@lib';

class Checkbox extends React.Component {
  render() {
    return (<input { ...this.props.fieldProps } />);
  }
}

export default createField(fieldPresets.checkbox)(Checkbox);
