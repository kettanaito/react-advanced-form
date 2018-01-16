import React from 'react';
import createField from '../createField';

function Input({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

export default createField()(Input);
