import React from 'react';
import createField from '../createField';

function Checkbox(props) {
  return (<input { ...props } />);
}

export default createField({
  valueProp: 'checked',
  mapPropsToField: props => ({
    ...props,
    type: 'checkbox',
    initialValue: props.checked
  }),
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
})(Checkbox);
