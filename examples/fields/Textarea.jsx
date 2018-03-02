import React from 'react';
import PropTypes from 'prop-types';
import { createField } from '../../lib';

class Textarea extends React.Component {
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
    const { fieldProps, fieldState, id, name, className, label } = this.props;
    const { valid, invalid, errors } = fieldState;

    const groupClassNames = [
      'form-group',
      valid && 'has-success',
      invalid && 'has-danger'
    ].filter(Boolean).join(' ');

    const textareaClassNames = [
      'form-control',
      valid && 'form-control-success',
      invalid && 'form-control-danger',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={ groupClassNames }>
        { label && (
          <label className="form-control-label" htmlFor={ id || name }>{ label }</label>
        ) }

        <textarea id={ id || name } className={ textareaClassNames } { ...fieldProps } />

        { errors && errors.map((error, index) => (
          <div key={ index } className="form-control-feedback">{ error }</div>
        )) }
      </div>
    );
  }
}

export default createField()(Textarea);
