import React from 'react';
import PropTypes from 'prop-types';
import { createField } from '@lib';
import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';

class Select extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired
  }

  /* Handler for "react-select" onChange event */
  handleChange = (selectedOption) => {
    /* Compose next value based on "multi" prop */
    const { multi } = this.props;
    const singleOption = selectedOption && selectedOption.value;
    const nextValue = multi ? selectedOption.map(option => option.value) : selectedOption

    /* Dispatching "react-advanced-form" field change handler to update the field record */
    this.props.handleFieldChange({ nextValue });
  }

  render() {
    const { fieldProps, label } = this.props;

    return (
      <div>
        { label && (
          <label>{ label }</label>
        ) }
        <ReactSelect
          { ...fieldProps }
          onChange={ this.handleChange } />
      </div>
    );
  }
}

export default createField({
  enforceProps({ props: { options, multi } }) {
    /* Declare which props to propagate from "<Select>" props to "fieldProps" */
    return {
      options,
      multi
    };
  }
})(Select);
