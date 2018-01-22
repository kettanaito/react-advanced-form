import React from 'react';
import connectField from '../connectField';

function Checkbox({ fieldProps }) {
  return (<input { ...fieldProps } />);
}

Checkbox.displayName = 'Checkbox';

export default connectField({
  valuePropName: 'checked',
  mapPropsToField: ({ props: { checked }, fieldRecord }) => ({
    ...fieldRecord,
    type: 'checkbox',
    initialValue: checked
  }),
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
})(Checkbox);
