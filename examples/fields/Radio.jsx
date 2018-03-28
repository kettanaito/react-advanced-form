import React from 'react';
import PropTypes from 'prop-types';
import { createField, fieldPresets } from '../../';

class Radio extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,

    /* Inherited */
    fieldProps: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired
  }

  render() {
    const { fieldProps, fieldState, id, className, label } = this.props;
    const { valid, invalid } = fieldState;

    const inputClassNames = [
      'custom-control-input',
      valid && 'is-valid',
      invalid && 'is-invalid',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className="form-group">
        <div className="custom-control custom-radio">
          <input id={ id } className={ inputClassNames } { ...fieldProps } />
          <label className="custom-control-label" htmlFor={ id }>{ label }</label>
        </div>
      </div>
    );
  }
}

export default createField(fieldPresets.radio)(Radio);
