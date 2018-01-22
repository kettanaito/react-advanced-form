import React from 'react';
import connectField from '../connectField';

function Input({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

Input.displayName = 'Input';

export default connectField()(Input);
