import React from 'react';
import createField from '../createField';

class Radio extends React.Component {
  render() {
    return (<input { ...this.props } />);
  }
}

export default createField({
  /**
   * Handling of contextProps of  Radio inputs' is unique.
   * 1. Never pass "props.value" to context. <Field.Radio> is always expected to receive a "value" prop,
   * however it should never set it to context on registration. The value in the context will be changed
   * according to the onChange handlers in the future.
   * 2. Determine "initialValue" based on optional "checked" prop.
   * 3. Add new "checked" props unique to this field type.
   */
  mapPropsToField: ({ checked, value, ...props }) => ({
    ...props,
    type: 'radio',
    checked,
    value: checked ? value : null,
    initialValue: checked && value
  }),
  // mapPropsToField: (props) => {
  //   const { checked, value } = props;

  //   const fieldProps = {
  //     ...props,
  //     value: checked ? value : null // unchecked radio inputs must not mutate the context value
  //   };

  //   if (checked) {
  //     fieldProps.checked = checked;

  //     if (value) {
  //       /* Only checked radio inputs should set the context value to its own value */
  //       fieldProps.initialValue = value;
  //       delete fieldProps.value;
  //     }
  //   }


  //   console.log('mapPropsToField:', Object.assign({}, fieldProps));

  //   return fieldProps;
  // },
  enforceProps: (props, contextProps) => ({
    checked: (props.value === contextProps.get('value'))
  })
})(Radio);
