import React from 'react';
import PropTypes from 'prop-types';
import { createField, fieldPresets } from '../../lib';

class Input extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,

    /* Inherites */
    fieldProps: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired
  }

  render() {
    const { fieldProps, fieldState, id, name, label } = this.props;
    const { validating, valid, invalid, errors } = fieldState;

    const groupClassNames = [
      'form-group',
      valid && 'has-success',
      invalid && 'has-danger'
    ].filter(Boolean).join(' ');

    const inputClassNames = [
      'form-control',
      validating && 'validating',
      valid && 'form-control-success',
      invalid && 'form-control-danger'
    ].filter(Boolean).join(' ');

    return (
      <div className={ groupClassNames }>
        { label && (
          <label className="form-control-label" htmlFor={ id || name }>{ label }</label>
        ) }

        <input id={ id || name } className={ inputClassNames } { ...fieldProps } />

        { errors && errors.map((error, index) => (
          <div key={ index } className="form-control-feedback">{ error }</div>
        )) }
      </div>
    );
  }
}

export default createField(fieldPresets.input)(Input);
