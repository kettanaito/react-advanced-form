import React from 'react'
import { createField } from 'react-advanced-form'
import moment from 'moment'
import ReactDatepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class Datepicker extends React.Component {
  handleChange = nextValue => {
    /* Dispatch "react-advanced-form" method to update the field record */
    this.props.handleFieldChange({ nextValue })
  }

  render() {
    const { fieldProps } = this.props

    return (
      <div className="form-group">
        <ReactDatepicker {...fieldProps} className="form-control" onChange={this.handleChange} />
      </div>
    )
  }
}

export default createField({
  /* "react-datepicker" uses "selected" prop instead of "value" */
  valuePropName: 'selected',
  initialValue: moment(),
})(Datepicker)
