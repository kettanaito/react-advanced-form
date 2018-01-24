import React from 'react';
import { createField, fieldPresets } from '../../lib';

function Checkbox({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

Checkbox.displayName = 'Checkbox';

export default createField(fieldPresets.checkbox)(Checkbox);
