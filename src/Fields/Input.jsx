import React from 'react';
import createField from '../createField';

function Input(props) {
  return (<input { ...props } />);
}

export default createField()(Input);
