import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Input, Select, Checkbox, Radio, Textarea } from '../../components';
import { FormProvider, Form, Field } from '../../../lib';
import { defer, validationRules, validationMessages } from '../../common';

describe('Form', () => {
  it('"Form.props.ref" references the Form component', () => {
    const handleInnerRef = (formComponent) => {
      expect(formComponent).not.to.be.undefined;
      expect(formComponent).to.be.instanceOf(React.Component);
    }

    const wrapper = mount(
      <Form ref={ handleInnerRef } />
    );
  });

  it('"Form.props.innerRef" references the <form> element', () => {
    const handleInnerRef = (formElement) => {
      expect(formElement).not.to.be.undefined;
      expect(formElement).to.be.instanceOf(HTMLElement);
    }

    const wrapper = mount(
      <Form innerRef={ handleInnerRef } />
    );
  });

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

  it('Return Immutable props when specified in FormProvider', () => {
    const handleOnChange = ({ fieldProps }) => {
      expect(fieldProps.to.be.instanceOf(Map));
    };

    const wrapper = mount(
      <FormProvider withImmutable={ true } >
        <Form>
          <Input name="foo" onChange={ handleOnChange }/>
        </Form>
      </FormProvider>
    );

    return defer(async () => {
      const input = wrapper.find(Input);
      input.simulate('change', { currentTarget: { value: 'foo' } });
    });
  });

  it('Mark form as dirty properly', () => {
    let sum = 0;

    const wrapper = mount(
      <Form onFirstChange={ () => sum++ }>
        <Input name="foo" />
        <Select name="abc" />
      </Form>
    );

    return defer(async () => {
      const input = wrapper.find(Input);
      input.simulate('change', { currentTarget: { value: 'foo' } });
      setTimeout(() => expect(sum).to.equal(1), 10);

      const select = wrapper.find(Select);
      select.simulate('change', { currentTarget: { value: 'foo' } });
      setTimeout(() => expect(sum).to.equal(1), 10);
    });
  });

  it('Supports manual serialization', () => {
    const wrapper = mount(
      <Form rules={ validationRules } messages={ validationMessages }>
        <Input name="username" value="doe" />
        <Field.Group name="primaryInfo">
          <Input name="username" value="foo" />
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

  it('Supports manual validation', () => {
    const wrapper = mount(
      <Form rules={ validationRules } messages={ validationMessages }>
        <Input name="username" required />
      </Form>
    );

    return defer(async () => {
      /* The method should be available */
      const { validate } = wrapper.find(Form).instance();
      expect(validate).to.not.be.undefined;

      /* Should return a promise stating whether the Form is valid */
      const isFormValid = await validate();
      expect(isFormValid).to.be.false;

      /* Should have context props corresponding to the validation status */
      const input = wrapper.find(Input).instance();

      expect(input.contextProps.get('validatedSync')).to.be.true;
      expect(input.contextProps.get('validatedAsync')).to.be.false;
      expect(input.contextProps.get('validSync')).to.be.false;
      expect(input.contextProps.get('validAsync')).to.be.false;
      expect(input.contextProps.get('valid')).to.be.false;
      expect(input.contextProps.get('invalid')).to.be.true;
    });
  });

  it('Supports manual reset', () => {
    let resetCallbackCalled = false;

    function resetCallback({ fields, form }) {
      resetCallbackCalled = true;
      expect(fields).to.be.instanceof(Object);
      expect(form).to.be.instanceof(Object);
    }

    const wrapper = mount(
      <Form
        rules={ validationRules }
        messages={ validationMessages }
        onReset={ resetCallback }>
        <Input id="username" name="username" initialValue="admin" required />
        <Radio name="gender" value="male" />
        <Radio name="gender" value="female" checked />
        <Checkbox name="choice" checked />
        <Select name="number" initialValue="two">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </Select>
        <Textarea name="myTextarea" initialValue="Hello, world!" />
      </Form>
    );

    return defer(async () => {
      const form = wrapper.find(Form).instance();

      /* Simulate the fields change */
      const text = wrapper.find(Input)
      text.simulate('change', { currentTarget: { value: 'pooper' } });

      const radio = wrapper.find('[value="male"]').first();
      radio.simulate('change', { currentTarget: { value: 'male' } });

      const checkbox = wrapper.find('[name="choice"]').first();
      checkbox.simulate('change', { currentTarget: { checked: false } });

      const select = wrapper.find(Select);
      select.simulate('change', { currentTarget: { value: 'three' } });

      const textarea = wrapper.find(Textarea);
      textarea.simulate('change', { currentTarget: { value: 'Goodbye, universe!' } });

      /* The method should be exposed */
      expect(form.reset).to.not.be.undefined;

      form.reset();

      /* Should reset the values of the fields the their initial values */
      expect(form.state.fields.getIn(['username', 'value'])).to.equal('admin');
      expect(form.state.fields.getIn(['gender', 'value'])).to.equal('female');
      expect(form.state.fields.getIn(['choice', 'checked'])).to.be.true;
      expect(form.state.fields.getIn(['number', 'value'])).to.equal('two');
      expect(form.state.fields.getIn(['myTextarea', 'value'])).to.equal('Hello, world!');
      expect(resetCallbackCalled).to.be.true;
    });
  });
});
