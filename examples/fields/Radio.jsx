import React from 'react';
import PropTypes from 'prop-types';
import { createField, fieldPresets } from '../../lib';

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

    const checkClassNames = [
      'form-check',
      valid && 'has-success',
      invalid && 'has-danger'
    ].filter(Boolean).join(' ');

    const inputClassNames = [
      'form-check-input',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={ checkClassNames }>
        <label className="form-check-label">
          <input id={ id } className={ inputClassNames } { ...fieldProps } />
          { label }
        </label>
      </div>
    );
  }
}

export default createField(fieldPresets.radio)(Radio);
