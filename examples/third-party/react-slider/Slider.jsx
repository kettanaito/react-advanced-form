import React from 'react';
import PropTypes from 'prop-types';
import { createField } from '@lib';
import ReactSlider from 'react-slider';
import './slider.css';

function getValues(variable) {
  return (typeof variable === 'object') ? Object.values(variable) : [variable];
}

class Slider extends React.Component {
  static propTypes = {
    label: PropTypes.string
  }

  handleChange = (nextValue) => {
    const { defaultValue } = this.props;

    const mapNextValues = (typeof defaultValue === 'object')
      ? Object.keys(defaultValue).reduce((acc, key, index) => {
        acc[key] = nextValue[index];
        return acc;
      }, {})
      : nextValue;

    this.props.handleFieldChange({ nextValue: mapNextValues });
  }

  render() {
    const { fieldProps, label } = this.props;
    const { value } = fieldProps;
    const transformedValue = getValues(value);

    return (
      <div>
        {label && (
          <label>{label}</label>
        )}
        <ReactSlider
          {...fieldProps}
          value={transformedValue}
          className="horizontal-slider"
          onChange={this.handleChange}>
          {transformedValue.map((value, key) => (
            <div className="label" key={key}>{value}</div>
          ))}
        </ReactSlider>
      </div>
    );
  }
}

export default createField({
  mapPropsToField({ fieldRecord, props }) {
    fieldRecord.type = 'range';
    fieldRecord.value = props.defaultValue;

    return fieldRecord;
  },
  enforceProps({ props: { min, max, step, defaultValue, withBars, minDistance } }) {
    return {
      min,
      max,
      step,
      defaultValue: getValues(defaultValue),
      withBars,
      minDistance
    };
  }
})(Slider);
