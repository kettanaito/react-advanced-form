import React from 'react';
import createField from '../createField';

function Select({ children, fieldProps }) {
  return (
    <select { ...fieldProps }>
      { children }
    </select>
  );
}

Select.displayName = 'Select';

export default createField({
  mapPropsToField: ({ children, initialValue, ...props }) => ({
    ...props,
    initialValue: initialValue || (children && children[0].value)
  })
})(Select);
