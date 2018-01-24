import React from 'react';
import { createField, fieldPresets } from '../../lib';

function Select({ children, fieldProps }) {
  return (
    <select { ...fieldProps }>
      { children }
    </select>
  );
}

Select.displayName = 'Select';

export default createField(fieldPresets.select)(Select);
