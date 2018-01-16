import React from 'react';
import createField from '../createField';

function Checkbox({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

export default createField({
  valuePropName: 'checked',
  mapPropsToField: props => ({
    ...props,
    type: 'checkbox',
    initialValue: props.checked
  }),
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
})(Checkbox);
