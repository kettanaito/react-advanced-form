import React from 'react';
import { createField, fieldPresets } from '../../lib';

function Radio({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

Radio.displayName = 'Radio';

export default createField(fieldPresets.radio)(Radio);
