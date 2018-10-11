import React from 'react'
import { createField } from '../../'

class FieldInput extends React.Component {
  handleChange = (event) => {
    const { files } = event.target
    const nextValue = files && files[0]
    this.props.handleFieldChange({ nextValue })
  }

  render() {
    const { fieldState, fieldProps } = this.props

    return (
      <div className="form-group">
        <input
          {...fieldProps}
          className="form-control"
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default createField({
  valuePropName: 'file',
  enforceProps: () => ({
    type: 'file',
  }),
})(FieldInput)
