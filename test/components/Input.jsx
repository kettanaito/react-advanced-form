import React from 'react';
import { createField } from '../../lib';

function Input({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

Input.displayName = 'Input';

export default createField()(Input);
