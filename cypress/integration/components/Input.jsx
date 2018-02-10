import React from 'react';
import { createField } from '../../../lib';
import feather from 'feather-icons';

const inputStyles = {
  border: '1px solid #ccc',
  borderRadius: 3,
  margin: 0,
  padding: '.45rem .65rem',
  fontSize: '14px'
};

class Input extends React.Component {
  render() {
    const { fieldProps, fieldState } = this.props;
    const { valid, invalid, errors, validating, focused, disabled } = fieldState;

    const iconOptions = { width: 16, height: 16 };

    const borderColor = (valid && 'green') || (invalid && '#cc0000');
    const iconColor = (valid && 'green') || (invalid && '#cc0000');
    const icon = (valid && feather.icons.check.toSvg(iconOptions)) || (invalid && feather.icons['alert-circle'].toSvg(iconOptions));
    const opacity = disabled ? '0.5' : 1;

    const inputClassNames = [
      focused && 'focused',
      validating && 'validating',
      valid && 'valid',
      invalid && 'invalid'
    ].filter(Boolean);

    return (
      <div className="form-group" style={{ marginBottom: '1rem', opacity }}>
        <div style={{ display: 'inline-flex', position: 'relative' }}>
          <input
            { ...fieldProps }
            className={ inputClassNames.join(' ') }
            style={{ ...inputStyles, borderColor }}
            data-errors={ errors && errors.join(' ') }
            autoComplete="off" />

          { (valid || invalid) && (
            <span
              style={{
                position: 'absolute',
                height: 16,
                color: iconColor,
                top: 0,
                bottom: 0,
                margin: 'auto',
                right: 8
              }}
              dangerouslySetInnerHTML={{
                __html: icon
              }} />
          ) }
        </div>

        { validating && <p className="validating">Validating...</p> }

        { invalid && errors && errors.map((error, index) => (
          <p key={ index } className="errors" style={{ color: '#cc0000', marginTop: 4 }}>{ error }</p>
        )) }
      </div>
    );
  }
}

export default createField()(Input);
