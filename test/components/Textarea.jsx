import React from 'react';
import { connectField } from '../../lib';

function Textarea({ fieldProps }) {
  return (<textarea { ...fieldProps } />);
}

Textarea.displayName = 'Textarea';

export default connectField()(Textarea);
