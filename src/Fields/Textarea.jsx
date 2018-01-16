import React from 'react';
import createField from '../createField';

function Textarea({ fieldProps }) {
  return (<textarea { ...fieldProps } />);
}

export default createField()(Textarea);
