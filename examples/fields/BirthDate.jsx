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
  /**
   * Allow multiple instances of a field with the same name
   * because "birthDate" contains three children input fields.
   */
  allowMultiple: true,
  valuePropName: 'date',
  /**
   * Modifies the field's state to include custom type.
   * This prevents children inputs to listen to "type: text"
   * validation rules.
   */
  mapPropsToField: ({ fieldRecord }) => ({
    ...fieldRecord,
    type: 'birthDate',
  }),
  enforceProps: () => ({
    type: 'text',
  }),
  /**
   * Execute mapping function each time a "raw" value ("1999-12-10")
   * comes into the field. Has no effect over internal field value handling.
   */
  mapValue(value) {
    const parsedDate = value.split('-')
    return {
      year: parsedDate[0] || '',
      month: parsedDate[1] || '',
      day: parsedDate[2] || '',
    }
  },
  /**
   * A predicate function that describes when the field has value.
   * Useful for the fields with complex internal value instance,
   * like this one, where the value is stored as an Object.
   */
  assertValue(date) {
    return date.year || date.month || date.day
  },
  /**
   * Custom serialization function that executes upon the
   * field's serialization. Joins Object values into a string.
   */
  serialize(date) {
    return [date.year, date.month, date.day].join('-')
  },
})(BirthDate)
