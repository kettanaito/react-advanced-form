import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { defer } from '../../utils';
import { createField, Form } from '../../../lib';

describe('createField', function () {
  it('Supports custom event handlers', () => {
    let sum = 0;

    class CustomField extends React.Component {
      handleFocus = () => sum++
      handleBlur = () => sum++

      handleChange = (event) => {
        const { value: nextValue } = event.currentTarget;
        this.props.handleFieldChange({ event, nextValue });

        sum++;
      }

      render() {
        return (<input { ...this.props.fieldProps } onChange={ this.handleChange } />);
      }
    }

    const EnhancedField = createField()(CustomField);

    const wrapper = mount(
      <Form>
        <EnhancedField name="enhanced-field" />
      </Form>
    );

    return defer(() => {
      const form = wrapper.find(Form).instance();
      const input = wrapper.find(CustomField).instance();

      // input.handleChange({ currentTarget: { value: 'foo' } });
      wrapper.simulate('change', { currentTarget: { value: 'foo' } });
      expect(sum).to.equal(1);

      input.handleFocus();
      expect(sum).to.equal(2);

      input.handleBlur();
      expect(sum).to.equal(3);

      console.log(form.state.fields)

      expect(form.state.fields.getIn(['enhanced-field', 'value'])).to.equal('foo');
    });
  });
});
