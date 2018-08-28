import React from 'react'
import PropTypes from 'prop-types'
import { createField, fieldPresets } from '../../'

class Textarea extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,

    /* Inherited */
    fieldProps: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
  }

  render() {
    const { fieldProps, fieldState, id, name, className, label } = this.props
    const { valid, invalid, errors } = fieldState

    const textareaClassNames = [
      'form-control',
      valid && 'is-valid',
      invalid && 'is-invalid',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="form-group">
        {label && (
          <label className="form-control-label" htmlFor={id || name}>
            {label}
          </label>
        )}

        <textarea
          id={id || name}
          className={textareaClassNames}
          {...fieldProps}
        />

        {errors &&
          errors.map((error, index) => (
            <div key={index} className="form-control-feedback">
              {error}
            </div>
          ))}
      </div>
    )
  }
}

export default createField(fieldPresets.textarea)(Textarea)
