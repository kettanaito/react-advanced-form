import React from 'react';
import createField from '../createField';

function Textarea({ fieldProps }) {
  return (<textarea { ...fieldProps } />);
}

Textarea.displayName = 'Textarea';

export default createField()(Textarea);
