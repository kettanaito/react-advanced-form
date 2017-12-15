import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { FormProvider, Form, Field } from '../../../lib';
import { defer, validationRules, validationMessages } from '../../common';

describe('Form', () => {
  it('Uses default "action" prop when none provided', () => {
    const wrapper = mount(
      <FormProvider rules={ validationRules } messages={ validationMessages }>
        <Form />
      </FormProvider>
    );

    expect(wrapper.find(Form).props().action).to.not.be.undefined;
  });

  it('Inherits "rules" and "messages" from FormProvider', () => {
    const wrapper = mount(
      <FormProvider rules={ validationRules } messages={ validationMessages }>
        <Form />
      </FormProvider>
    );

    const { context: { rules, messages } } = wrapper.find(Form).instance();

    expect(rules.toJS()).to.deep.equal(validationRules);
    expect(messages.toJS()).to.deep.equal(validationMessages);
  });

  it('Can be serialized manually', () => {
    const wrapper = mount(
      <Form rules={ validationRules } messages={ validationMessages }>
        <Field.Input name="username" value="doe" />
        <Field.Group name="primaryInfo">
          <Field.Input name="username" value="foo" />
        </Field.Group>
      </Form>
    );

    return defer(() => {
      const { serialize } = wrapper.instance();

      expect(serialize).not.to.be.undefined;
      expect(serialize()).to.deep.equal({
        username: 'doe',
        primaryInfo: {
          username: 'foo'
        }
      });
    });
  });

  it('Can be validated manually', () => {
    const wrapper = mount(
      <Form rules={ validationRules } messages={ validationMessages }>
        <Field.Input name="username" required />
      </Form>
    );

    return defer(async () => {
      /* "validate" method should be available */
      const { validate } = wrapper.find(Form).instance();
      expect(validate).to.not.be.undefined;

      /* Should return a promise stating whether the Form is valid */
      const isFormValid = await validate();
      expect(isFormValid).to.be.false;

      /* Should have context props corresponding to the validation status */
      const Input = wrapper.find(Field.Input).instance();
      expect(Input.contextProps.get('validatedSync')).to.be.true;
      expect(Input.contextProps.get('validatedAsync')).to.be.true;
      expect(Input.contextProps.get('validSync')).to.be.false;
      expect(Input.contextProps.get('validAsync')).to.be.false;
      expect(Input.contextProps.get('valid')).to.be.false;
      expect(Input.contextProps.get('invalid')).to.be.true;
    });
  });
});
