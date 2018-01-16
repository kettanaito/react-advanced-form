import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { createField, Form } from '../../../lib';
import { defer } from '../../common';

describe('createField', function () {
  it('Supports custom event handlers', () => {
    let sum = 0;

    class CustomComponent extends React.Component {
      handleFocus = () => sum++
      handleBlur = () => sum++

      handleChange = (event) => {
        const { value: nextValue } = event.currentTarget;
        this.props.handleFieldChange({ event, nextValue });

        sum++;
      }

      render() {
        return (<input { ...this.props.fieldProps } onChange={ this.handleChangeFoo } />);
      }
    }

    const EnhancedField = createField({
      mapPropsToField: props => ({
        ...props,
        type: 'text'
      })
    })(CustomComponent);

    const wrapped = mount(
      <Form>
        <EnhancedField name="enhanced-field" />
      </Form>
    );

    defer(async () => {
      const form = wrapped.find(Form).instance();
      const input = wrapped.find(CustomComponent).instance();

      input.handleChange({ currentTarget: { value: 'foo' } });
      expect(sum).to.equal(1);

      input.handleFocus();
      expect(sum).to.equal(2);

      input.handleBlur();
      expect(sum).to.equal(3);

      expect(form.state.fields.getIn(['enhanced-field', 'value'])).to.equal('foo');
    });
  });
});
