import React from 'react';
import { Map } from 'immutable';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Input } from '../../components';
import { defer, validationRules, validationMessages } from '../../utils';
import { FormProvider, Form } from '../../../lib';

describe('FormProvider', function () {
  it('Returns mutable props when not specified otherwise', () => {
    const handleOnChange = ({ fieldProps }) => {
      expect(fieldProps).to.be.instanceOf(Object);
    };

    const wrapper = mount(
      <FormProvider>
        <Form>
          <Input name="foo" onChange={ handleOnChange }/>
        </Form>
      </FormProvider>
    );

    return defer(() => {
      const input = wrapper.find(Input);
      input.simulate('change', { currentTarget: { value: 'foo' } });
    });
  });

  it('Returns Immutable props when specified via "withImmutable" prop', () => {
    const handleOnChange = ({ fieldProps }) => {
      expect(fieldProps).to.be.instanceOf(Map);
    };

    const wrapper = mount(
      <FormProvider withImmutable={ true } >
        <Form>
          <Input name="foo" onChange={ handleOnChange }/>
        </Form>
      </FormProvider>
    );

    return defer(() => {
      const input = wrapper.find(Input);
      input.simulate('change', { currentTarget: { value: 'foo' } });
    });
  });

  it('Propagates "rules" and "messages" down to <Form>', () => {
    const wrapper = mount(
      <FormProvider rules={ validationRules } messages={ validationMessages }>
        <Form />
      </FormProvider>
    );

    const { context: { rules, messages } } = wrapper.find(Form).instance();

    expect(rules.toJS()).to.deep.equal(validationRules);
    expect(messages.toJS()).to.deep.equal(validationMessages);
  });
});
