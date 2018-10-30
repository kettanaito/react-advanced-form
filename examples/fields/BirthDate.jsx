import React from 'react'
import { createField } from 'react-advanced-form'

class BirthDate extends React.Component {
  handleChange = (fieldName) => (event) => {
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
            onChange={this.handleChange('day')}
          />
          <input
            {...fieldProps}
            className={inputClassNames}
            value={fieldState.date.month}
            onChange={this.handleChange('month')}
          />
          <input
            {...fieldProps}
            className={inputClassNames}
            value={fieldState.date.year}
            onChange={this.handleChange('year')}
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
  mapPropsToField: ({ fieldRecord }) => ({
    ...fieldRecord,
    type: 'birth-date',
  }),
  shouldValidateOnMount: ({ date }) => {
    return date.year || date.month || date.day
  },
  mapValue(value) {
    const parsedDate = value.split('-')
    return {
      year: parsedDate[0] || '',
      month: parsedDate[1] || '',
      day: parsedDate[2] || '',
    }
  },
  assertValue(date) {
    return date.year || date.month || date.day
  },
  serialize(date) {
    return [date.year, date.month, date.day].join('-')
  },
})(BirthDate)
