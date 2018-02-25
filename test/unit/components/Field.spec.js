import { fromJS } from 'immutable';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Input } from '../../components';
import { defer } from '../../utils';
import { Form } from '../../../lib';
import { fieldUtils } from '../../../src/utils';

describe('Field', function () {
  it('"Field.props.ref" references the Field component', () => {
    let ref;

    const wrapper = mount(
      <Form>
        <Input ref={ input => ref = input } name="foo" />
      </Form>
    );

    return defer(() => {
      expect(ref).to.be.an.instanceof(React.Component);
    });
  });

  it('"Field.props.innerRef" references the field element', () => {
    let ref;

    const wrapper = mount(
      <Form>
        <Input innerRef={ element => ref = element } name="foo" />
      </Form>
    );

    return defer(() => {
      expect(ref).to.be.an.instanceof(HTMLElement);
    });
  });

  it('Allows to access "innerRef" through "ref"', () => {
    let ref;

    const wrapper = mount(
      <Form>
        <Input ref={ input => ref = input } name="foo" />
      </Form>
    );

    return defer(() => {
      expect(ref.innerRef).to.be.an.instanceof(HTMLElement);
    });
  });

  it('Allows undefined "initialValue"', () => {
    const initialValue = undefined;

    const createWrapper = () => mount(
      <Form>
        <Input
          name="foo"
          initialValue={ undefined }
          required />
        <Input
          name="abc"
          initialValue={ undefined } />
      </Form>
    );

    expect(createWrapper).not.to.throw();
    const wrapper = createWrapper();

    return defer(() => {
      const form = wrapper.find(Form).instance();
      const input = form.state.fields.get('foo');

      expect(input).to.not.be.undefined;
      expect(input.get('initialValue')).to.equal(undefined);
    });
  });

  it('Validity state update is omitted for validation-free fields', () => {
    const rules = fromJS({
      name: {
        someName: ({ value }) => (value !== '123')
      }
    });

    const wrapper = mount(
      <Form rules={ rules }>
        <Input name="foo" value="123" />
      </Form>
    );

    return defer(async () => {
      const form = wrapper.find(Form).instance();
      const prevFieldProps = form.state.fields.get('foo');
      const prevValidityState = fieldUtils.getValidityState(prevFieldProps);

      await form.validate();

      const nextFieldProps = form.state.fields.get('foo');
      const nextValidityState = fieldUtils.getValidityState(nextFieldProps);

      expect(nextFieldProps.get('validatedSync')).to.be.false;
      expect(nextFieldProps.get('validatedAsync')).to.be.false;
      expect(nextValidityState.equals(prevValidityState));
    });
  });
});