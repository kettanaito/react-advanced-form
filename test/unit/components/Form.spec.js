import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { FormProvider, Form, Field } from '../../../lib';
import { validationRules, validationMessages } from '../../common';

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

    setTimeout(() => {
      const { serialize } = wrapper.find(Form).instance();

      expect(serialize).not.to.be.undefined;
      expect(serialize()).to.deep.equal({
        username: 'doe',
        primaryInfo: {
          username: 'foo'
        }
      });
    }, 0);
  });
});
