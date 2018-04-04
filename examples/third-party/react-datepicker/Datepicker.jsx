import React from 'react';
import { createField } from '@lib';
import ReactDatepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Datepicker extends React.Component {
  handleChange = (nextValue) => {
    /* Dispatch "react-advanced-form" method to update the field record */
    this.props.handleFieldChange({ nextValue });
  }

  render() {
    const { fieldProps } = this.props;

    return (
      <ReactDatepicker
        {...fieldProps}
        onChange={this.handleChange} />
    );
  }
}

export default createField({
  /* "react-datepicker" uses "selected" prop instead of "value" */
  valuePropName: 'selected'
})(Datepicker);
