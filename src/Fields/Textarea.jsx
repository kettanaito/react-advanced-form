import React from 'react';
import createField from '../createField';

function Textarea(props) {
  return (<textarea { ...props } />);
}

export default createField()(Textarea);
