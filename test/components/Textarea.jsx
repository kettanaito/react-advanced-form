import React from 'react';
import { createField } from '../../lib';

function Textarea({ fieldProps }) {
  return (<textarea { ...fieldProps } />);
}

Textarea.displayName = 'Textarea';

export default createField()(Textarea);
