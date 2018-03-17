import React from 'react';
import PropTypes from 'prop-types';
import { createField, fieldPresets } from '../../lib';

class Input extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    hint: PropTypes.string,

    /* Inherites */
    fieldProps: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired
  }

  render() {
    const { fieldProps, fieldState, id, name, label, hint } = this.props;
    const { required, validating, valid, invalid, errors } = fieldState;

    const inputClassNames = [
      'form-control',
      validating && 'is-validating',
      valid && 'is-valid',
      invalid && 'is-invalid'
    ].filter(Boolean).join(' ');

    return (
      <div className="form-group">
        { label && (
            <label htmlFor={ id || name }>{ label }{ required && ' *' }</label>
        ) }

        <input
          id={ id || name }
          className={ inputClassNames }
          { ...fieldProps } />

        { hint && (
          <small className="form-text text-muted">{ hint }</small>
        ) }

        { errors && errors.map((error, index) => (
          <div key={ index } className="invalid-feedback">{ error }</div>
        )) }
      </div>
    );
  }
}

export default createField(fieldPresets.input)(Input);
