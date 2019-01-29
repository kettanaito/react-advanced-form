import React from 'react'
import PropTypes from 'prop-types'
import { createField, fieldPresets } from 'react-advanced-form'

class Input extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    hint: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

    /* Inherites */
    fieldProps: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
  }

  render() {
    const { fieldProps, fieldState, id, name, label, hint } = this.props
    const {
      focused,
      touched,
      pristine,
      required,
      validating,
      validatedSync,
      validatedAsync,
      valid,
      validSync,
      validAsync,
      invalid,
      errors,
    } = fieldState

    const inputClassNames = [
      'form-control',
      focused && 'is-focused',
      touched && 'is-touched',
      pristine && 'is-pristine',
      validating && 'is-validating',
      validatedSync && 'validated-sync',
      validatedAsync && 'validated-async',
      valid && 'is-valid',
      validSync && 'valid-sync',
      validAsync && 'valid-async',
      invalid && 'is-invalid',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={id || name}>
            {label}
            {required && ' *'}
          </label>
        )}

        <input
          {...fieldProps}
          id={id || name}
          className={inputClassNames}
          autoComplete="off"
        />

        {hint && <small className="form-text text-muted">{hint}</small>}

        {errors &&
          errors.map((error, index) => (
            <div key={index} className="invalid-feedback">
              {error}
            </div>
          ))}
      </div>
    )
  }
}

export default createField(fieldPresets.input)(Input)
