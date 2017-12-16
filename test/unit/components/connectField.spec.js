import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { connectField, Form, Field } from '../../../lib';
import { defer } from '../../common';

describe('connectField', () => {
  it('Wrapped field is registered with proper "fieldPath"', (done) => {
    const CustomField = props => (
      <div>
        <Field.Input {...props} />
      </div>
    );

    const WrappedField = connectField(CustomField);

    const wrapper = mount(
      <Form>
        <WrappedField name="username" required />
      </Form>
    );

    defer(() => {
      const form = wrapper.find(Form).instance();
      expect(form.state.fields.has('username')).to.be.true;

      done();
    });
  });

  it('Wrapped field has access to the native Field props', (done) => {
    const CustomField = props => (
      <div>
        <Field.Input {...props} />
      </div>
    );

    const WrappedField = connectField(CustomField);

    const wrapper = mount(
      <Form>
        <WrappedField name="username" required />
      </Form>
    );

    defer(() => {
      const customField = wrapper.find(CustomField);

      expect(customField.props()).to.have.all.keys([
        'name',
        'required',
        'focused',
        'disabled',
        'validating',
        'validatedSync',
        'validatedAsync',
        'validSync',
        'validAsync',
        'expected',
        'valid',
        'invalid',
        'error'
      ]);

      done();
    });
  });
});
