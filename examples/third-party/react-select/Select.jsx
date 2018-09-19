import React from 'react'
import PropTypes from 'prop-types'
import { createField } from '@lib'
import ReactSelect from 'react-select'
// import 'react-select/dist/react-select.css'

class Select extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }

  /* Handler for "react-select" onChange event */
  handleChange = (selectedOption) => {
    /* Dispatching "react-advanced-form" field change handler to update the field record */
    this.props.handleFieldChange({ nextValue: selectedOption })
  }

  render() {
    const { fieldProps, label } = this.props

    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        <ReactSelect {...fieldProps} onChange={this.handleChange} />
      </div>
    )
  }
}

export default createField({
  enforceProps({ props: { options, isMulti } }) {
    /* Declare which props to propagate from "<Select>" props to "fieldProps" */
    return {
      options,
      isMulti,
    }
  },
})(Select)
