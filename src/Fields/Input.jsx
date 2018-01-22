import React from 'react';
import createField from '../createField';

function Input({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

Input.displayName = 'Input';

export default createField()(Input);
