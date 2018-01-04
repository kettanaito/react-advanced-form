import React from 'react';
import createField from '../createField';

class Select extends React.Component {
  render() {
    return (
      <select { ...this.props }>
        { this.props.children }
      </select>
    );
  }
}

export default createField({
  /**
   * This is a Field's lifecycle method called immediately before its registration in the Form.
   * The Object this method returns is treated as field props to be registered in the Form.
   */
  mapPropsToField: ({ children, initialValue, ...props }) => ({
    ...props,
    initialValue: initialValue || (children && children[0].value)
  })
})(Select);
