import React from 'react'
import { createField } from '@lib'

class BirthDate extends React.Component {
  handleChange = (event, fieldName) => {
    const { fieldState } = this.props
    const { value } = event.target

    const nextValue = {
      ...fieldState.date,
      [fieldName]: value,
    }

    this.props.handleFieldChange({ nextValue })
  }

  render() {
    const { fieldProps, fieldState, id, label } = this.props
    const { valid, invalid, errors, required } = fieldState

    console.log({ errors })

    const inputClassNames = [
      'form-control',
      valid && 'is-valid',
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

        <div className="d-flex">
          <input
            {...fieldProps}
            className={inputClassNames}
            value={fieldState.date.day}
            onChange={(event) => this.handleChange(event, 'day')}
          />
          <input
            {...fieldProps}
            className={inputClassNames}
            value={fieldState.date.month}
            onChange={(event) => this.handleChange(event, 'month')}
          />
          <input
            {...fieldProps}
            className={inputClassNames}
            value={fieldState.date.year}
            onChange={(event) => this.handleChange(event, 'year')}
          />
        </div>

        {errors &&
          errors.map((error, index) => (
            <div key={index} className="invalid-feedback d-block">
              {error}
            </div>
          ))}
      </div>
    )
  }
}

export default createField({
  allowMultiple: true,
  valuePropName: 'date',
  shouldValidateOnMount: ({ fieldRecord: { date } }) => {
    return date.day || date.month || date.year
  },
  mapPropsToField: ({ valuePropName, props, fieldRecord }) => {
    const date = props.date || ''
    const splitDate = date.split('-')
    const day = splitDate[0] || ''
    const month = splitDate[1] || ''
    const year = splitDate[2] || ''
    const initialValue = { day, month, year }

    return {
      ...fieldRecord,
      [valuePropName]: initialValue,
      initialValue,
    }
  },
})(BirthDate)
