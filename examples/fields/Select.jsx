import React from 'react';
import PropTypes from 'prop-types';
import { createField, fieldPresets } from '../../lib';

class Select extends React.Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    multiple: PropTypes.bool,

    /* Inherited */
    fieldProps: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired
  }

  render() {
    const { fieldProps, fieldState, id, className, name, multiple, label } = this.props;

    const selectClassNames = [
      'custom-select',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className="form-group">
        { label && (
          <label className="custom-control-label" htmlFor={ id || name }>{ label }</label>
        ) }

        <select id={ id || name } multiple={ multiple } className={ selectClassNames } { ...fieldProps }>
          { this.props.children }
        </select>
      </div>
    );
  }
}

export default createField(fieldPresets.select)(Select);
