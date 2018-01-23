import React from 'react';
import { connectField } from '../../lib';

function Select({ children, fieldProps }) {
  return (
    <select { ...fieldProps }>
      { children }
    </select>
  );
}

Select.displayName = 'Select';

export default connectField({
  mapPropsToField: ({ fieldRecord, props: { children, initialValue } }) => ({
    ...fieldRecord,
    initialValue: initialValue || (children && children[0].value)
  })
})(Select);
