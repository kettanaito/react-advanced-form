import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { defer } from '../../utils';
import { createField, Form } from '../../../lib';

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
      mapPropsToField: ({ fieldRecord }) => ({
        ...fieldRecord,
        type: 'text'
      })
    })(CustomComponent);

    const wrapped = mount(
      <Form>
        <EnhancedField name="enhanced-field" />
      </Form>
    );

    return defer(() => {
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
