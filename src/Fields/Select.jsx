import React from 'react';
import createField from '../createField';

function Select(props) {
  return (
    <select { ...props }>
      { props.children }
    </select>
  );
}

export default createField({
  mapPropsToField: ({ children, initialValue, ...props }) => ({
    ...props,
    initialValue: initialValue || (children && children[0].value)
  })
})(Select);
