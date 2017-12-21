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

  it('Can be reset manually', () => {
    const wrapper = mount(
      <Form rules={ validationRules } messages={ validationMessages }>
        <Field.Input id="username" name="username" initialValue="admin" required />
        <Field.Radio name="gender" value="male" />
        <Field.Radio name="gender" value="female" checked />
        <Field.Checkbox name="choice" checked />
      </Form>
    );

    return defer(async () => {
      /* Simulate fields change */
      const username = wrapper.find(Field.Input);
      username.instance().handleChange({ currentTarget: { value: 'pooper' } });

      const gender = wrapper.find('[value="female"]');
      // gender.instance().handleChange({ })

      // await defer(() => {
      //   username.simulate('change', { target: { value: 'pooper' } });
      // });

      const form = wrapper.find(Form).instance();

      console.log(form.state.fields.get('username').toJS());

      /* The method should be exposed */
      expect(form.reset).to.not.be.undefined;

      form.reset();

      // console.log(form.state.fields.toJS());
      console.log(' ');
      console.log(' ');
      console.log(' ');
      console.log('serialized', form.serialize());

      /* Calling "reset()" should reset the values of all fields in the form */
      expect(form.state.fields.getIn(['username', 'value'])).to.equal('admin');
      expect(form.state.fields.getIn(['gender', 'value'])).to.equal('female');
      expect(form.state.fields.getIn(['choice', 'checked'])).to.be.false;
    });
  });
});
